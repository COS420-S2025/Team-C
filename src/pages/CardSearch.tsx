import React, { useState, useEffect } from "react";
import "./CardSearch.css";
import CardWindow, { CardVersion } from "../components/CardWindow/CardWindow";
import TCGdex, { Query } from "@tcgdex/sdk";

type SearchProps = {
  addCard: (card: CardVersion) => void;
};

const Search: React.FC<SearchProps> = ({ addCard }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CardVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    const sdk = new TCGdex("en");

    const debounce = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch a broad set of cards first (example: all cards).
        // Then fuzzy‑filter client‑side to match your “in‑order letters” rule.
        const allCards = await sdk.card.list(); 

        const mapped: CardVersion[] = allCards.map((c: any) => ({
          id: c.id,
          name: c.name,
          imageUrl: c.getImageURL("high", "png") || "",
        }));

        // filter fuzzy: letters in the order typed
        const filtered = mapped.filter(card => {
          const name = card.name.toLowerCase();
          const q = query.toLowerCase();
          let idx = 0;
          for (let char of q) {
            idx = name.indexOf(char, idx);
            if (idx === -1) return false;
            idx++;
          }
          return true;
        });

        // keep unique names
        const unique = Array.from(
          new Map(filtered.map(c => [c.name.toLowerCase(), c])).values()
        );

        setResults(unique);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="app-page">
      <div className="input-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search for Pokémon cards"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
        />

        {loading && <p>Searching...</p>}

        {showDropdown && results.length > 0 && (
          <ul className="dropdown">
            {results.map((card) => (
              <li key={card.id} onClick={() => setSelectedCardName(card.name)}>
                {card.name}
              </li>
            ))}
          </ul>
        )}

        {showDropdown && results.length === 0 && !loading && <p>No cards found</p>}
      </div>

      {selectedCardName && (
        <CardWindow
          cardName={selectedCardName}
          onClose={() => setSelectedCardName(null)}
          addToCollection={(card: CardVersion) => {
            addCard(card);
            setSelectedCardName(null);
          }}
        />
      )}
    </div>
  );
};

export default Search;