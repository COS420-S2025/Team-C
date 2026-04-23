import { BrowserRouter as Router, Link, Route, Routes } from "react-router";
import "./Navbar.css";
import AccountPage from "../../pages/AccountPage";
import Collection from "../../pages/CardCollection";
import CardSearch from "../../pages/CardSearch";
import Home from "../../pages/home";
import { useState } from "react";
import type { User } from "../../interfaces/User";

export type AccountProps = {
  setUserData: (userData: User | null) => void;
  userData: User | null;
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
      <div className="w-screen flex justify-center items-center fixed top-0">
        <nav className="h-1/10 w-full flex justify-center items-center py-[10px] px-[20px] rounded-[10px] bg-[#003b49] shadow-2xl">
          <ul className="w-full list-none list-image-none flex justify-center items-center">
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
            <Link to="/account" className="app-navbar-item">
              Account
            </Link>
          </ul>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/collection"
          element={
            <Collection
              cards={cards}
              removeCard={removeCard}
              addCard={addCard}
              userData={userData}
            />
          }
        />

        <Route path="/search" element={<CardSearch />} />

        <Route
          path="/account"
          element={
            <AccountPage userData={userData} setUserData={setUserData} />
          }
        />

        <Route path="/all" element={<Home />} />
      </Routes>
    </Router>
  );
}
