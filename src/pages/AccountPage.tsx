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

  // I don't know what type is sent when changing
  // an input field, if someone knows or can
  // find out, please change this type declaration
  const handleNameChange = (event: any) => {
    setNewName(event.target.value);
  };

  const handleNameUpdate = async () => {
    if (userData) {
      try {
        const userRef = doc(db, "users", userData.uid);

        await updateDoc(userRef, {
          name: newName,
        });
        setUserData({ ...userData, name: newName });
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
              <h2 className="text-lg mb-4">Configuration:</h2>
              <div>
                <p>Update display name:</p>

                <input
                  type="text"
                  className="text-black"
                  placeholder="New Name"
                  onChange={handleNameChange}
                />
                <button onClick={handleNameUpdate}>Change</button>
              </div>
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
