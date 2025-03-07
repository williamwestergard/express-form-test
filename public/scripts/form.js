document
  .getElementById("infoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;

    // Check if the email is empty
    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return; // Stop form submission if email is empty
    }

    // Save email in sessionStorage for later use
    sessionStorage.setItem("userEmail", email);

    // Send data to the server
    fetch("http://localhost:3001/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response (if needed)
        console.log(data);

        // After the server responds successfully, redirect to confirmation page
        window.location.href = "confirmation.html";
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("There was an error submitting your form. Please try again.");
      });
  });
