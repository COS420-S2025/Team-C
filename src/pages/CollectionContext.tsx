import React, { createContext, useContext, useState } from "react";
import type { CardVersion } from "../components/CardWindow/CardWindow";

export type Collection = {
  id: string;
  name: string;
  cards: CardVersion[];
  cover?: string;
};

type CollectionsContextType = {
  main: CardVersion[];
  collections: Collection[];
  addCard: (card: CardVersion, collectionId?: string) => void;
  removeCard: (card: CardVersion, collectionId?: string) => void;
  createCollection: (name: string) => void;
};

const CollectionsContext = createContext<CollectionsContextType | null>(null);

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [main, setMain] = useState<CardVersion[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  const addCard = (card: CardVersion, collectionId?: string) => {
    setMain((prev) => [...prev, card]);

    if (collectionId) {
      setCollections((prev) =>
        prev.map((col) =>
          col.id === collectionId
            ? { ...col, cards: [...col.cards, card] }
            : col,
        ),
      );
    }
  };

  const removeCard = (card: CardVersion, collectionId?: string) => {
    setMain((prev) => {
      const idx = prev.findIndex((c) => c.id === card.id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });

    if (collectionId) {
      setCollections((prev) =>
        prev.map((col) => {
          if (col.id !== collectionId) return col;

          const idx = col.cards.findIndex((c) => c.id === card.id);
          if (idx === -1) return col;

          const copy = [...col.cards];
          copy.splice(idx, 1);

          return { ...col, cards: copy };
        }),
      );
    }
  };

  const createCollection = (name: string) => {
    setCollections((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, cards: [] },
    ]);
  };

  return (
    <CollectionsContext.Provider
      value={{ main, collections, addCard, removeCard, createCollection }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error("useCollections must be used within provider");
  return ctx;
};
