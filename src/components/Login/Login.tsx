import React from "react";
import "./Login.css";
import { User } from "../../interfaces/User";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Auth, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../firebase-config";
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";

async function createUser({
  auth,
  c,
}: {
  auth: Auth;
  c: CollectionReference<DocumentData>;
}) {
  if (
    !auth.currentUser ||
    !auth.currentUser.emailVerified ||
    !auth.currentUser.email
  ) {
    return;
  }

  const user = {
    uid: auth.currentUser.uid,
    name: "",
  };

  await addDoc(c, user);
}

export async function firebaseUser({
  auth,
  setUserData,
}: {
  auth: Auth;
  setUserData: (userData: User | null) => void;
}) {
  const c = collection(db, "users");
  const user = await getDocs(
    query(c, where("uid", "==", auth.currentUser?.uid)),
  );

  if (user.size === 0) {
    await createUser({ auth, c });
  }

  if (
    auth.currentUser &&
    auth.currentUser.email &&
    auth.currentUser.emailVerified
  ) {
    setUserData({
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName,
    });
    console.log(
      `Firebase user ${auth.currentUser.displayName} created with UUID ${auth.currentUser.uid}`,
    );
  }
}

function GoogleLogin({
  setUserData,
  nav,
}: {
  setUserData: (userData: User | null) => void;
  nav: NavigateFunction;
}) {
  signInWithPopup(auth, provider).then((result) => {
    localStorage.setItem("isAuth", "true");
    firebaseUser({ auth, setUserData }).then((result) => {
      console.log("User Set");
      console.log(auth.currentUser?.uid);
    });
    nav("/home");
  });
}

export default function Login({
  setUserData,
}: {
  setUserData: (userData: User | null) => void;
}) {
  let nav = useNavigate();
  return (
    <div
      className="app-navbar-item"
      onClick={() => {
        GoogleLogin({ setUserData, nav });
      }}
    >
      Log In
    </div>
  );
}
