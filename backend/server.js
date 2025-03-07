const express = require("express");
const sanitizeHtml = require("sanitize-html");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

const corsOptions = {
  origin: "http://127.0.0.1:5500",
  methods: "GET, POST",
  allowedHeaders: "Content-Type",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/api/submit", (req, res) => {
  const { name, email, honeypot } = req.body;

  if (honeypot) {
    console.warn(`Bot detected from IP: ${req.ip}`);
    return res.status(400).json({ message: "Bot detected" });
  }
  // console.log(`Name: ${name}, Email: ${email}`);

  // Sanitize user input
  const sanitizedName = sanitizeHtml(name);
  const sanitizedEmail = sanitizeHtml(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email format check

  if (!sanitizedName.trim() || !emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ message: "Invalid input detected." });
  }

  // Log submission without exposing email
  console.log(`[${new Date().toISOString()}] Submission from ${req.ip}`);

  // Send generic response (DO NOT include email here)
  res.json({ message: `Thank you, ${sanitizedName}, for your submission!` });
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
