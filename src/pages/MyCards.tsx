/**
 * Note: This file was created/updated with assistance from AI tooling.
 * The team reviewed and validated the final implementation.
 */
import { useMemo, useState } from "react";
import "./MyCards.css";
import CardWindow from "../components/CardWindow/CardWindow";
import { useCollections } from "./CollectionContext";
import type { CardVersion } from "../types/CardVersion";
import type { User } from "../interfaces/User";

type MyCardsProps = {
  userData: User | undefined;
};

export default function MyCards({ userData }: MyCardsProps) {
  const { main, addCard, removeCard, tags, cardTagsByCardId } = useCollections();

  const [cardsPerRow, setCardsPerRow] = useState(5);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);

  const [nameQuery, setNameQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [hpSort, setHpSort] = useState<"" | "hp_desc" | "hp_asc">("");
  const [setFilter, setSetFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [attackEnergyCostFilter, setAttackEnergyCostFilter] = useState("");
  const [attackEnergyTypeFilter, setAttackEnergyTypeFilter] = useState("");
  const [weaknessTypeFilter, setWeaknessTypeFilter] = useState("");

  const groupedCards = useMemo(() => {
    return Object.values(
      main.reduce<Record<string, CardVersion & { count: number }>>(
        (acc, card) => {
          if (!acc[card.id]) acc[card.id] = { ...card, count: 1 };
          else acc[card.id].count++;
          return acc;
        },
        {},
      ),
    );
  }, [main]);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    groupedCards.forEach((c) => (c.types ?? []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [groupedCards]);

  const availableSets = useMemo(() => {
    const set = new Set<string>();
    groupedCards.forEach((c) => c.set && set.add(c.set));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [groupedCards]);

  const availableAttackEnergyTypes = useMemo(() => {
    const set = new Set<string>();
    groupedCards.forEach((c) =>
      (c.attackEnergyTypes ?? []).forEach((t) => set.add(t)),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [groupedCards]);

  const availableWeaknessTypes = useMemo(() => {
    const set = new Set<string>();
    groupedCards.forEach((c) =>
      (c.weaknessTypes ?? []).forEach((t) => set.add(t)),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [groupedCards]);

  const filteredCards = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    const energyCost =
      attackEnergyCostFilter.trim() === ""
        ? null
        : Number.parseInt(attackEnergyCostFilter, 10);
    let list = groupedCards.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (typeFilter) {
        const types = c.types ?? [];
        if (!types.includes(typeFilter)) return false;
      }
      if (setFilter && c.set !== setFilter) return false;
      if (tagFilter) {
        const tagIds = cardTagsByCardId[c.id] ?? [];
        if (!tagIds.includes(tagFilter)) return false;
      }
      if (energyCost !== null) {
        if (!Number.isFinite(energyCost)) return false;
        const costs = c.attackEnergyCosts ?? [];
        if (!costs.includes(energyCost)) return false;
      }
      if (attackEnergyTypeFilter) {
        const energies = c.attackEnergyTypes ?? [];
        if (!energies.includes(attackEnergyTypeFilter)) return false;
      }
      if (weaknessTypeFilter) {
        const weaknesses = c.weaknessTypes ?? [];
        if (!weaknesses.includes(weaknessTypeFilter)) return false;
      }
      return true;
    });

    if (hpSort) {
      const dir = hpSort === "hp_desc" ? -1 : 1;
      list = [...list].sort((a, b) => {
        const ha = a.hp ?? Number.NEGATIVE_INFINITY;
        const hb = b.hp ?? Number.NEGATIVE_INFINITY;
        return dir * (ha - hb);
      });
    }

    return list;
  }, [
    groupedCards,
    nameQuery,
    typeFilter,
    hpSort,
    setFilter,
    tagFilter,
    attackEnergyCostFilter,
    attackEnergyTypeFilter,
    weaknessTypeFilter,
    cardTagsByCardId,
  ]);

  const getThumbUrl = (url: string) => {
    if (!url) return "";
    return url.endsWith("/high.png") ? url.replace("/high.png", "/low.png") : url;
  };

  return (
    <div className="app-page">
      <h1>Main Collection</h1>

      <div className="mycards-controls">
        <input
          className="mycards-search"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          placeholder="Search your cards…"
        />

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          {availableTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select value={hpSort} onChange={(e) => setHpSort(e.target.value as typeof hpSort)}>
          <option value="">HP</option>
          <option value="hp_desc">+ HP (High → Low)</option>
          <option value="hp_asc">- HP (Low → High)</option>
        </select>

        <select value={setFilter} onChange={(e) => setSetFilter(e.target.value)}>
          <option value="">All sets</option>
          {availableSets.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          className="mycards-energy-cost"
          value={attackEnergyCostFilter}
          onChange={(e) => setAttackEnergyCostFilter(e.target.value)}
          inputMode="numeric"
          placeholder="Attack energy cost"
        />

        <select
          value={attackEnergyTypeFilter}
          onChange={(e) => setAttackEnergyTypeFilter(e.target.value)}
        >
          <option value="">Any attack energy</option>
          {availableAttackEnergyTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={weaknessTypeFilter}
          onChange={(e) => setWeaknessTypeFilter(e.target.value)}
        >
          <option value="">Any weakness</option>
          {availableWeaknessTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={cardsPerRow}
          onChange={(e) => setCardsPerRow(Number(e.target.value))}
        >
          <option value={3}>3 per row</option>
          <option value={5}>5 per row</option>
          <option value={7}>7 per row</option>
          <option value={10}>10 per row</option>
        </select>
      </div>

      {groupedCards.length === 0 ? (
        <p>No cards added yet!</p>
      ) : filteredCards.length === 0 ? (
        <p>No cards fit this criteria</p>
      ) : (
        <div
          className="card-grid"
          style={{ gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }}
        >
          {filteredCards.map((card) => (
            <div
              className="card"
              key={card.id}
              onClick={() => setSelectedCard(card)}
            >
              <img
                src={getThumbUrl(card.imageUrl)}
                alt={card.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith("/low.png")) img.src = img.src.replace("/low.png", "/high.png");
                }}
              />

              {card.count > 1 && (
                <div className="card-count">x{card.count}</div>
              )}

              <div className="card-stepper" onClick={(e) => e.stopPropagation()}>
                <button
                  className="card-stepper-btn card-stepper-plus"
                  onClick={() => addCard(card)}
                  aria-label={`Add one ${card.name}`}
                  title="Add one"
                >
                  +
                </button>
                <button
                  className="card-stepper-btn card-stepper-minus"
                  onClick={() => removeCard(card)}
                  aria-label={`Remove one ${card.name}`}
                  title="Remove one"
                  disabled={card.count === 0}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCard && (
        <CardWindow
          cardName={selectedCard.name}
          cardId={selectedCard.id}
          onClose={() => setSelectedCard(null)}
          userData={userData}
        />
      )}
    </div>
  );
}
