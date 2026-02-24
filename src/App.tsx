import React from 'react';
import './App.css';

function App() {

  const handleClick = () => {
    alert("Button was clicked!");
  };

  return (
    <div className="App">
        <h1>Testing!</h1>
        <h3>Alex Wuz Here...</h3>

        <button onClick={handleClick}>
          Click Me
        </button>

    </div>
  );
}

export default App;