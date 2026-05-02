import { render, screen } from "@testing-library/react";
import Login from "./Login";

describe("Login Tests", () => {
  test("Login component renders without crashing app", () => {
    render(
      <Login
        AccountProps={{ userData: undefined, setUserData: jest.fn() }}
        setShowSignup={jest.fn()}
      />,
    );
    const login = screen.getByText("Login");
    expect(login).toBeInTheDocument();
  });
});
