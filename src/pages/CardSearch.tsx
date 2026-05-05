/**
 * Note: This file was created/updated with assistance from AI tooling.
 * The team reviewed and validated the final implementation.
 */
import { useState, useEffect, useRef } from "react";
import "./CardSearch.css";
import CardWindow from "../components/CardWindow/CardWindow";
import type { User } from "../interfaces/User";

type SearchListItem = {
  id: string;
  name: string;
  image: string;
};

type CardSearchProps = {
  userData: User | undefined;
};

export default function CardSearch({ userData }: CardSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchListItem[]>([]);
  const [selected, setSelected] = useState<SearchListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [typesByCardId, setTypesByCardId] = useState<Record<string, string[]>>({});

  const cache = useRef<Record<string, SearchListItem[]>>({});
  const inflightTypes = useRef<Record<string, boolean>>({});
  const typesByCardIdRef = useRef<Record<string, string[]>>({});
  const latestRequestId = useRef(0);

  const getTypeIconSrc = (type: string) => `/Types/${encodeURIComponent(type)}.svg`;
  const getThumbSrc = (image: unknown) =>
    typeof image === "string" && image ? `${image}/low.png` : "";

  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    const cacheKey = q.toLowerCase();
    if (cache.current[cacheKey]) {
      setResults(cache.current[cacheKey]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const requestId = ++latestRequestId.current;
        setLoading(true);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);

        const res = await fetch(
          `https://api.tcgdex.net/v2/en/cards?name=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        );
        clearTimeout(timeout);

        // Only apply results for the newest request.
        if (requestId !== latestRequestId.current) return;

        const data: unknown = await res.json();
        if (!Array.isArray(data)) {
          setResults([]);
          setLoading(false);
          return;
        }

        const seen = new Set<string>();

        const filtered = (data as SearchListItem[])
          .filter((c) => {
            if (!c?.name) return false;
            const base = c.name.split(" ")[0];
            if (seen.has(base)) return false;
            seen.add(base);
            return true;
          })
          .slice(0, 20);

        cache.current[cacheKey] = filtered;
        setResults(filtered);
        setLoading(false);
      } catch (err) {
        // Only end loading state if this request is still the latest one.
        console.error(err);
        setResults([]);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    // Fetch card types for the dropdown (best-effort, cached per card id).
    // We keep this separate from the search request to preserve responsiveness.
    results.forEach((card) => {
      if (!card?.id) return;
      if (typesByCardIdRef.current[card.id]) return;
      if (inflightTypes.current[card.id]) return;

      inflightTypes.current[card.id] = true;
      fetch(`https://api.tcgdex.net/v2/en/cards/${card.id}`)
        .then((r) => r.json())
        .then((data: unknown) => {
          const types =
            data && typeof data === "object" && Array.isArray((data as { types?: unknown }).types)
              ? ((data as { types: unknown[] }).types.filter((t): t is string => typeof t === "string") as string[])
              : [];
          if (types.length) {
            setTypesByCardId((prev) => {
              const next = { ...prev, [card.id]: types };
              typesByCardIdRef.current = next;
              return next;
            });
          }
        })
        .catch(() => {
          // ignore
        })
        .finally(() => {
          inflightTypes.current[card.id] = false;
        });
    });
  }, [results]);

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
              <li className="dropdown-item">{loading ? "Loading..." : "No results"}</li>
            ) : (
              results.map((card) => (
                <li
                  key={card.id}
                  className="dropdown-item"
                  onClick={() => setSelected(card)}
                >
                  <img
                    src={getThumbSrc(card.image)}
                    alt={card.name}
                    className="thumb"
                  />
                  {typesByCardId[card.id]?.[0] && (
                    <img
                      src={getTypeIconSrc(typesByCardId[card.id][0])}
                      alt={typesByCardId[card.id][0]}
                      className="type-icon"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span>{card.name}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {selected && (
        <CardWindow
          cardName={selected.name}
          cardId={selected.id}
          onClose={() => setSelected(null)}
          userData={userData}
        />
      )}
    </div>
  );
}
