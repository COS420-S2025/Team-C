import React, { createContext, useContext, useState } from "react";
import type { CardVersion } from "../types/CardVersion";
import { db } from "..";
import { doc, setDoc } from "firebase/firestore";
import type { User } from "../interfaces/User";

export type Collection = {
  id: string;
  name: string;
  cards: CardVersion[];
  cover?: string;
};

type CollectionsContextType = {
  main: CardVersion[];
  collections: Collection[];
  addCard: (card: CardVersion, collectionId?: string, userData?: User) => void;
  removeCard: (
    card: CardVersion,
    collectionId?: string,
    userData?: User,
  ) => void;
  createCollection: (name: string) => void;
};

const CollectionsContext: React.Context<CollectionsContextType | null> =
  createContext<CollectionsContextType | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  /** For tests or hydration; not reactive after first mount. */
  initialMain?: CardVersion[];
};

export const CollectionsProvider: React.FC<ProviderProps> = ({
  children,
  initialMain = [],
}) => {
  const [main, setMain] = useState<CardVersion[]>(initialMain);
  const [collections, setCollections] = useState<Collection[]>([]);

  const addCard = (
    card: CardVersion,
    collectionId?: string,
    userData?: User,
  ) => {
    // If a collectionId is provided, treat this as "add to collection",
    // not "add to main". Main additions are explicit (no collectionId).
    if (!collectionId) setMain((prev: CardVersion[]) => [...prev, card]);

    if (collectionId && userData) {
      setCollections((prev: Collection[]) =>
        prev.map((col: Collection) =>
          col.id === collectionId
            ? { ...col, cards: [...col.cards, card] }
            : col,
        ),
      );

      const thisCol: Collection | undefined = collections.find(
        (collection: Collection) =>
          collection.id === collectionId && collection,
      );

      thisCol &&
        setDoc(
          doc(
            db,
            "users",
            userData.uid,
            "collections",
            thisCol.name,
            "cards",
            card.id,
          ),
          {
            id: card.id,
            name: card.name,
            imageURL: card.imageUrl,
            set: card.set,
            rarity: card.rarity,
            releaseDate: card.releaseDate,
            isFoil: card.isFoil,
          },
        );
    }
  };

  const removeCard = (
    card: CardVersion,
    collectionId?: string,
    userData?: User,
  ) => {
    setMain((prev: CardVersion[]) => {
      const idx: number = prev.findIndex((c: CardVersion) => c.id === card.id);
      if (idx === -1) return prev;
      const copy: CardVersion[] = [...prev];
      copy.splice(idx, 1);
      return copy;
    });

    if (collectionId && userData) {
      setCollections((prev: Collection[]) =>
        prev.map((col: Collection) => {
          if (col.id !== collectionId) return col;

          const idx: number = col.cards.findIndex(
            (c: CardVersion) => c.id === card.id,
          );
          if (idx === -1) return col;

          const copy: CardVersion[] = [...col.cards];
          copy.splice(idx, 1);

          return { ...col, cards: copy };
        }),
      );
      setDoc(
        doc(
          db,
          "users",
          userData.uid,
          "collections",
          collectionId,
          "cards",
          card.id,
        ),
        {},
      );
    }
  };

  const createCollection = (name: string) => {
    setCollections((prev: Collection[]) => [
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

export const useCollections = (): CollectionsContextType => {
  const ctx: CollectionsContextType | null = useContext(CollectionsContext);
  if (!ctx) throw new Error("useCollections must be used within provider");
  return ctx;
};
