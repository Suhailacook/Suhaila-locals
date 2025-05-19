const auth = firebase.auth();

document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "index.html"; // Redirect to homepage or dashboard
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Optional register function
function register() {
  const email = prompt("Enter your email");
  const password = prompt("Create a password (6+ chars)");

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Account created. You can now log in.");
    })
    .catch((error) => {
      alert(error.message);
    });
}
