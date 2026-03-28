import React, { useState, useEffect } from "react";
import TCGdex, { Query } from "@tcgdex/sdk";
import "./CardWindow.css";

export type CardVersion = {
  id: string;
  name: string;
  imageUrl: string;
  set?: string;
  rarity?: string;
};

type CardWindowProps = {
  cardName: string;
  onClose: () => void;
  addToCollection: (card: CardVersion) => void;
};

const CardWindow: React.FC<CardWindowProps> = ({ cardName, onClose, addToCollection }) => {
  const [versions, setVersions] = useState<CardVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const sdk = new TCGdex("en");

    const fetchVersions = async () => {
      setLoading(true);
      try {
        const cards = await sdk.card.list(
          Query.create().equal("name", cardName)
        );

        const mapped: CardVersion[] = cards.map((c: any) => ({
          id: c.id,
          name: c.name,
          imageUrl: c.getImageURL("high", "png") || "",
          set: c.set?.name,
          rarity: c.rarity,
        }));

        setVersions(mapped);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Error fetching card versions:", err);
        setVersions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [cardName]);

  const currentCard = versions[currentIndex];

  return (
    <div className="window-backdrop">
      <div className="window-content">
        <button className="window-close" onClick={onClose}>X</button>

        {loading ? (
          <p>Loading card...</p>
        ) : versions.length === 0 ? (
          <p>No versions found for "{cardName}"</p>
        ) : (
          <>
            <h2>{currentCard.name}</h2>

            <img
              src={currentCard.imageUrl}
              alt={currentCard.name}
              className="window-image"
            />

            <p>{currentCard.set}</p>
            <p>{currentCard.rarity}</p>

            <div className="window-controls">
              {versions.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentIndex((currentIndex - 1 + versions.length) % versions.length)
                    }
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex((currentIndex + 1) % versions.length)
                    }
                  >
                    Next
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  addToCollection(currentCard);
                  onClose();
                }}
              >
                Add to Collection
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CardWindow;