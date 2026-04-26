import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CardCollection from "./CardCollection";
import { CollectionsProvider } from "./CollectionContext";
import type { CardVersion } from "../types/CardVersion";

const sampleCard: CardVersion = {
  id: "xy7-54",
  name: "Gardevoir",
  imageUrl: "https://example.com/gardevoir.png",
  set: "Steam Siege",
  rarity: "Rare",
  releaseDate: "2016-02-12",
  isFoil: false,
};

function renderCollection(initialMain: CardVersion[] = []) {
  return render(
    <CollectionsProvider initialMain={initialMain}>
      <CardCollection userData={null} />
    </CollectionsProvider>,
  );
}

describe("CardCollection", () => {
  test("displays a card when cards are in the main collection", () => {
    renderCollection([sampleCard]);

    expect(screen.getByText("Gardevoir")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gardevoir" })).toBeInTheDocument();
  });

  test("shows empty state when there are no cards", () => {
    renderCollection();

    expect(screen.getByText("No cards added yet!")).toBeInTheDocument();
  });

  test("removes card from the page when the remove button is clicked", () => {
    renderCollection([sampleCard]);

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(screen.queryByText("Gardevoir")).not.toBeInTheDocument();
  });
});
