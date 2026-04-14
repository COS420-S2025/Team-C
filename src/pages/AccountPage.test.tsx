import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  test("renders name change", async () =>
  {
    render(<AccountPage userData={fakeUser} setUserData={fakeSetUserData} />);

    const inputName = screen.getByPlaceholderText("New Name");
    const button = screen.getByText("Change Name");

    fireEvent.change(inputName, "Dean");
    fireEvent.click(button);

    expect(await screen.findByText("Name changed to: Dean!").toBeInTheDocument);
    expect(await screen.findByText("Signed in as: Dean").toBeInTheDocument);
  });

  test("renders email change", async () =>
  {
    render(<AccountPage userData={fakeUser} setUserData={fakeSetUserData} />);

    const inputEmail = screen.getByPlaceholderText("New Email");
    const button = screen.getByText("Change Email");

    fireEvent.change(inputEmail, "dean@test.com");
    fireEvent.click(button);

    expect(await screen.findByText("Email changed to: dean@test.com!").
      toBeInTheDocument);
  });
});
