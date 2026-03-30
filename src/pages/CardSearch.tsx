import React, { useState, useEffect } from "react";
import "./CardSearch.css";
import CardWindow, { CardVersion } from "../components/CardWindow/CardWindow";
import TCGdex, { Query } from "@tcgdex/sdk";

type SearchProps = {
  cards: CardVersion[];
  addCard: (card: CardVersion) => void;
  removeCard: (card: CardVersion) => void;
};

const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\b(ex|gx|v|max|vstar|radiant|mega|m)\b/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const Search: React.FC<SearchProps> = ({ cards, addCard, removeCard }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedCardName, setSelectedCardName] = useState<string | null>(null);

useEffect(() => {
  if (!query.trim()) {
    setResults([]);
    return;
  }

  const sdk = new TCGdex("en");

  const debounce = setTimeout(async () => {
    try {
      const found = await sdk.card.list(
        Query.create().like("name", query)
      );

      const pokemonMap = new Map<string, any>();

      found.forEach((c: any) => {
        // 🔥 Extract base Pokémon name (first word only)
        const baseName = c.name.split(" ")[0].toLowerCase();

        // Prefer clean version (no EX/V/etc.)
        const isVariant = /ex|gx|v|max|vstar|radiant/i.test(c.name);

        if (!pokemonMap.has(baseName) || !isVariant) {
          pokemonMap.set(baseName, c);
        }
      });

      const uniquePokemon = Array.from(pokemonMap.values())
        .slice(0, 20); // limit results

      setResults(uniquePokemon);
    } catch (err) {
      console.error(err);
    }
  }, 250);

  return () => clearTimeout(debounce);
}, [query]);

  return (
    <div className="app-page">
      <div className="input-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search Pokémon..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {results.length > 0 && (
          <ul className="dropdown">
            {results.map((card) => (
              <li
                key={card.id}
                onClick={() => setSelectedCardName(card.name)}
                className="dropdown-item"
              >
                {/* Image */}
                <img
                  src={card.getImageURL("low", "png")}
                  alt={card.name}
                  className="thumb"
                />

                {/* Name */}
                <span>{card.name.split(" ")[0]}</span>

                {/* Types */}
                <div className="types">
                  {card.types?.map((type: string) => (
                    <img
                      key={type}
                      src={`/types/${type}.png`}
                      alt={type}
                      className="type-icon"
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedCardName && (
        <CardWindow
          cardName={selectedCardName}
          onClose={() => setSelectedCardName(null)}
          addToCollection={addCard}
          removeFromCollection={removeCard}
          cards={cards}
        />
      )}
    </div>
  );
};

export default Search;