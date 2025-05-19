// Initialize Firebase app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();  // ⚠️ This is incorrect for v9 modular, so replace with modular syntax

// CORRECT modular initialization:
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Your config here:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login form submit event
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "index.html";  // Redirect after successful login
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Register function
function register() {
  const email = prompt("Enter your email");
  const password = prompt("Create a password (min 6 characters)");

  if (email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Account created. You can now log in.");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }
}
