import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="app-navbar">
      <nav>
        <ul className="app-navbar-list">
          <Link to="/" className="app-navbar-item">
            Home
          </Link>
          <Link to="/search" className="app-navbar-item">
            Search
          </Link>
          <Link to="/cards" className="app-navbar-item">
            My Cards
          </Link>
          <Link to="/collections" className="app-navbar-item">
            Collections
          </Link>
        </ul>
        <ul>
          <Link to="/sign-up" className="app-navbar-item">
            Sign Up
          </Link>
          <Link to="/log-in" className="app-navbar-item">
            Log In
          </Link>
        </ul>
      </nav>
    </div>
  );
}
