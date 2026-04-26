import React, { useEffect, useState } from "react";
import "./CardWindow.css";
import { useCollections, type Collection } from "../../pages/CollectionContext";
import type { CardVersion } from "../../types/card";
import type { User } from "../../interfaces/User";

export type { CardVersion };

type TcgdexListItem = { id: string };

type TcgdexSetInfo = { name?: string; releaseDate?: string };

type TcgdexFullCard = {
  id: string;
  name: string;
  localId?: string;
  // tcgdex returns either:
  // - base path string (used like `${image}/high.png`)
  // - object with `high`/`low` URLs
  image?: { high?: string; low?: string } | string;
  set?: TcgdexSetInfo;
  rarity?: string;
  variant?: string;
};

function toCardVersion(c: TcgdexFullCard): CardVersion {
  const imageUrl =
    typeof c.image === "string"
      ? `${c.image}/high.png`
      : (c.image?.high ?? c.image?.low ?? "");
  return {
    id: c.id,
    name: c.name,
    imageUrl,
    set: c.set?.name ?? "Unknown Set",
    rarity: c.rarity ?? "Unknown Rarity",
    releaseDate: c.set?.releaseDate ?? "",
    numberInSet: c.localId ?? "",
    isFoil: c.variant === "holo" || c.variant === "reverse",
  };
}

type CardWindowProps = {
  cardName: string;
  onClose: () => void;
  userData: User | undefined;
};

const CardWindow: React.FC<CardWindowProps> = ({
  cardName,
  onClose,
  userData,
}) => {
  const { main, addCard, removeCard, collections } = useCollections();

  const [versions, setVersions] = useState<CardVersion[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);

  const [manualFoilById, setManualFoilById] = useState<Record<string, boolean>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  const getCountMain = (id: string) => main.filter((c) => c.id === id).length;
  const getReleaseMs = (v: CardVersion) =>
    v.releaseDate ? new Date(v.releaseDate).getTime() : Number.NEGATIVE_INFINITY;
  const getSetYear = (v: CardVersion) =>
    v.releaseDate ? String(new Date(v.releaseDate).getFullYear()) : "—";

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
          (a, b) => getReleaseMs(b) - getReleaseMs(a),
        );

        setVersions(mapped);
        setSelectedCard(mapped[0]);
        setManualFoilById({});
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

  const manualFoil = manualFoilById[selectedCard.id] ?? false;
  const finalFoil = selectedCard.isFoil || manualFoil;
  const mainCount = getCountMain(selectedCard.id);
  const collectionsContainingCard = collections.filter((c) =>
    c.cards.some((x) => x.id === selectedCard.id),
  );

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
                  {v.set} ({getSetYear(v)})
                  {v.numberInSet ? ` #${v.numberInSet}` : ""} - {v.rarity}
                </option>
              ))}
            </select>

            {/* FOIL */}
            <label>
              <input
                type="checkbox"
                checked={manualFoil}
                onChange={(e) =>
                  setManualFoilById((prev) => ({
                    ...prev,
                    [selectedCard.id]: e.target.checked,
                  }))
                }
              />
              Foil ✨
            </label>

            {/* COLLECTION SELECT */}
            <select
              value=""
              onChange={(e) => {
                const id = e.target.value;
                if (!id) return;
                if (collectionsContainingCard.some((c) => c.id === id)) return;
                addCard({ ...selectedCard, isFoil: finalFoil }, id, userData);
              }}
            >
              <option value="">Add to collection</option>
              {collections.map((c: Collection) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* TAGS */}
            <div className="collection-tags">
              {collectionsContainingCard.map((col) => (
                <span key={col.id} className="collection-tag">
                  {col.name}
                  <button
                    className="collection-tag-remove"
                    onClick={() =>
                      removeCard(selectedCard, col.id, userData)
                    }
                    aria-label={`Remove from ${col.name}`}
                    title={`Remove from ${col.name}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>

            {/* MAIN COUNT CONTROL */}
            <div className="main-count-row">
              <span className="main-count-label">In main:</span>
              <span className="main-count-value">{mainCount}</span>
              <button
                className="main-count-btn main-count-plus"
                onClick={() => addCard({ ...selectedCard, isFoil: finalFoil })}
                aria-label="Add one to main"
                title="Add one"
              >
                +
              </button>
              <button
                className="main-count-btn main-count-minus"
                onClick={() => removeCard(selectedCard)}
                aria-label="Remove one from main"
                title="Remove one"
                disabled={mainCount === 0}
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardWindow;
