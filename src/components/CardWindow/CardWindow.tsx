import React, { useEffect, useState } from "react";
import "./CardWindow.css";
import { useCollections } from "../../pages/CollectionContext";
import type { CardVersion } from "../../types/card";

export type { CardVersion };

type TcgdexListItem = { id: string };

type TcgdexSetInfo = { name?: string; releaseDate?: string };

type TcgdexFullCard = {
  id: string;
  name: string;
  image?: { high?: string } | string;
  set?: TcgdexSetInfo;
  rarity?: string;
  variant?: string;
};

function toCardVersion(c: TcgdexFullCard): CardVersion {
  const imageUrl =
    typeof c.image === "object" && c.image !== null
      ? c.image.high ?? ""
      : (c.image ?? "");
  return {
    id: c.id,
    name: c.name,
    imageUrl,
    set: c.set?.name ?? "Unknown Set",
    rarity: c.rarity ?? "Unknown Rarity",
    releaseDate: c.set?.releaseDate ?? "9999-01-01",
    isFoil: c.variant === "holo" || c.variant === "reverse",
  };
}

type CardWindowProps = {
  cardName: string;
  onClose: () => void;
};

const CardWindow: React.FC<CardWindowProps> = ({ cardName, onClose }) => {
  const { main, addCard, removeCard, collections } = useCollections();

  const [versions, setVersions] = useState<CardVersion[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [manualFoil, setManualFoil] = useState(false);
  const [loading, setLoading] = useState(true);

  const getCountMain = (id: string) => main.filter((c) => c.id === id).length;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.tcgdex.net/v2/en/cards?name=${encodeURIComponent(cardName)}`,
        );

        const data: unknown = await res.json();

        if (!Array.isArray(data)) {
          setVersions([]);
          setSelectedCard(null);
          setLoading(false);
          return;
        }

        const list = data as TcgdexListItem[];
        const fullCards = await Promise.all(
          list.map(async (item) => {
            const r = await fetch(
              `https://api.tcgdex.net/v2/en/cards/${item.id}`,
            );
            return (await r.json()) as TcgdexFullCard;
          }),
        );

        const mapped: CardVersion[] = fullCards.map((c) => toCardVersion(c));

        mapped.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime(),
        );

        setVersions(mapped);
        setSelectedCard(mapped[0]);
        setSelectedCollections([]);
        setManualFoil(false);
      } catch (err) {
        console.error(err);
        setVersions([]);
        setSelectedCard(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [cardName]);

  if (loading) return <div className="window-backdrop">Loading...</div>;

  if (!selectedCard) {
    return (
      <div className="window-backdrop">
        <div className="window-content">
          <p>Card not found</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const finalFoil = selectedCard.isFoil || manualFoil;

  return (
    <div className="window-backdrop" onClick={onClose}>
      <div className="window-content" onClick={(e) => e.stopPropagation()}>
        <button className="window-close" onClick={onClose}>
          X
        </button>

        <div className="window-grid">
          <div className="left-panel">
            <img src={selectedCard.imageUrl} alt={selectedCard.name} />
          </div>

          <div className="right-panel">
            <h2>{selectedCard.name}</h2>

            {/* VARIANTS */}
            <select
              value={selectedCard.id}
              onChange={(e) => {
                const found = versions.find((v) => v.id === e.target.value);
                if (found) setSelectedCard(found);
              }}
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.set} - {v.rarity}
                </option>
              ))}
            </select>

            {/* FOIL */}
            <label>
              <input
                type="checkbox"
                checked={manualFoil}
                onChange={(e) => setManualFoil(e.target.checked)}
              />
              Foil ✨
            </label>

            <p>Foil: {finalFoil ? "Yes" : "No"}</p>

            {/* COLLECTION SELECT */}
            <select
              value=""
              onChange={(e) => {
                const id = e.target.value;
                if (!id) return;

                setSelectedCollections((prev) =>
                  prev.includes(id) ? prev : [...prev, id],
                );
              }}
            >
              <option value="">Add to collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* TAGS */}
            <div>
              {selectedCollections.map((id) => {
                const col = collections.find((c) => c.id === id);
                if (!col) return null;

                return (
                  <span key={id}>
                    {col.name}
                    <button
                      onClick={() =>
                        setSelectedCollections((prev) =>
                          prev.filter((x) => x !== id),
                        )
                      }
                    >
                      x
                    </button>
                  </span>
                );
              })}
            </div>

            {/* ACTIONS */}
            <button
              onClick={() => {
                selectedCollections.forEach((id) => {
                  addCard({ ...selectedCard, isFoil: finalFoil }, id);
                });
              }}
            >
              Add to Collections
            </button>

            <button
              onClick={() => addCard({ ...selectedCard, isFoil: finalFoil })}
            >
              Add to Main
            </button>

            <button onClick={() => removeCard(selectedCard)}>Remove</button>

            <p>In main: {getCountMain(selectedCard.id)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardWindow;
