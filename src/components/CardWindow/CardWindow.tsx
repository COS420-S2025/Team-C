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

  const getCountMain = (id: string) => main.filter((c) => c.id === id).length;

  const getCountInCollections = (id: string, colId: string) =>
    collections.find((c) => c.id === colId)?.cards.filter((c) => c.id === id)
      .length ?? 0;

  useEffect(() => {
    const sdk = new TCGdex("en");

    const fetch = async () => {
      setLoading(true);
      const list = await sdk.card.list(Query.create().like("name", cardName));
      const full = await Promise.all(list.map((c: any) => sdk.card.get(c.id)));

      const mapped = full.map((c: any) => ({
        id: c.id,
        name: c.name,
        imageUrl: c.getImageURL("high", "png"),
        set: c.set?.name,
        rarity: c.rarity,
      }));

      setVersions(mapped);
      setSelectedCard(mapped[0]);
      setLoading(false);
    };

    fetch();
  }, [cardName]);

  if (loading || !selectedCard) return <p>Loading...</p>;

  return (
    <div className="window-backdrop" onClick={onClose}>
      <div className="window-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>X</button>

        <img src={selectedCard.imageUrl} />

        <h2>{selectedCard.name}</h2>

        <p>Main collection: {getCountMain(selectedCard.id)}</p>

        <div>
          {collections.map((col) => (
            <p key={col.id}>
              {col.name}: {getCountInCollections(selectedCard.id, col.id)}
            </p>
          ))}
        </div>

        <div className="quantity-stepper">
          <button onClick={() => removeCard({ ...selectedCard, isFoil })}>
            −
          </button>
          <button onClick={() => addCard({ ...selectedCard, isFoil })}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardWindow;
