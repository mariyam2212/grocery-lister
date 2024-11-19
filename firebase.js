// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtoIGR3BcJ0-YCcVgdoZ5mEdQ5RxDcR0I",
  authDomain: "grocery-lister-824c4.firebaseapp.com",
  projectId: "grocery-lister-824c4",
  storageBucket: "grocery-lister-824c4.firebasestorage.app",
  messagingSenderId: "675572563850",
  appId: "1:675572563850:web:bd8ac8adf90f75d1c61273",
  measurementId: "G-CZBHVWXJE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth }