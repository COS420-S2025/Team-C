import React, { useState, useEffect } from "react";
import TCGdex, { Query } from "@tcgdex/sdk";
import "./CardWindow.css";

export type CardVersion = {
  id: string;
  name: string;
  imageUrl: string;
  set?: string;
  rarity?: string;
  releaseDate?: string;
  isFoil?: boolean;
};

type CardWindowProps = {
  cardName: string;
  onClose: () => void;
  addToCollection: (card: CardVersion) => void;
  removeFromCollection: (card: CardVersion) => void;
  cards: CardVersion[];
};

const getVariant = (name: string) => {
  const match = name.match(/\b(ex|gx|v|max|vstar|radiant|tag team)\b/i);
  return match ? match[0].toUpperCase() : "BASE";
};

const CardWindow: React.FC<CardWindowProps> = ({
  cardName,
  onClose,
  addToCollection,
  removeFromCollection,
  cards,
}) => {
  const [versions, setVersions] = useState<CardVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);
  const [isFoil, setIsFoil] = useState(false);

  useEffect(() => {
    const sdk = new TCGdex("en");

    const fetchVersions = async () => {
      setLoading(true);

      try {
        const base = cardName.toLowerCase().trim();

        const list = await sdk.card.list(Query.create().like("name", base));

        const fullCards = await Promise.all(
          list.map((c: any) => sdk.card.get(c.id)),
        );

        const cardsWithSetData = await Promise.all(
          fullCards.map(async (c: any) => {
            let releaseDate = "1900-01-01";

            if (c.set?.id) {
              try {
                const setData = await sdk.set.get(c.set.id);
                if (setData?.releaseDate) {
                  releaseDate = setData.releaseDate;
                }
              } catch {}
            }

            return {
              id: c.id,
              name: c.name,
              imageUrl: c.getImageURL("high", "png") || "/fallback.png",
              set: c.set?.name || "Unknown Set",
              rarity: c.rarity || "Unknown rarity",
              releaseDate,
            };
          }),
        );

        const filtered = cardsWithSetData.filter((c) => {
          const name = c.name.toLowerCase();

          return (
            name.includes(base) &&
            !name.includes("trainer") &&
            !name.includes("item") &&
            !name.includes("energy") &&
            !name.includes("tag team")
          );
        });

        const sorted = filtered.sort(
          (a, b) =>
            new Date(b.releaseDate!).getTime() -
            new Date(a.releaseDate!).getTime(),
        );

        setVersions(sorted);
        setSelectedCard(sorted[0] || null);
        setIsFoil(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [cardName]);

  const getCount = (id: string) => cards.filter((c) => c.id === id).length;

  return (
    <div className="window-backdrop" onClick={onClose}>
      <div className="window-content" onClick={(e) => e.stopPropagation()}>
        <button className="window-close" onClick={onClose}>
          X
        </button>

        {loading || !selectedCard ? (
          <p>Loading...</p>
        ) : (
          <div className="window-grid">
            <div className="left-panel">
              <img src={selectedCard.imageUrl} alt={selectedCard.name} />
            </div>

            <div className="right-panel">
              <h2>{selectedCard.name}</h2>

              <label>Set:</label>
              <select
                value={selectedCard.id}
                onChange={(e) => {
                  const found = versions.find((v) => v.id === e.target.value);
                  if (found) setSelectedCard(found);
                }}
              >
                {versions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.set} ({c.releaseDate?.slice(0, 4)}) — {c.rarity} —{" "}
                    {getVariant(c.name)}
                  </option>
                ))}
              </select>

              <p>{selectedCard.set}</p>
              <p>{selectedCard.rarity}</p>

              {/* FOIL TOGGLE */}
              <div style={{ marginTop: "10px" }}>
                <label
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={isFoil}
                    onChange={() => setIsFoil(!isFoil)}
                  />
                  Foil Version
                </label>
              </div>

              <div className="quantity-stepper">
                <button
                  onClick={() =>
                    removeFromCollection({ ...selectedCard, isFoil })
                  }
                >
                  −
                </button>
                <span>{getCount(selectedCard.id)}</span>
                <button
                  onClick={() => addToCollection({ ...selectedCard, isFoil })}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardWindow;
