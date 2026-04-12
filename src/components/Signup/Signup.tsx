import { useState } from "react";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, googleAuthProvider } from "../..";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AccountPageDisplayProps } from "../../pages/AccountPage";

const Signup: React.FC<AccountPageDisplayProps> = ({
  AccountProps,
  setShowSignup,
}) => {
  // State
  const [authing, setAuthing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handling signup

  // Google
  const signUpWithGoogle = () => {
    setAuthing(true);
    setError("");

    signInWithPopup(auth, googleAuthProvider)
      .then(async (response) => {
        const userRef = doc(db, "users", response.user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData) {
          throw new Error(
            "An account using this Google account is already registered!",
          );
        }

        AccountProps.setUserData({
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });

        await setDoc(doc(db, "users", response.user.uid), {
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setAuthing(false);
      });
  };

  // Email & Password
  const signUpWithEmail = async () => {
    // Do passwords match?
    if (password !== passwordConfirm) {
      setError("Passwords do not match!");
      return;
    }

    setAuthing(true);
    setError("");

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        const userRef = doc(db, "users", response.user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData) {
          throw new Error(
            "An account using this Google account is already registered!",
          );
        }

        AccountProps.setUserData({
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });

        await setDoc(doc(db, "users", response.user.uid), {
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });
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
            <h3 className="text-4xl font-bold mb-2">Sign Up</h3>
            <p className="text-lg mb-4">
              Welcome! Please enter your information below.
            </p>
          </div>

          {/* Input Fields */}
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
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {/* Display potential error */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Signup button (Email & Password) */}
          <div className="w-full flex flex-col mb-4">
            <button
              onClick={signUpWithEmail}
              disabled={authing}
              className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
            >
              Sign Up With Email and Password
            </button>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center justify-center relative py-4">
            <div className="w-full h-[1px] bg-gray-500"></div>
            <p className="text-lg absolute text-gray-500 bg-[#1a1a1a] px-2">
              OR
            </p>
          </div>

          {/* Signup button (Google) */}
          <button
            onClick={signUpWithGoogle}
            disabled={authing}
            className="w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-7"
          >
            Sign Up With Google
          </button>
        </div>

        {/* Login page */}
        <div className="w-full flex items-center justify-center mt-10">
          <p className="text-sm font-normal text-gray-400">
            Already have an account?{" "}
            <span className="font-semibold text-white cursor-pointer underline">
              <button
                className="underline"
                onClick={() => setShowSignup(false)}
                disabled={authing}
              >
                Log In
              </button>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
