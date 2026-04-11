import { useState } from "react";
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { db, googleAuthProvider } from "../..";
import type { AccountProps } from "../navbar/Navbar";
import { addDoc, collection } from "firebase/firestore";

const Login: React.FC<AccountProps> = ({ userData, setUserData }) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [authing, setAuthing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const signInWithGoogle = () => {
    setAuthing(true);

    // use firebase to sign in
    signInWithPopup(auth, googleAuthProvider)
      .then((response) => {
        console.log(response.user.uid);
        setUserData({
          ...userData,
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });
        addDoc(collection(db, "users"), {
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setAuthing(false);
      });
  };

  const signInWithEmail = () => {
    setAuthing(true);
    setError("");

    // use firebase to sign in
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user.uid);
        setUserData({
          ...userData,
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });
        addDoc(collection(db, "users"), {
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setAuthing(false);
      });
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left side */}
      <div className="w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center"></div>

      {/* Right side */}
      <div className="w-1/2 h-full flex flex-col bg-[#1a1a1a] p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          {/* Header */}
          <div className="w-full flex flex-col mb-10 text-white">
            <h3 className="text-4xl font-bold mb-2">Login</h3>
            <p className="text-lg mb-4">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          {/* Email/Password input fields */}
          <div className="w-full flex flex-col mb-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login button (Email & Password) */}
          <div className="w-full flex flex-col mb-4">
            <button
              className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
              onClick={signInWithEmail}
              disabled={authing}
            >
              Log In With Email and Password
            </button>
          </div>

          {/* Display potential error */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Sign-in option divider */}
          <div className="w-full flex items-center justify-center relative py-4">
            <div className="w-full h-[1px] bg-gray-500"></div>
            <p className="text-lg absolute text-gray-500 bg-[#1a1a1a] px-2">
              OR
            </p>
          </div>

          {/* Login button (Google) */}
          <button
            className="w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-7"
            onClick={signInWithGoogle}
            disabled={authing}
          >
            Log In With Google
          </button>
        </div>

        {/* Signup page */}
        <div className="w-full flex items-center justify-center mt-10">
          <p className="text-sm font-normal text-gray-400">
            Don't have an account?{" "}
            <span className="font-semibold text-white cursor-pointer underline">
              <a href="/signup">Sign Up</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
