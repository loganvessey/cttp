import { useState } from 'react'
import Scoreboard from './components/Scoreboard'
import Ledger from './components/Ledger'
import topHitsData from './data/top_hits.json' // 1. Load the Real Data

function App() {
  // --- GAME STATE ---
  const [inputValue, setInputValue] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("Enter a player name to start");
  
  // Players (For now, we just edit Player 1's score to prove it works)
  const [players, setPlayers] = useState([
    { id: 1, name: "Test Player", score: 0, strikes: 0, isOut: false }
  ]);
  const activePlayerId = 1; // Hardcoded for Milestone 1

  // The Board State
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [missedGuesses, setMissedGuesses] = useState([]);
  const [alreadyGuessedNames, setAlreadyGuessedNames] = useState(new Set()); // To track duplicates

  // --- THE LOGIC ENGINE ---
  const handleGuess = (e) => {
    e.preventDefault(); // Stop the page from refreshing
    
    // 1. Clean the input
    const rawInput = inputValue.trim();
    if (!rawInput) return;
    const normalizedInput = rawInput.toLowerCase().replace('.', '').replace('-', ' ');

    // 2. Check for Duplicates
    if (alreadyGuessedNames.has(normalizedInput)) {
      setFeedbackMessage(`⚠️ Already guessed: ${rawInput}`);
      setInputValue("");
      return;
    }

    // 3. Find the player in our Database
    // We search the 'normalized' field in JSON to match our input
    const foundPlayer = topHitsData.find(p => p.normalized === normalizedInput);

    if (foundPlayer) {
      // --- SCENARIO A: Player Exists in DB ---
      
      // Mark as used so we can't guess him again
      setAlreadyGuessedNames(prev => new Set(prev).add(normalizedInput));

      if (foundPlayer.rank <= 100) {
        // HIT (Rank 1-100)
        handleCorrectGuess(foundPlayer);
      } else {
        // MISS (Rank 101-200)
        handleMissedGuess(foundPlayer);
      }
    } else {
      // --- SCENARIO B: Player NOT in DB ---
      handleInvalidGuess(rawInput);
    }

    // 4. Reset Input
    setInputValue("");
  };

  // --- HELPER FUNCTIONS ---

  const handleCorrectGuess = (player) => {
    setCorrectGuesses(prev => [...prev, player]); // Add to Green Ledger
    setFeedbackMessage(`✅ Correct! ${player.name} is #${player.rank}`);
    
    // Update Score (Rank = Points)
    updateActivePlayer(player.rank, 0); 
  };

  const handleMissedGuess = (player) => {
    setMissedGuesses(prev => [...prev, player]); // Add to Red Ledger
    setFeedbackMessage(`❌ Ouch! ${player.name} is #${player.rank} (Outside Top 100)`);
    
    // Update Strikes
    updateActivePlayer(0, 1);
  };

  const handleInvalidGuess = (name) => {
    setFeedbackMessage(`🚫 "${name}" is not on the list!`);
    
    // Update Strikes
    updateActivePlayer(0, 1);
  };

  const updateActivePlayer = (pointsToAdd, strikesToAdd) => {
    setPlayers(currentPlayers => {
      return currentPlayers.map(p => {
        if (p.id === activePlayerId) {
          const newStrikes = p.strikes + strikesToAdd;
          return {
            ...p,
            score: p.score + pointsToAdd,
            strikes: newStrikes,
            isOut: newStrikes >= 3 // Auto-calculate OUT status
          };
        }
        return p;
      });
    });
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Top 100 Career Hits</h1>
        
        {/* The Feedback Banner */}
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f3f4f6', 
          marginBottom: '10px',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {feedbackMessage}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleGuess}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter player name..." 
            disabled={players[0].isOut} // Disable input if player is out
            style={{ 
              padding: '15px', 
              fontSize: '1.2rem', 
              width: '100%', 
              maxWidth: '400px', 
              borderRadius: '8px', 
              border: '1px solid #ccc' 
            }} 
            autoFocus
          />
        </form>
      </div>

      {/* SCOREBOARD */}
      <Scoreboard players={players} activePlayerId={activePlayerId} />

      {/* LEDGER */}
      <Ledger correctGuesses={correctGuesses} missedGuesses={missedGuesses} />

    </div>
  )
}

export default App