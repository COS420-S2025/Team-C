import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

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
const googleAuthProvider = new GoogleAuthProvider();
const auth = getAuth();

// From connectAuthEmulator() documentation, function call must
// immediately follow initializing the auth.
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(document.getElementById("root") as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export { app, db, auth, googleAuthProvider };
