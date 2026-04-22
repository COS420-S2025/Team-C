import React, { useState } from "react";
import type { User } from "../../interfaces/User";
import { db } from "../..";
import { doc, getDoc, setDoc } from "firebase/firestore";

type CollectionWindowProps = {
  userData: User | null;
  onClose: () => void;
  setMessage: (message: string) => void;
};

export const CollectionWindow: React.FC<CollectionWindowProps> = ({
  userData,
  onClose,
  setMessage,
}) => {
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const createNewCollection = async () => {
    if (!newCollectionName) {
      setError("A collection must have a name!");
      return;
    }

    if (userData) {
      const collectionDoc = await getDoc(
        doc(db, "users", userData.uid, "collections", newCollectionName),
      );

      if (collectionDoc.exists()) {
        setError("This collection already exists!");
      } else {
        await setDoc(
          doc(db, "users", userData.uid, "collections", newCollectionName),
          {},
        );
        setMessage(`Collection '${newCollectionName}' created!`);
        setError("");
        setNewCollectionName("");
        onClose();
      }
    }
  };

  // Used Claude for CSS styling with Tailwind
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-[200]"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-5 rounded-lg w-[90%] max-w-[800px] min-h-[200px] flex flex-col text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2.5 right-2.5 border-0 bg-transparent text-lg cursor-pointer"
          onClick={onClose}
        >
          X
        </button>

        {/* Inputs */}
        <div>
          <input
            type="text"
            placeholder="New Collection Name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          ></input>
        </div>
        <button onClick={createNewCollection}>Add Collection</button>
        {error && <div className="text-red-400 mb-4">{error}</div>}
      </div>
    </div>
  );
};
