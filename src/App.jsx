import { useState } from 'react'
import Scoreboard from './components/Scoreboard'

function App() {
  // 1. Temporary State to mimic a real game
  const [players, setPlayers] = useState([
    { id: 1, name: "Logan", score: 145, strikes: 0, isOut: false },
    { id: 2, name: "Guest", score: 80, strikes: 2, isOut: false },
    { id: 3, name: "Dad", score: 10, strikes: 3, isOut: true }
  ]);

  // 2. Who is currently guessing? (Let's say it's Player 1)
  const [activePlayerId, setActivePlayerId] = useState(1);

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* HEADER PLACEHOLDER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Top 100 Career Hits</h1>
        <input type="text" placeholder="Enter player name..." style={{ padding: '10px', fontSize: '1.2rem', width: '300px' }} />
      </div>

      {/* THE NEW SCOREBOARD */}
      <Scoreboard players={players} activePlayerId={activePlayerId} />

      {/* LEDGER PLACEHOLDER */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', height: '200px', padding: '10px' }}>
          <h3>Correct Guesses (Top 100)</h3>
        </div>
        <div style={{ flex: 1, border: '1px solid #ccc', height: '200px', padding: '10px' }}>
          <h3>Missed Guesses (Outside Top 100)</h3>
        </div>
      </div>

    </div>
  )
}

export default App
