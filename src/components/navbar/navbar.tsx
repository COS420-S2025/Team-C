import { BrowserRouter as Router, Link, Route, Routes } from "react-router";
import "./Navbar.css";
import Account from "../../pages/AccountPage";
import Collection from "../../pages/CardCollection/CardCollection";
import Search from "../../pages/CardSearch/CardSearch";
import Home from "../../pages/home";
import UserCollections from "../../pages/UserCollections/UserCollections";

import { useState } from "react";
import type { User } from "../../interfaces/User";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

import { CollectionsProvider } from "../../pages/UserCollections/CollectionContext";

export const SignedIn = ({ currentUser }: { currentUser: User | null }) => {
  return (
    <div>
      {currentUser ? `Signed in as: ${currentUser.name}` : "Not Signed In"}
    </div>
  );
};

export default function Navbar(): React.JSX.Element {
  const [userData, setUserData] = useState<User | null>(null);

  return (
    <CollectionsProvider>
      <Router>
        <div className="app-navbar">
          <nav>
            <ul className="app-navbar-list">
              <Link to="/home" className="app-navbar-item app-navbar-home-link">
                <img
                  src="/home-icon.png"
                  alt="Home"
                  className="app-navbar-home-icon"
                />
              </Link>

              <Link to="/search" className="app-navbar-item">
                Search
              </Link>

              {/* MAIN INVENTORY */}
              <Link to="/collection" className="app-navbar-item">
                My Cards
              </Link>

              {/* USER DECKS / CUSTOM COLLECTIONS */}
              <Link to="/collections" className="app-navbar-item">
                Collections
              </Link>

              {!userData ? (
                <Link to="/login" className="app-navbar-item">
                  Log In
                </Link>
              ) : (
                <SignedIn currentUser={userData} />
              )}
            </ul>
          </nav>
        </div>

        {/* ROUTES */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />

          {/* MAIN CARD INVENTORY */}
          <Route path="/collection" element={<Collection />} />

          {/* USER-CREATED COLLECTIONS */}
          <Route path="/collections" element={<UserCollections />} />

          <Route path="/search" element={<Search />} />
          <Route path="/account" element={<Account />} />

          <Route
            path="/login"
            element={<Login userData={userData} setUserData={setUserData} />}
          />

          <Route
            path="/signup"
            element={<Signup userData={userData} setUserData={setUserData} />}
          />
        </Routes>
      </Router>
    </CollectionsProvider>
  );
}
