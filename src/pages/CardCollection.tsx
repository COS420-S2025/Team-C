import "./CardCollection.css";

export default function Collection({ cards = [], removeCard }: any) {
  return (
    <div className="app-page">
      <h1>Collection Page!</h1>

      {cards.length === 0 ? (
        <p>No cards added yet!</p>
      ) : (
        <div>
          {cards.map((card: any, index: number) => (
            <div key={index}>
              <h3>{card.name}</h3>
              <img src={card.image} alt={card.name} />
              <button onClick={() => removeCard(card)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}