import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar(): React.JSX.Element {
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
          <Link to="/account" className="app-navbar-item">
            Account
          </Link>
        </ul>
      </nav>
    </div>
  );
}
