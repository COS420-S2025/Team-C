import React, { useState } from "react";
import { useCollections } from "./CollectionContext";
import "./UserCollections.css";

export default function UserCollections() {
  const { collections, createCollection } = useCollections();
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = collections.find((c) => c.id === selectedId);

  return (
    <div className="app-page">
      <h1>User Collections</h1>

      <div className="create-collection">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collection name"
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

      {selected ? (
        <>
          <button onClick={() => setSelectedId(null)}>Back</button>
          <h2>{selected.name}</h2>

          <div className="card-grid">
            {selected.cards.map((card) => (
              <div key={card.id} className="card">
                <img src={card.imageUrl} alt={card.name} />
                <p>{card.name}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="collections-list">
          {collections.map((col) => (
            <div
              key={col.id}
              className="collection-card"
              onClick={() => setSelectedId(col.id)}
            >
              <h3>{col.name}</h3>

              {col.cards[0] && (
                <img
                  src={col.cards[0].imageUrl}
                  width={80}
                  alt={col.cards[0].name}
                />
              )}

              <p>{col.cards.length} cards</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
