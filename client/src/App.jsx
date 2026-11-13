import { useState, useEffect } from 'react';

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/games')
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  return (
    <div>
      <h1>My Games</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            {game.title} ({game.platform}) - {game.status}, {game.hours_played} hours played
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;