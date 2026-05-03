import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CollectionPage from "./CardCollection";
import type { User } from "../interfaces/User";

jest.mock("../components/CollectionWindow/CollectionWindow", () => ({
  CollectionWindow: ({ onClose }: { onClose: () => void }) => (
    <div>
      <p>Mock Create Collection Popup</p>
      <button onClick={onClose}>x</button>
    </div>
  ),
}));

const fakeUser: User = {
  uid: "1234",
  name: "Testy McUser",
  email: "test@example.com",
};

//Test to check if Pop up appears when Create New Collection button is clicked
test('clicking "Create New Collection" shows popup', () => {
  render(<CollectionPage userData={fakeUser} />);

  expect(screen.queryByText("Mock Create Collection Popup")).toBeNull();

  fireEvent.click(screen.getByText("Create New Collection"));

  expect(screen.getByText("Mock Create Collection Popup")).toBeInTheDocument();
});

//Test to check if Popup can be closed by clicking a mock "x" button, open and closes Popup
test('clicking "x" hides closes Popup', () => {
  render(<CollectionPage userData={fakeUser} />);

  fireEvent.click(screen.getByText("Create New Collection"));
  expect(screen.getByText("Mock Create Collection Popup")).toBeInTheDocument();

  fireEvent.click(screen.getByText("x"));
  expect(screen.queryByText("Mock Create Collection Popup")).toBeNull();
});

test("shows sign-in message and hides collection controls when userData is undefined", () => {
  render(<CollectionPage userData={undefined} />);
  expect(
    screen.getByText("Sign in to access Collections!"),
  ).toBeInTheDocument();
  expect(screen.queryByText("Create New Collection")).toBeNull();
  expect(screen.queryByText("Feature in Development!")).toBeNull();
});
