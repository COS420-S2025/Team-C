import { Link } from "react-router-dom";

export default function Account(): React.JSX.Element {
  return (
    <div className="app-account">
      <ul className="app-account-options">
        <Link to="/account/sign-up" className="app-account-item">
          Sign Up
        </Link>
        <Link to="/account/log-in" className="app-account-item">
          Log In
        </Link>
      </ul>
    </div>
  );
}
