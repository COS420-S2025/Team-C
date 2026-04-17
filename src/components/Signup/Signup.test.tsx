import { render, screen } from "@testing-library/react";
import Signup from "./Signup";

describe("Signup Tests", () => {
  test("Signup component renders without crashing app", () => {
    render(
      <Signup
        AccountProps={{ userData: null, setUserData: jest.fn() }}
        setShowSignup={jest.fn()}
      />,
    );
    const signup = screen.getByText("Sign Up");
    expect(signup).toBeInTheDocument();
  });
});
