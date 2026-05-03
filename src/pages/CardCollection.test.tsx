import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CollectionPage from "./CardCollection";
import type { User } from "../interfaces/User";

//Test to check if Pop up appears when Create New Collection button is clicked
jest.mock("../components/CollectionWindow/CollectionWindow", () => ({
  CollectionWindow: ({ onClose }: { onClose: () => void }) => (
    <div>
      <p>Mock Create Collection Popup</p>
      <button onClick={onClose}>Close Popup</button>
    </div>
  ),
}));

jest.mock("..", () => ({ auth: {}, db: {} }));
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: () => () => {},
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ empty: true, forEach: jest.fn() }),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe("CardCollection create collection popup", () => {
  test('clicking "Create New Collection" shows popup', () => {
    const fakeUser: User = {
      uid: "1234",
      name: "Testy McUser",
      email: "test@example.com",
    };
    render(<CollectionPage userData={fakeUser} />);

    expect(screen.queryByText("Mock Create Collection Popup")).toBeNull();

    fireEvent.click(screen.getByText("Create New Collection"));

    expect(
      screen.getByText("Mock Create Collection Popup"),
    ).toBeInTheDocument();
  });
});
