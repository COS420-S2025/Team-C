import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { CollectionsProvider } from "./CollectionContext";
import type { CardVersion } from "../types/CardVersion";
import MyCards from "./MyCards";

const sampleCard: CardVersion = {
  id: "xy7-54",
  name: "Gardevoir",
  imageUrl: "https://example.com/gardevoir.png",
  set: "Steam Siege",
  rarity: "Rare",
  releaseDate: "2016-02-12",
  isFoil: false,
  numberInSet: "54",
};

function renderCollection(initialMain: CardVersion[] = []) {
  return render(
    <CollectionsProvider initialMain={initialMain}>
      <MyCards userData={undefined} />
    </CollectionsProvider>,
  );
}

describe("MyCards", () => {
  test("displays a card when cards are in the main collection", () => {
    renderCollection([sampleCard]);

    expect(screen.getByAltText("Gardevoir")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gardevoir" })).toBeInTheDocument();
  });

  test("shows empty state when there are no cards", () => {
    renderCollection();

    expect(screen.getByText("No cards added yet!")).toBeInTheDocument();
  });

  test("removes card from the page when the remove button is clicked", () => {
    renderCollection([sampleCard]);

    fireEvent.click(screen.getByTitle("Remove one"));

    expect(screen.queryByText("Gardevoir")).not.toBeInTheDocument();
  });
});
