import { useState } from "react";
import Login from "../components/Login/Login";
import Signup from "../components/Signup/Signup";
import type { AccountProps } from "../components/Navbar/Navbar";

export type AccountPageDisplayProps = {
  AccountProps: AccountProps;
  setActivateSignup: (activateSignup: boolean) => void;
};

const Account: React.FC<AccountProps> = ({ userData, setUserData }) => {
  const [activateSignup, setActivateSignup] = useState<boolean>(true);

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
              <h3 className="text-4xl font-bold mb-2">Nice!</h3>
              <p className="text-lg mb-4">You are signed in!</p>
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
