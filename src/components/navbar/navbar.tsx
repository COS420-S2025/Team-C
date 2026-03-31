import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./Navbar.css";
import Account from "../../pages/AccountPage";
import Collection from "../../pages/CardCollection";
import Search from "../../pages/CardSearch";
import Home from "../../pages/home";
import { useState } from "react";
import type { User } from "../../interfaces/User";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

export type AccountProps = {
  setUserData: (userData: User | null) => void;
  userData: User | null;
};

export const SignedIn = ({ currentUser }: { currentUser: User | null }) => {
  return (
    <div>
      {currentUser ? `Signed in as: ${currentUser.name}` : "Not Signed In"}
    </div>
  );
};

export default function Navbar(): React.JSX.Element {
  // Stores all cards in the collection
  const [cards, setCards] = useState<any[]>([]);
  const [userData, setUserData] = useState<User | null>(null);

  // Adds a card
  const addCard = (card: any) => {
    setCards([...cards, card]);
  };

  // Removes a card
  const removeCard = (cardToRemove: any) => {
    setCards(cards.filter((card) => card.id !== cardToRemove.id));
  };

  return (
    <Router>
      <div className="app-navbar">
        <nav>
          <ul className="app-navbar-list">
            <Link to="/home" className="app-navbar-item">
              Home
            </Link>
            <Link to="/search" className="app-navbar-item">
              Search
            </Link>
            <Link to="/all" className="app-navbar-item">
              My Cards
            </Link>
            <Link to="/collection" className="app-navbar-item">
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

      {/* Routes */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/collection"
          element={<Collection cards={cards} removeCard={removeCard} />}
        />

        <Route path="/search" element={<Search addCard={addCard} />} />

        <Route path="/account" element={<Account />} />

        <Route path="/all" element={<Home />} />

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
  );
}
