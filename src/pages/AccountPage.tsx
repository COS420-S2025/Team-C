import { useState } from "react";
import Login from "../components/Login/Login";
import Signup from "../components/Signup/Signup";
import type { AccountProps } from "../components/Navbar/Navbar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "..";

export type AccountPageDisplayProps = {
  AccountProps: AccountProps;
  setActivateSignup: (activateSignup: boolean) => void;
};

const Account: React.FC<AccountProps> = ({ userData, setUserData }) => {
  const [activateSignup, setActivateSignup] = useState<boolean>(true);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // I don't know what type is sent when changing
  // an input field, if someone knows or can
  // find out, please change this type declaration
  const handleNameChange = (event: any) => {
    setNewName(event.target.value);
  };

  const handleEmailChange = (event: any) => {
    setNewEmail(event.target.value);
  };

  const handleNameUpdate = async () => {
    if (userData) {
      try {
        const userRef = doc(db, "users", userData.uid);

        await updateDoc(userRef, {
          name: newName,
        });
        setUserData({ ...userData, name: newName });
        setMessage(`Name changed to: ${newName}!`);
        setNewName("");
      } catch (e) {
        if (!(e instanceof Error)) {
          throw e;
        }

        console.error(e.message);
      }
    }
  };

  const handleEmailUpdate = async () => {
    if (userData) {
      try {
        const userRef = doc(db, "users", userData.uid);

        await updateDoc(userRef, { email: newEmail });
        setUserData({ ...userData, email: newEmail });
        setMessage(`Email changed to: ${newEmail}!`);
        setNewEmail("");
      } catch (e) {
        if (!(e instanceof Error)) {
          throw e;
        }

        console.error(e.message);
      }
    }
  };

  // signed in
  if (userData) {
    return (
      <div className="w-full h-screen flex">
        {/* Left side */}
        <div className="w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center"></div>

        {/* Right side */}
        <div className="w-1/2 h-full flex flex-col bg-[#1a1a1a] p-20 justify-center">
          <div className="w-full flex flex-col max-w-[450px] mx-auto">
            {/* Header */}
            <div className="w-full flex flex-col mb-10 text-white">
              <h3 className="text-3xl font-bold mb-2">
                Signed in as: {userData.name}
              </h3>
              {message && <div className="text-lime-400 mb-4">{message}</div>}
              <h2 className="text-lg mb-4">Configuration:</h2>
            </div>
            <div>
              <input
                type="text"
                value={newName}
                className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                placeholder="New Name"
                onChange={handleNameChange}
              />
              <button
                className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                onClick={handleNameUpdate}
              >
                Change Name
              </button>
            </div>
            <div className="my-3"></div>
            <div>
              <input
                type="email"
                value={newEmail}
                className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                placeholder="New Email"
                onChange={handleEmailChange}
              />
              <button
                className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                onClick={handleEmailUpdate}
              >
                Change Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return !activateSignup ? (
    <Login
      AccountProps={{ userData, setUserData }}
      setActivateSignup={setActivateSignup}
    />
  ) : (
    <Signup
      AccountProps={{ userData, setUserData }}
      setActivateSignup={setActivateSignup}
    />
  );
};

export default Account;
