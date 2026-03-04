import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app-page">
      <div className="app-navbar">
        <nav>
          <ul className="app-navbar-list">
            <li className="app-navbar-item">
              <a href="#home">Home</a>
            </li>
            <li className="app-navbar-item">
              <a href="#search">Search</a>
            </li>
            <li className="app-navbar-item">
              <a href="#cards">My Cards</a>
            </li>
            <li className="app-navbar-item">
              <a href="#collections">Collections</a>
            </li>
          </ul>
          <ul>
            <div>
              <ul className="app-navbar-account">
                <li className="app-navbar-item">
                  <a href="#sign-up">Sign Up</a>
                </li>
                <li className="app-navbar-item">
                  <a href="#log-in">Log In</a>
                </li>
              </ul>
            </div>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default App;
