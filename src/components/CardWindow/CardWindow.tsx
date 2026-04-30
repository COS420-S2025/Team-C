/**
 * Note: This file was created/updated with assistance from AI tooling.
 * The team reviewed and validated the final implementation.
 */
import React, { useEffect, useState } from "react";
import "./CardWindow.css";
import { useCollections, type Collection } from "../../pages/CollectionContext";
import type { CardVersion } from "../../types/CardVersion";
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
  set?: TcgdexSetInfo & { id?: string };
  rarity?: string;
  variant?: string;
  types?: string[];
  hp?: number | string;
  attacks?: Array<{ cost?: string[] | null }>;
  weaknesses?: Array<{ type?: string | null }>;
};

function toCardVersion(c: TcgdexFullCard): CardVersion {
  const imageUrl =
    typeof c.image === "string"
      ? `${c.image}/high.png`
      : (c.image?.high ?? c.image?.low ?? "");
  const hp =
    typeof c.hp === "number"
      ? c.hp
      : typeof c.hp === "string"
        ? Number.parseInt(c.hp, 10)
        : undefined;

  const allAttackCosts = (c.attacks ?? [])
    .map((a) => (Array.isArray(a?.cost) ? a.cost.filter(Boolean) : []))
    .filter((x) => x.length > 0);
  const costTotals = allAttackCosts.map((cost) => cost.length);
  const attackEnergyCosts = Array.from(new Set(costTotals)).sort(
    (a, b) => a - b,
  );
  const attackEnergyTypes = Array.from(
    new Set(
      allAttackCosts
        .flat()
        .filter((x): x is string => typeof x === "string" && !!x),
    ),
  );
  const weaknessTypes = Array.from(
    new Set(
      (c.weaknesses ?? [])
        .map((w) => w?.type)
        .filter((x): x is string => typeof x === "string" && !!x),
    ),
  );

  return {
    id: c.id,
    name: c.name,
    imageUrl,
    set: c.set?.name ?? "Unknown Set",
    setId: c.set?.id,
    rarity: c.rarity ?? "Unknown Rarity",
    releaseDate: c.set?.releaseDate ?? "",
    numberInSet: c.localId ?? "",
    isFoil: c.variant === "holo" || c.variant === "reverse",
    types: Array.isArray(c.types) ? c.types : undefined,
    hp: Number.isFinite(hp) ? hp : undefined,
    attackEnergyTypes: attackEnergyTypes.length ? attackEnergyTypes : undefined,
    minAttackEnergyCost: costTotals.length
      ? Math.min(...costTotals)
      : undefined,
    maxAttackEnergyCost: costTotals.length
      ? Math.max(...costTotals)
      : undefined,
    attackEnergyCosts: attackEnergyCosts.length ? attackEnergyCosts : undefined,
    weaknessTypes: weaknessTypes.length ? weaknessTypes : undefined,
  };
}

type CardWindowProps = {
  cardName: string;
  cardId?: string;
  onClose: () => void;
  userData: User | undefined;
};

const CardWindow: React.FC<CardWindowProps> = ({
  cardName,
  cardId,
  onClose,
  userData,
}) => {
  const {
    main,
    addCard,
    removeCard,
    collections,
    tags,
    cardTagsByCardId,
    createTag,
    assignTagToCard,
    removeTagFromCard,
  } = useCollections();

  const [versions, setVersions] = useState<CardVersion[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);

  const [manualFoilById, setManualFoilById] = useState<Record<string, boolean>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  const [tagSelectValue, setTagSelectValue] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState<
    "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "violet"
  >("red");

  const getCountMain = (id: string) => main.filter((c) => c.id === id).length;
  const getReleaseMs = (v: CardVersion) =>
    v.releaseDate
      ? new Date(v.releaseDate).getTime()
      : Number.NEGATIVE_INFINITY;
  const getSetYear = (v: CardVersion): string | null =>
    v.releaseDate ? String(new Date(v.releaseDate).getFullYear()) : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setCreatingTag(false);
      setNewTagName("");
      setTagSelectValue("");

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

        // Sort versions by release date (newest → oldest), then by set/name for stability.
        mapped.sort((a, b) => {
          const d = getReleaseMs(b) - getReleaseMs(a);
          if (d !== 0) return d;
          const s = (a.set ?? "").localeCompare(b.set ?? "");
          if (s !== 0) return s;
          return (a.numberInSet ?? "").localeCompare(b.numberInSet ?? "");
        });

        setVersions(mapped);
        const preferred =
          (cardId ? mapped.find((m) => m.id === cardId) : undefined) ??
          mapped[0];
        setSelectedCard(preferred ?? null);
        setManualFoilById({});
      } catch (err) {
        console.error(err);
        setVersions([]);
        setSelectedCard(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [cardName, cardId]);

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
  const assignedTagIds = cardTagsByCardId[selectedCard.id] ?? [];
  const assignedTags = assignedTagIds
    .map((id) => tags.find((t) => t.id === id))
    .filter(Boolean) as typeof tags;
  const availableTags = tags.filter((t) => !assignedTagIds.includes(t.id));

  return (
    <div className="window-backdrop" onClick={onClose}>
      <div className="window-content" onClick={(e) => e.stopPropagation()}>
        <button className="window-close" onClick={onClose}>
          X
        </button>

        <div className="window-grid">
          <div className="left-panel">
            <img
              src={selectedCard.imageUrl}
              alt={selectedCard.name}
              loading="eager"
              decoding="async"
              onError={(e) => {
                const img = e.currentTarget;
                // If high-res fails, try low-res before giving up.
                if (img.src.endsWith("/high.png")) {
                  img.src = img.src.replace("/high.png", "/low.png");
                }
              }}
            />
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
                  {(() => {
                    const year = getSetYear(v);
                    return `${v.set}${year ? ` (${year})` : ""}`;
                  })()}
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
                    onClick={() => removeCard(selectedCard, col.id, userData)}
                    aria-label={`Remove from ${col.name}`}
                    title={`Remove from ${col.name}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>

            {/* CUSTOM TAGS */}
            <select
              value={tagSelectValue}
              onChange={(e) => {
                const val = e.target.value;
                setTagSelectValue(val);
                if (!val) return;
                if (val === "__new__") {
                  setCreatingTag(true);
                  return;
                }
                assignTagToCard(selectedCard.id, val);
                setTagSelectValue("");
              }}
            >
              <option value="">Add tag</option>
              {availableTags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
              <option value="__new__">New tag…</option>
            </select>

            {creatingTag && (
              <div className="tag-create-row">
                <input
                  className="tag-name-input"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name"
                />
                <select
                  value={newTagColor}
                  onChange={(e) =>
                    setNewTagColor(
                      e.target.value as
                        | "red"
                        | "orange"
                        | "yellow"
                        | "green"
                        | "blue"
                        | "indigo"
                        | "violet",
                    )
                  }
                >
                  <option value="red">Red</option>
                  <option value="orange">Orange</option>
                  <option value="yellow">Yellow</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="indigo">Indigo</option>
                  <option value="violet">Violet</option>
                </select>
                <button
                  onClick={() => {
                    const id = createTag(newTagName, newTagColor);
                    if (id) assignTagToCard(selectedCard.id, id);
                    setNewTagName("");
                    setCreatingTag(false);
                    setTagSelectValue("");
                  }}
                  disabled={!newTagName.trim()}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setCreatingTag(false);
                    setNewTagName("");
                    setTagSelectValue("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {assignedTags.length > 0 && (
              <div className="custom-tags">
                {assignedTags.map((t) => (
                  <span
                    key={t.id}
                    className={`custom-tag-pill custom-tag-${t.color}`}
                  >
                    {t.name}
                    <button
                      className="collection-tag-remove"
                      onClick={() => removeTagFromCard(selectedCard.id, t.id)}
                      aria-label={`Remove tag ${t.name}`}
                      title={`Remove tag ${t.name}`}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}

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
