/**
 * Note: This file was created/updated with assistance from AI tooling.
 * The team reviewed and validated the final implementation.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CardVersion } from "../types/CardVersion";
import { db } from "..";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import type { User } from "../interfaces/User";

export type Collection = {
  id: string;
  name: string;
  cards: CardVersion[];
  cover?: string;
};

export type TagColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "violet";

export type CardTag = {
  id: string;
  name: string;
  color: TagColor;
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
  createCollection: (name: string, userData?: User) => void;
  tags: CardTag[];
  cardTagsByCardId: Record<string, string[]>;
  createTag: (name: string, color: TagColor) => string;
  assignTagToCard: (cardId: string, tagId: string) => void;
  removeTagFromCard: (cardId: string, tagId: string) => void;
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

  const [tags, setTags] = useState<CardTag[]>([]);
  const [cardTagsByCardId, setCardTagsByCardId] = useState<
    Record<string, string[]>
  >({});

  const storageKeys = useMemo(() => {
    // Persist tags for anonymous users too, but separate from any signed-in account.
    // If the user later signs in, we keep the anonymous data available under its key.
    return {
      tags: "tc_tags_v1",
      assignments: "tc_tag_assignments_v1",
    };
  }, []);

  useEffect(() => {
    try {
      const rawTags = localStorage.getItem(storageKeys.tags);
      const rawAssignments = localStorage.getItem(storageKeys.assignments);
      if (rawTags) setTags(JSON.parse(rawTags) as CardTag[]);
      if (rawAssignments)
        setCardTagsByCardId(
          JSON.parse(rawAssignments) as Record<string, string[]>,
        );
    } catch {
      // ignore corrupt storage
    }
  }, [storageKeys]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKeys.tags, JSON.stringify(tags));
      localStorage.setItem(
        storageKeys.assignments,
        JSON.stringify(cardTagsByCardId),
      );
    } catch {
      // ignore quota / blocked storage
    }
  }, [tags, cardTagsByCardId, storageKeys]);

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
        updateDoc(doc(db, "users", userData.uid, "collections", thisCol.name), {
          [`cards.${card.id}`]: {
            id: card.id,
            name: card.name,
            imageUrl: card.imageUrl,
            set: card.set,
            setId: card.setId,
            rarity: card.rarity,
            releaseDate: card.releaseDate,
            numberInSet: card.numberInSet,
            isFoil: card.isFoil,
            types: card.types,
            hp: card.hp,
            attackEnergyTypes: card.attackEnergyTypes ?? [],
            minAttackEnergyCost: card.minAttackEnergyCost ?? null,
            maxAttackEnergyCost: card.maxAttackEnergyCost ?? null,
            attackEnergyCosts: card.attackEnergyCosts ?? [],
            weaknessTypes: card.weaknessTypes ?? [],
          },
        });
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

  const createCollection = (name: string, userData?: User) => {
    if (userData) {
      const randUUID = crypto.randomUUID();
      setCollections((prev: Collection[]) => [
        ...prev,
        { id: randUUID, name, cards: [] },
      ]);
      setDoc(doc(db, "users", userData.uid, "collections", name), {
        id: randUUID,
        name: name,
        cards: [],
      });
    }
  };

  const createTag = (name: string, color: TagColor) => {
    const trimmed = name.trim();
    if (!trimmed) return "";

    const existing = tags.find(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) return existing.id;

    const id = crypto.randomUUID();
    setTags((prev) => [...prev, { id, name: trimmed, color }]);
    return id;
  };

  const assignTagToCard = (cardId: string, tagId: string) => {
    if (!cardId || !tagId) return;
    setCardTagsByCardId((prev) => {
      const current = prev[cardId] ?? [];
      if (current.includes(tagId)) return prev;
      return { ...prev, [cardId]: [...current, tagId] };
    });
  };

  const removeTagFromCard = (cardId: string, tagId: string) => {
    if (!cardId || !tagId) return;
    setCardTagsByCardId((prev) => {
      const current = prev[cardId] ?? [];
      if (!current.includes(tagId)) return prev;
      const next = current.filter((x) => x !== tagId);
      if (next.length === 0) {
        const { [cardId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [cardId]: next };
    });
  };

  return (
    <CollectionsContext.Provider
      value={{
        main,
        collections,
        addCard,
        removeCard,
        createCollection,
        tags,
        cardTagsByCardId,
        createTag,
        assignTagToCard,
        removeTagFromCard,
      }}
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
