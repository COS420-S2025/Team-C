import { useState, useEffect, useMemo } from "react";
import "./CardCollection.css";
import CardWindow from "../components/CardWindow/CardWindow";
import type { User } from "../interfaces/User";
import { CollectionWindow } from "../components/CollectionWindow/CollectionWindow";
import { useCollections, type Collection } from "./CollectionContext";
import type { CardVersion } from "../types/CardVersion";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "..";
import { onAuthStateChanged } from "firebase/auth";

type CollectionProps = {
  userData: User | undefined;
};

export default function CollectionPage({ userData }: CollectionProps) {
  // const { removeCard, collections, createCollection } = useCollections();
  const [cardsPerRow, setCardsPerRow] = useState(5);
  const [selectedCard, setSelectedCard] = useState<CardVersion | null>(null);
  const [creatingNewCollection, setCreatingNewCollection] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [collectionToDisplay, setCollectionToDisplay] = useState<string>("");
  const [userCollections, setUserCollections] = useState<Collection[]>([]);

  const handleCollectionChange = () => {
    const collectionDropdown = document.getElementById(
      "active-collection",
    ) as HTMLSelectElement;
    const opt = collectionDropdown.options[collectionDropdown.selectedIndex];
    const curVal = opt.value;

    if (curVal) setCollectionToDisplay(curVal);
  };

  // Claude Code assisted with useEffect functionality
  useEffect(() => {
    const getUserCollections = async () => {
      if (!userData) return null;

      let userCollections: Collection[] = [];

      try {
        const collections = await getDocs(
          collection(db, "users", userData.uid, "collections"),
        );
        if (collections.empty) return null;

        console.log(collections);

        collections.forEach((col) => {
          const data = col.data();

          const newCollection: Collection = {
            id: data.id,
            name: data.name,
            cards: data.cards,
            cover: data.cover,
          };
          userCollections.push(newCollection);
        });

        return userCollections;
      } catch (e) {
        if (!(e instanceof Error)) throw e;
        console.error(e.message);
        return null;
      }
    };

    return onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserCollections().then((collections) => {
          if (collections) setUserCollections(collections);
        });
      }
    });
  }, [userData]);

  const getCardsFromCollection = (
    collections: Collection[],
    collectionName: string,
  ) => {
    if (!collections) return [];

    const targetCol = collections.find(
      (collection) => collection.name === collectionName,
    );

    if (!targetCol) return [];

    console.log("returning targetCol.cards:", targetCol.cards);
    return targetCol.cards;
  };

  const groupedCards = useMemo(() => {
    // if (!collectionToDisplay) return [];

    // const collection = getCardsFromCollection(
    //   userCollections,
    //   collectionToDisplay,
    // );

    // if (collection.length === 0) return [];

    // console.log(collection);

    // return Object.values(
    //   collection.reduce<Record<string, CardVersion & { count: number }>>(
    //     (acc, card) => {
    //       if (!acc[card.id]) acc[card.id] = { ...card, count: 1 };
    //       else acc[card.id].count++;
    //       return acc;
    //     },
    //     {},
    //   ),
    // );
    return [];
  }, [collectionToDisplay, userCollections]);

  return (
    <div className="app-page">
      <h1>Collection</h1>

      {
        <select
          value={cardsPerRow}
          onChange={(e) => setCardsPerRow(Number(e.target.value))}
        >
          <option value={3}>3 per row</option>
          <option value={5}>5 per row</option>
          <option value={7}>7 per row</option>
          <option value={10}>10 per row</option>
        </select>
      }

      {/* {groupedCards.length === 0 ? (
        <p>No cards added yet!</p>
      ) : (
        <div className="card-grid">
          {groupedCards &&
            Object.values(groupedCards).map((card) => (
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
      )} */}

      {selectedCard && !creatingNewCollection && (
        <CardWindow
          cardName={selectedCard.name}
          onClose={() => setSelectedCard(null)}
          userData={userData}
        />
      )}
      {userData ? (
        <div>
          <div>Feature in Development!</div>
          <div>
            <select
              name="active-collection"
              id="active-collection"
              onChange={handleCollectionChange}
            >
              <option value="" key="">
                Select a Collection
              </option>
              {userCollections &&
                userCollections.map((collection: Collection) => {
                  return (
                    <option value={collection.name} key={collection.name}>
                      {collection.name}
                    </option>
                  );
                })}
            </select>
            {/* <button onClick={() => getUserCollections()}>TEST</button> */}
          </div>
          <button
            onClick={() => setCreatingNewCollection(!creatingNewCollection)}
          >
            Create New Collection
          </button>

          {creatingNewCollection && !selectedCard && (
            <CollectionWindow
              userData={userData}
              onClose={() => setCreatingNewCollection(false)}
              setMessage={setMessage}
            />
          )}
          {message && <div className="text-lime-400 mb-4">{message}</div>}
        </div>
      ) : (
        <div>
          <div>Sign in to access Collections!</div>
        </div>
      )}
    </div>
  );
}
