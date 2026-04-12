import React, { useState } from "react";
import { useCollections } from "../../pages/UserCollections/CollectionContext";
import "./UserCollections.css";
export default function UserCollections() {
  const { collections, createCollection } = useCollections();
  const [name, setName] = useState("");

  return (
    <div className="app-page">
      <h1>User Collections</h1>

      {/* CREATE COLLECTION */}
      <div className="create-collection">
        <input
          type="text"
          placeholder="Enter collection name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={() => {
            if (!name.trim()) return;
            createCollection(name);
            setName("");
          }}
        >
          Create
        </button>
      </div>

      {/* COLLECTION LIST */}
      {collections.length === 0 ? (
        <p>No collections yet.</p>
      ) : (
        <div className="collections-list">
          {collections.map((col) => (
            <div key={col.id} className="collection-card">
              <h3>{col.name}</h3>

              <p className="collection-count">
                {col.cards.length} card
                {col.cards.length !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
