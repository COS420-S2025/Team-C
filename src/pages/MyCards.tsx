import { useState } from "react";
import "./MyCards.css";
import CardWindow from "../components/CardWindow/CardWindow";
import { useCollections } from "./CollectionContext";
import type { CardVersion } from "../types/CardVersion";
import type { User } from "../interfaces/User";

type MyCardsProps = {
  userData: User | undefined;
};

export default function MyCards({ userData }: MyCardsProps) {
  const { main, removeCard } = useCollections();

  const [cardsPerRow, setCardsPerRow] = useState(5);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);

  const groupedCards = Object.values(
    main.reduce<Record<string, CardVersion & { count: number }>>(
      (acc, card) => {
        if (!acc[card.id]) acc[card.id] = { ...card, count: 1 };
        else acc[card.id].count++;
        return acc;
      },
      {},
    ),
  );

  return (
    <div className="app-page">
      <h1>Main Collection</h1>

      <select
        value={cardsPerRow}
        onChange={(e) => setCardsPerRow(Number(e.target.value))}
      >
        <option value={3}>3 per row</option>
        <option value={5}>5 per row</option>
        <option value={7}>7 per row</option>
        <option value={10}>10 per row</option>
      </select>

      {groupedCards.length === 0 ? (
        <p>No cards added yet!</p>
      ) : (
        <div
          className="card-grid"
          style={{ gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }}
        >
          {groupedCards.map((card) => (
            <div
              className="card"
              key={card.id}
              onClick={() => setSelectedCard(card)}
            >
              <img src={card.imageUrl} alt={card.name} />
              <p>{card.name}</p>

              {card.count > 1 && (
                <div className="card-count">x{card.count}</div>
              )}

              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCard(card);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCard && (
        <CardWindow
          cardName={selectedCard.name}
          onClose={() => setSelectedCard(null)}
          userData={userData}
        />
      )}
    </div>
  );
}
