import { render, screen } from "@testing-library/react";
import Signup from "./Signup";
import type { User } from "../../interfaces/User";
import { useState } from "react";

describe("Signup Tests", () => {
  test("Signup component renders without crashing app", () => {
    const [fakeUser, setFakeUser] = useState<User | null>(null);

    render(<Signup userData={fakeUser} setUserData={setFakeUser} />);
    const login = screen.getByText("Login");
    expect(login).toBeInTheDocument();
  });
});
