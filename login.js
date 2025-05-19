const auth = firebase.auth();

// Login form submit handler
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login successful
      alert("Login successful!");
      window.location.href = "index.html";  // 👈 Redirect to homepage
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Register new user (optional)
function register() {
  const email = prompt("Enter your email");
  const password = prompt("Create a password (min 6 characters)");

  if (email && password) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert("Account created. You can now log in.");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }
}
