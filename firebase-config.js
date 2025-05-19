// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfdHxXz97_NiIGRj8fjSAm-pSDDZQg_Yw",
  authDomain: "suhaila-df96d.firebaseapp.com",
  projectId: "suhaila-df96d",
  storageBucket: "suhaila-df96d.firebasestorage.app",
  messagingSenderId: "589787271710",
  appId: "1:589787271710:web:eb08f6605930b04561540f",
  measurementId: "G-V24DXFL647"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
