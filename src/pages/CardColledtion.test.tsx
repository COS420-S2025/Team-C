import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CardCollection from "./CardCollection";

/*Test to check if a card is displayed when card details are provided properly */
describe("CardCollection", () => {
  test("displays a card when cards are provided", () => {
    const cards = [
      {
        id: "xy7-54",
        name: "Gardevoir",
        imageUrl: "https://example.com/gardevoir.png",
        set: "Steam Siege",
        rarity: "Rare",
      },
    ];

    render(
      <CardCollection
        addCard={jest.fn()}
        cards={cards}
        removeCard={jest.fn()}
      />,
    );

    expect(screen.getByText("Gardevoir")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gardevoir" })).toBeInTheDocument();
  });

  /*Test to check if no cards are displayed when there are no cards in the collection*/
  test("shows empty state when no cards are provided", () => {
    render(
      <CardCollection addCard={jest.fn()} cards={[]} removeCard={jest.fn()} />,
    );

    expect(screen.getByText("No cards added yet!")).toBeInTheDocument();
  });

  /*Test to check if a card is removed from the page when the remove button is clicked*/
  test("calls removeCard when remove button is clicked", () => {
    const card = {
      id: "xy7-54",
      name: "Gardevoir",
      imageUrl: "https://example.com/gardevoir.png",
      set: "Steam Siege",
      rarity: "Rare",
    };
    const removeCard = jest.fn();

    render(
      <CardCollection
        addCard={jest.fn()}
        cards={[card]}
        removeCard={removeCard}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(removeCard).toHaveBeenCalledTimes(1);
    expect(removeCard).toHaveBeenCalledWith(expect.objectContaining(card));
  });
});
