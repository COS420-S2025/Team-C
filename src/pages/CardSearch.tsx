import React, { useState, useEffect, useRef } from "react";
import "./CardSearch.css";
import CardWindow from "../components/CardWindow/CardWindow";

export default function CardSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const cache = useRef<{ [key: string]: any[] }>({});

  useEffect(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      setResults([]);
      return;
    }

    if (cache.current[q]) {
      setResults(cache.current[q]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.tcgdex.net/v2/en/cards?name=${q}`);

        const data = await res.json();

        const seen = new Set<string>();

        const filtered = (data || [])
          .filter((c: any) => {
            if (!c?.name) return false;

            const base = c.name.split(" ")[0];

            if (seen.has(base)) return false;
            seen.add(base);

            return true;
          })
          .slice(0, 20);

        cache.current[q] = filtered;
        setResults(filtered);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="app-page">
      <div className="input-container">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Pokémon..."
        />

        {query && (
          <ul className="dropdown">
            {results.length === 0 ? (
              <li className="dropdown-item">No results</li>
            ) : (
              results.map((card) => (
                <li
                  key={card.id}
                  className="dropdown-item"
                  onClick={() => setSelected(card.name)}
                >
                  <img
                    src={card.image + "/low.png"}
                    alt={card.name}
                    className="thumb"
                  />
                  <span>{card.name}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {selected && (
        <CardWindow cardName={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
