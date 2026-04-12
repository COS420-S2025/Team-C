import React, { useState } from "react";
import { useCollections } from "../../pages/UserCollections/CollectionContext";

export default function UserCollections() {
  const { collections, createCollection } = useCollections();
  const [name, setName] = useState("");

  return (
    <div className="app-page">
      <h1>User Collections</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={name}
          placeholder="New collection name"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() => {
            if (!name.trim()) return;
            createCollection(name);
            setName("");
          }}
        >
          Create Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <p>No collections yet</p>
      ) : (
        collections.map((col) => (
          <div key={col.id} className="card-item">
            <h3>{col.name}</h3>
            <p>{col.cards.length} cards</p>
          </div>
        ))
      )}
    </div>
  );
}
