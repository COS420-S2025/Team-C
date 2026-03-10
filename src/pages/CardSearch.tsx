import React, { useState } from "react";
import "./CardSearch.css";

export default function Search({ addCard }: any) {

  const [cardName, setCardName] = useState("");

  const handleAdd = () => {
    if (!cardName.trim()) return;

    const newCard = {
      id: Date.now(),
      name: cardName
    };

    addCard(newCard);
    setCardName("");
  };

  return (
    <div className="app-page">
      <h1>Search Page!</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Enter card name"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />

      <button className="add-button" onClick={handleAdd}>
        Add Card
      </button>
    </div>
  );
}