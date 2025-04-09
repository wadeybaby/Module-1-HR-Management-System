// Adding a submit event listener to form 'login-form'
document.querySelector(".login-form")

// Stops page from refreshing
  .addEventListener("submit", function (event) {
    event.preventDefault();

// Values entered by username and password fields
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

// Checking if username and password are correct
    if (username == "HR" && password == "admin123*") {
      alert(`Welcome, ${username}!`);
      window.location.href = "../dashboard/dashboard.html";

// Error message if username and password are incorrect
    } else {
      alert("Please enter the correct password");
    }
  });
