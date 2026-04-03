import React from "react";
import Navbar from "./components/Navbar/Navbar";

function App() {
  // Stores all cards in the collection
  const [cards, setCards] = useState<any[]>([]);

  // Adds a card
  const addCard = (card: any) => {
    setCards([...cards, card]);
  };

  // Removes a card
  const removeCard = (cardToRemove: any) => {
    setCards(cards.filter((card) => card.id !== cardToRemove.id));
  };

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/home" element={<Home />} />

      <Route path="/collection" element={
          <Collection
            cards={cards}
            addCard={addCard}
            removeCard={removeCard}
          />
        }
      />
      <Route path="/search" element={
          <Search
            cards={cards}
            addCard={addCard}
            removeCard={removeCard}
          />
        }
      />
      <Route path="/all" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
