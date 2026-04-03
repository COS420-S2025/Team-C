// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhWZnqJw_qOlb202YztnfxW6CWWJb_qts",
  authDomain: "diecard-e1ee5.firebaseapp.com",
  projectId: "diecard-e1ee5",
  storageBucket: "diecard-e1ee5.firebasestorage.app",
  messagingSenderId: "1054229830881",
  appId: "1:1054229830881:web:13cb36ff31c0828330aba0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Is local?
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { app, db, auth, provider };
