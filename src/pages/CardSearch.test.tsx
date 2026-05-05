import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CardSearch from "./CardSearch";

jest.mock("../components/CardWindow/CardWindow", () => ({
  default: ({cardName}: {cardName: string}) =>
  (
    <div>CardWindow: {cardName}</div>
  ),
}));

global.fetch = jest.fn();


describe("CardSearch", () =>
{
  test("renders search input", () =>
  {
    render(<CardSearch userData={undefined} />);

    expect(screen.getByPlaceholderText("Search Pokémon...")).toBeInTheDocument();
  });

  test("fetches and displays results", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        { id: "1", name: "Pikachu", image: "img-url" },
      ],
    })
    .mockResolvedValue({
      json: async () => ({types: ["Electric"]}),
    });

    render(<CardSearch userData={undefined} />);

    fireEvent.change(screen.getByPlaceholderText("Search Pokémon..."), {
      target: { value: "pikachu" },
    });

    expect(await screen.findByText("Pikachu")).toBeInTheDocument();
  });

});
