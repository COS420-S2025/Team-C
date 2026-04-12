import React, { useEffect, useState } from "react";
import TCGdex, { Query } from "@tcgdex/sdk";
import "./CardWindow.css";
import { useCollections } from "../../pages/UserCollections/CollectionContext";

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
};

const CardWindow: React.FC<CardWindowProps> = ({ cardName, onClose }) => {
  const { main, collections, addCard, removeCard } = useCollections();

  const [versions, setVersions] = useState<CardVersion[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFoil, setIsFoil] = useState(false);

  // 🔥 NEW: selected collections (tags)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const getCountMain = (id: string) => main.filter((c) => c.id === id).length;

  useEffect(() => {
    const sdk = new TCGdex("en");

    const fetch = async () => {
      setLoading(true);
      try {
        const list = await sdk.card.list(Query.create().like("name", cardName));
        const full = await Promise.all(
          list.map((c: any) => sdk.card.get(c.id)),
        );

        const cardsWithSet = await Promise.all(
          full.map(async (c: any) => {
            let releaseDate = "";

            if (c.set?.id) {
              try {
                const setData = await sdk.set.get(c.set.id);
                releaseDate = setData?.releaseDate || "";
              } catch {}
            }

            return {
              id: c.id,
              name: c.name,
              imageUrl: c.getImageURL("high", "png"),
              set: c.set?.name || "Unknown",
              rarity: c.rarity || "Unknown",
              releaseDate,
            };
          }),
        );

        const sorted = cardsWithSet.sort(
          (a, b) =>
            new Date(b.releaseDate || 0).getTime() -
            new Date(a.releaseDate || 0).getTime(),
        );

        setVersions(sorted);
        setSelectedCard(sorted[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [cardName]);

  if (loading || !selectedCard) {
    return <div className="window-backdrop">Loading...</div>;
  }

  return (
    <div className="window-backdrop" onClick={onClose}>
      <div className="window-content" onClick={(e) => e.stopPropagation()}>
        <button className="window-close" onClick={onClose}>
          X
        </button>

        <div className="window-grid">
          {/* IMAGE */}
          <div className="left-panel">
            <img src={selectedCard.imageUrl} />
          </div>

          {/* INFO */}
          <div className="right-panel">
            <h2>{selectedCard.name}</h2>

            {/* VERSION DROPDOWN */}
            <label>Version:</label>
            <select
              value={selectedCard.id}
              onChange={(e) => {
                const found = versions.find((v) => v.id === e.target.value);
                if (found) setSelectedCard(found);
              }}
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.set} — {v.rarity}{" "}
                  {v.releaseDate && `(${v.releaseDate.slice(0, 4)})`}
                </option>
              ))}
            </select>

            {/* 🔥 COLLECTION DROPDOWN */}
            <label>Add to Collection:</label>
            <select
              onChange={(e) => {
                const id = e.target.value;
                if (!id) return;

                if (!selectedCollections.includes(id)) {
                  setSelectedCollections([...selectedCollections, id]);
                }
              }}
            >
              <option value="">Select collection</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>

            {/* 🔥 TAG DISPLAY */}
            <div className="tag-container">
              {selectedCollections.map((id) => {
                const col = collections.find((c) => c.id === id);
                if (!col) return null;

                return (
                  <div key={id} className="tag">
                    {col.name}
                    <span
                      onClick={() =>
                        setSelectedCollections(
                          selectedCollections.filter((c) => c !== id),
                        )
                      }
                    >
                      ✕
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => {
                selectedCollections.forEach((colId) => {
                  addCard({ ...selectedCard, isFoil }, colId);
                });
              }}
            >
              Add to Selected Collections
            </button>

            {/* MAIN COLLECTION */}
            <div className="quantity-stepper">
              <button onClick={() => removeCard(selectedCard)}>−</button>
              <span>{getCountMain(selectedCard.id)}</span>
              <button onClick={() => addCard(selectedCard)}>Add to Main</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardWindow;
