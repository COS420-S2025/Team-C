import { render, screen } from "@testing-library/react";
import Login from "./Login";
import type { User } from "../../interfaces/User";
import { useState } from "react";

describe("Login Tests", () => {
  test("Login component renders without crashing app", () => {
    const [fakeUser, setFakeUser] = useState<User | null>(null);

    render(<Login userData={fakeUser} setUserData={setFakeUser} />);
    const login = screen.getByText("Login");
    expect(login).toBeInTheDocument();
  });
});
