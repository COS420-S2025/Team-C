import { useState } from "react";
import "./CardCollection.css";
import type { CardVersion } from "../components/CardWindow/CardWindow";
import CardWindow from "../components/CardWindow/CardWindow";

type CollectionProps = {
  cards: CardVersion[];
  addCard: (card: CardVersion) => void;
  removeCard: (card: CardVersion) => void;
};

export default function Collection({
  cards,
  addCard,
  removeCard,
}: CollectionProps) {
  const [cardsPerRow, setCardsPerRow] = useState(5);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);

  const groupedCards = Object.values(
    cards.reduce((acc: any, card) => {
      if (!acc[card.id]) acc[card.id] = { ...card, count: 1 };
      else acc[card.id].count++;
      return acc;
    }, {}),
  );

  return (
    <div className="app-page">
      <h1>Collection</h1>

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
          {groupedCards.map((card: any) => (
            <div
              className="card"
              key={card.id}
              onClick={() => setSelectedCard(card)}
            >
              <img src={card.imageUrl} alt={card.name} />
              <p>{card.name}</p>
              {card.set && <p className="card-meta">{card.set}</p>}
              {card.rarity && <p className="card-meta">{card.rarity}</p>}
              {card.count > 1 && (
                <div className="card-count">x{card.count}</div>
              )}
              <button
                className="remove-button"
                onClick={() => removeCard(card)}
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
          addToCollection={addCard}
          removeFromCollection={removeCard}
          cards={cards}
        />
      )}
    </div>
  );
}
