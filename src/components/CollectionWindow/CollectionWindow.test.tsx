import { render, screen } from "@testing-library/react";
import { CollectionWindow } from "./CollectionWindow";
import type { User } from "../../interfaces/User";
import { CollectionsProvider } from "../../pages/CollectionContext";

describe("CollectionWindow Tests", () => {
  test("Component renders without crashing app", () => {
    const fakeUser: User = {
      uid: "0",
      name: "Joe Schmoe",
      email: "joe.schmoe@gmail.com",
    };
    render(
      <CollectionsProvider>
        <CollectionWindow
          userData={fakeUser}
          onClose={jest.fn()}
          setMessage={jest.fn()}
        />
        ,
      </CollectionsProvider>,
    );

    const collectionWindow = screen.getByText("Add Collection");
    expect(collectionWindow).toBeInTheDocument();
  });
});
