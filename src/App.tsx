import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Account from "./pages/account";
import Navbar from "./components/navbar/navbar";

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <Navbar />

      {/* Site Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
