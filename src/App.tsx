import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< account-page-branch
import Home from "./pages/home";
import Account from "./pages/account/account";
import Signup from "./pages/account/signup";
import LoginPage from "./pages/account/login";
import Navbar from "./components/Navbar/Navbar";

function App(): React.JSX.Element {
  const [token, setToken] = useState();

  return (
    <div className="app">
      <BrowserRouter>
        {/* Navigation */}
        <Navbar />

        {/* Site Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/sign-up" element={<Signup />} />
          <Route
            path="/account/log-in"
            element={<LoginPage setToken={setToken} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
=======

import Home from "./pages/home";
import Collection from "./pages/CardCollection";
import Search from "./pages/CardSearch";
import Navbar from "./components/navbar/navbar";

function App() {

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
      <Navbar />

      <Routes>
        <Route path="/home" element={<Home />} />

        <Route
          path="/collection"
          element={<Collection cards={cards} removeCard={removeCard} />}
        />

        <Route
          path="/search"
          element={<Search addCard={addCard} />}
        />

        <Route path="/all" element={<Home />} />
      </Routes>
    </BrowserRouter>
>>>>>>> sprint-2
  );
}

export default App;