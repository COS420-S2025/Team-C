import "@testing-library/jest-dom";
import { render, screen, fireEvent} from "@testing-library/react";
import React from "react";
import AccountPage from "./AccountPage";

describe("AccountPage", () =>
{
  const fakeSetUserData = jest.fn();

  const fakeUser =
  {
    uid: "0003",
    name: "Jonah",
    email: "jonah@test.com",
  };


  test("renders signed in when userData exists", () =>
  {
    render(<AccountPage userData={fakeUser} setUserData={fakeSetUserData} />);

    expect(screen.getByText("Signed in as: Jonah").toBeInTheDocument);
  });
});
