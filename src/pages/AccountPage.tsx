import { useState } from "react";
import Login from "../components/Login/Login";
import Signup from "../components/Signup/Signup";
import type { AccountProps } from "../components/Navbar/Navbar";

export type AccountPageDisplayProps = {
  AccountProps: AccountProps;
  setActivateSignup: (activateSignup: boolean) => void;
};

const Account: React.FC<AccountProps> = ({ userData, setUserData }) => {
  const [activateSignup, setActivateSignup] = useState<boolean>(false);

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
