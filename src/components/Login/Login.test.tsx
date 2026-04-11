import { render, screen } from "@testing-library/react";
import Login from "./Login";
import type { User } from "../../interfaces/User";

describe("Login Tests", () => {
  test("Login component renders without crashing app", () => {
    const fakeUser : User | null = null;
    const setFakeUser = jest.fn();

    render(<Login userData={fakeUser} setUserData={setFakeUser} />);
    const login = screen.getByText("Login");
    expect(login).toBeInTheDocument();
  });
});
