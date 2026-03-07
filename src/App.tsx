import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Account from "./pages/account/account";
import Signup from "./pages/account/signup";
import Login from "./pages/account/login";
import Navbar from "./components/navbar/navbar";

function App(): React.JSX.Element {
  return (
    <div className="app">
      <BrowserRouter>
        {/* Navigation */}
        <Navbar />

        {/* Site Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/sign-up" element={<Signup />} />
          <Route path="/account/log-in" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
