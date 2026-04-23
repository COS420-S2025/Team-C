import { render, screen } from "@testing-library/react";
import { CollectionWindow } from "./CollectionWindow";
import type { User } from "../../interfaces/User";

describe("CollectionWindow Tests", () => {
  test("Component renders without crashing app", () => {
    const fakeUser: User = {
      uid: "0",
      name: "Joe Schmoe",
      email: "joe.schmoe@gmail.com",
    };
    render(
      <CollectionWindow
        userData={fakeUser}
        onClose={jest.fn()}
        setMessage={jest.fn()}
      />,
    );

    const collectionWindow = screen.getByText("Add Collection");
    expect(collectionWindow).toBeInTheDocument();
  });
});
