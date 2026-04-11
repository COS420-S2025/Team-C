import { render, screen } from "@testing-library/react";
import Signup from "./Signup";
import type { User } from "../../interfaces/User";

describe("Signup Tests", () => {
  test("Signup component renders without crashing app", () => {
    const fakeUser : User | null = null;
    const setFakeUser = jest.fn();

    render(<Signup userData={fakeUser} setUserData={setFakeUser} />);
    const login = screen.getByText("Login");
    expect(login).toBeInTheDocument();
  });
});
