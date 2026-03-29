import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./Navbar.css";
import Account from "../../pages/account/account";
import Collection from "../../pages/CardCollection";
import Search from "../../pages/CardSearch";
import Home from "../../pages/home";
import { useState } from "react";

export default function Navbar(): React.JSX.Element {
  // Stores all cards in the collection
  const [cards, setCards] = useState<any[]>([]);

  // Adds a card
  const addCard = (card: any) => {
    setCards([...cards, card]);
  };

  // Removes a card
  const removeCard = (cardToRemove: any) => {
    setCards(cards.filter((card) => card.id !== cardToRemove.id));
  };

  return (
    <BrowserRouter>
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
            <Link to="/account" className="app-navbar-item">
              Account
            </Link>
          </ul>
        </nav>
      </div>

      <Routes>
        <Route path="/home" element={<Home />} />

        <Route
          path="/collection"
          element={<Collection cards={cards} removeCard={removeCard} />}
        />

        <Route path="/search" element={<Search addCard={addCard} />} />

        <Route path="/account" element={<Account />} />

        <Route path="/all" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
