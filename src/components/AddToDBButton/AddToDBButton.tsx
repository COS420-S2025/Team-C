import React from "react";
import { db } from "../../firebase-config";
import { collection, addDoc } from "firebase/firestore";

export const AddToDBButton = () => {
  return (
    <button
      onClick={() => {
        addDoc(collection(db, "user"), {
          first: "Zach",
          last: "Narcotta",
        });
      }}
    >
      TEST: Add to DB
    </button>
  );
};
