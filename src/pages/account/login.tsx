import Login from "../../components/Login/Login";

interface LoginProps {
  setToken: (token: string) => void;
  token: string;
}

export default function LoginPage({ setToken }: LoginProps) {
  return (
    <div className="app-account">
      <h1>Hello, World!</h1>
      <h2>Log in page</h2>
      <Login />
    </div>
  );
}
