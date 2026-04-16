import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import AccountPage from "./AccountPage";
import { doc, updateDoc } from "firebase/firestore";

jest.mock("firebase/firestore", () =>
{
  const actual_fire = jest.requireActual("firebase/firestore");
  
  return {
    ...actual_fire,
    doc: jest.fn(),
    updateDoc: jest.fn(),
  };
});

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

  test("renders name change and updates firebase", async () =>
  {
    (updateDoc as jest.Mock).mockResolvedValueOnce({});
    (doc as jest.Mock).mockReturnValue("mocked-doc-ref");
  
    render(<AccountPage userData={fakeUser} setUserData={fakeSetUserData} />);
  
    const inputName = screen.getByPlaceholderText("New Name");
    const button = screen.getByText("Change Name");
  
    fireEvent.change(inputName, { target: { value: "Dean" } });
    fireEvent.click(button);
  
    await waitFor(() => {
      expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "0003");
      expect(updateDoc).toHaveBeenCalledWith("mocked-doc-ref", {
        name: "Dean",
      });
    });
  
    expect(await screen.findByText("Name changed to: Dean!"))
      .toBeInTheDocument();
  });

  test("renders email change and updates firebase", async () =>
  {
    (updateDoc as jest.Mock).mockResolvedValueOnce({});
    (doc as jest.Mock).mockReturnValue("mocked-doc-ref");
  
    render(<AccountPage userData={fakeUser} setUserData={fakeSetUserData} />);
  
    const inputEmail = screen.getByPlaceholderText("New Email");
    const button = screen.getByText("Change Email");
  
    fireEvent.change(inputEmail, { target: { value: "dean@test.com" } });
    fireEvent.click(button);
  
    await waitFor(() => {
      expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "0003");
      expect(updateDoc).toHaveBeenCalledWith("mocked-doc-ref", {
        email: "dean@test.com",
      });
    });
  
    expect(await screen.findByText("Email changed to: dean@test.com!"))
      .toBeInTheDocument();
  });

});
