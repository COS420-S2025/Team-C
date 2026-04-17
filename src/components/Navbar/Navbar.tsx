import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./Navbar.css";
import Account from "../../pages/AccountPage";
import Collection from "../../pages/CardCollection";
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
    <div className="text-white">
      {currentUser ? `Signed in as: ${currentUser.name}` : "Not Signed In"}
    </div>
  );
};

export default function Navbar(): React.JSX.Element {
  const [userData, setUserData] = useState<User | null>(null);

  return (
    <CollectionsProvider>
      <Router>
        {/* NAVBAR */}
        <div className="w-screen flex justify-center items-center fixed top-0 z-50">
          <nav className="w-full flex justify-center items-center py-[10px] px-[20px] bg-[#003b49] shadow-2xl">
            <ul className="w-full flex justify-center items-center gap-6">
              <Link to="/home" className="app-navbar-item">
                Home
              </Link>

              <Link to="/search" className="app-navbar-item">
                Search
              </Link>

              <Link to="/collection" className="app-navbar-item">
                My Cards
              </Link>

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

        {/* PAGE CONTENT OFFSET (prevents overlap with fixed navbar) */}
        <div className="pt-20">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />

            <Route path="/collection" element={<Collection />} />
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
        </div>
      </Router>
    </CollectionsProvider>
  );
}
