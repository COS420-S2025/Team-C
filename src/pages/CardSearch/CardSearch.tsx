import React, { useState, useEffect } from "react";
import "./CardSearch.css";
import CardWindow, {
  type CardVersion,
} from "../../components/CardWindow/CardWindow";
import TCGdex, { Query } from "@tcgdex/sdk";

type SearchProps = {
  cards: CardVersion[];
  addCard: (card: CardVersion) => void;
  removeCard: (card: CardVersion) => void;
};

const normalize = (name: string) =>
  name
    .toLowerCase()
    .replace(/\b(ex|gx|v|max|vstar|radiant|mega|tag team)\b/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const isSpecial = (name: string) =>
  /\b(ex|gx|v|max|vstar|radiant|mega|tag team)\b/i.test(name);

const Search: React.FC<SearchProps> = ({ cards, addCard, removeCard }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const q = query.toLowerCase().trim();

    if (!q) {
      setResults([]);
      return;
    }

    const sdk = new TCGdex("en");

    const timer = setTimeout(async () => {
      try {
        let found: any[] =
          q.length <= 2
            ? await sdk.card.list(Query.create())
            : await sdk.card.list(Query.create().like("name", q));

        const map = new Map<string, any>();

        for (const card of found) {
          const base = normalize(card.name);
          const existing = map.get(base);

          if (!existing) {
            map.set(base, card);
            continue;
          }

          const existingSpecial = isSpecial(existing.name);
          const currentSpecial = isSpecial(card.name);

          if (existingSpecial && !currentSpecial) {
            map.set(base, card);
          }
        }

        const unique = Array.from(map.values())
          .filter((c) => normalize(c.name).startsWith(q))
          .slice(0, 20);

        setResults(unique);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
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
            {results.map((card) => {
              const img =
                card.getImageURL?.("high", "png") ||
                card.getImageURL?.("low", "png") ||
                card.getImageURL?.("official", "png") ||
                "";

              return (
                <li
                  key={card.id}
                  className="dropdown-item"
                  onClick={() => setSelected(card.name)}
                >
                  <img
                    src={img}
                    alt={card.name}
                    className="thumb"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />

                  {/* CLEAN NAME ONLY */}
                  <span>{card.name.split(" ")[0]}</span>

                  <div className="types">
                    {card.types?.map((t: string) => (
                      <img
                        key={t}
                        src={`/types/${t}.png`}
                        alt={t}
                        className="type-icon"
                      />
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selected && (
        <CardWindow
          cardName={selected}
          onClose={() => setSelected(null)}
          addToCollection={addCard}
          removeFromCollection={removeCard}
          cards={cards}
        />
      )}
    </div>
  );
};

export default Search;
