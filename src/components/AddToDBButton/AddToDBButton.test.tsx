import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddToDBButton } from "./AddToDBButton";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";

async function deleteCollection(collectionName: string) {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(query(collectionRef));
    if (querySnapshot.empty) {
      console.log(`Collection '${collectionName}' is empty`);
      return;
    }

    const deletePromises = querySnapshot.docs.map((document) => {
      return deleteDoc(doc(db, collectionName, document.id));
    });
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting collection!\n", error);
  }
}

describe("AddToDBButton Tests", () => {
  test("AddToDBButton renders without crashing app", () => {
    render(<AddToDBButton />);
    const button = screen.getByText(/Add to DB/i);
    expect(button).toBeInTheDocument();
  });

  test("AddToDBButton adds a new document to database", async () => {
    await deleteCollection("user");
    render(<AddToDBButton />);

    const button = screen.getByText(/Add to DB/i);
    fireEvent.click(button);

    const q = query(
      collection(db, "user"),
      where("first", "==", "Zach"),
      where("last", "==", "Narcotta"),
    );
    const querySnapshot = await getDocs(q);
    expect(querySnapshot.size).toBe(1);
  });
});
