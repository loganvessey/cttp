import { useState } from 'react'
import Scoreboard from './components/Scoreboard'
import Ledger from './components/Ledger' // Import the new component

function App() {
  // 1. GAME STATE
  const [players, setPlayers] = useState([
    { id: 1, name: "Logan", score: 145, strikes: 0, isOut: false },
    { id: 2, name: "Guest", score: 80, strikes: 1, isOut: false },
    { id: 3, name: "Dad", score: 10, strikes: 3, isOut: true }
  ]);
  const [activePlayerId, setActivePlayerId] = useState(1);

  // 2. DATA STATE (The "Board")
  // These mimic what we will eventually extract from our JSON files
  const [correctGuesses, setCorrectGuesses] = useState([
    { rank: 1, name: "Pete Rose", stat: 4256 },
    { rank: 2, name: "Ty Cobb", stat: 4189 },
    { rank: 25, name: "Rod Carew", stat: 3053 }
  ]);

  const [missedGuesses, setMissedGuesses] = useState([
    { rank: 105, name: "Bill Buckner", stat: 2715 },
    { rank: 114, name: "Keith Hernandez", stat: 2182 }
  ]);

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Top 100 Career Hits</h1>
        <input 
          type="text" 
          placeholder="Enter player name..." 
          style={{ padding: '15px', fontSize: '1.2rem', width: '100%', maxWidth: '400px', borderRadius: '8px', border: '1px solid #ccc' }} 
        />
      </div>

      {/* SCOREBOARD */}
      <Scoreboard players={players} activePlayerId={activePlayerId} />

      {/* LEDGER (New!) */}
      <Ledger correctGuesses={correctGuesses} missedGuesses={missedGuesses} />

    </div>
  )
}

export default App