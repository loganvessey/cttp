import { useState } from 'react'
import Scoreboard from './components/Scoreboard'
import Ledger from './components/Ledger'
import SetupScreen from './components/SetupScreen'
import PlayerInput from './components/PlayerInput'
import topHitsData from './data/ranked_stats.json' // Was top_hits.json

function App() {
  // --- APP STATE (Is game running?) ---
  const [gameStarted, setGameStarted] = useState(false);
  
  // --- GAME STATE ---
  const [players, setPlayers] = useState([]);
  
  // Turn Management
  const [turnIndex, setTurnIndex] = useState(0); 
  // Note: 'direction' is removed for MVP (Simple Rotation)
  
  const [feedbackMessage, setFeedbackMessage] = useState("Enter a player name to start");
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [missedGuesses, setMissedGuesses] = useState([]);

  // --- START GAME HANDLER ---
  const handleStartGame = (initialPlayers) => {
    setPlayers(initialPlayers);
    setGameStarted(true);
    setFeedbackMessage(`Player 1 (${initialPlayers[0].name}), you're up!`);
  };

  // --- THE LOGIC ENGINE ---
const handleGuess = (guessInput) => {
    if (!guessInput) return;

    const currentPlayer = players[turnIndex];
    if (currentPlayer.isOut) return;

    // 1. LOOKUP: Check the FULL database
    // "topHitsData" is now the massive "ranked_stats.json" list
    const dbHit = topHitsData.find(p => p.name === guessInput);
    
    // Check repeats
    const isRepeat = correctGuesses.some(g => g.name === guessInput) || 
                     missedGuesses.some(g => g.name === guessInput);

    if (isRepeat) {
      setFeedbackMessage(`REPEAT: ${guessInput} already taken!`);
      return;
    }

    // 2. Prepare State
    const updatedPlayers = [...players];
    const activePlayer = { ...updatedPlayers[turnIndex] };

    // 3. Scoring Logic
    if (dbHit) {
        // Player exists in our records!
        
        if (dbHit.rank <= 100) {
            // --- HIT (Rank 1-100) ---
            const points = 100 - dbHit.rank + 1;
            activePlayer.score += points;
            setCorrectGuesses([...correctGuesses, dbHit]);
            setFeedbackMessage(`HIT! ${dbHit.name} #${dbHit.rank}`);
        } else {
            // --- STRATEGIC MISS (Rank > 100) ---
            activePlayer.strikes += 1;
            // Now we ALWAYS have the rich data object
            setMissedGuesses([...missedGuesses, dbHit]);
            setFeedbackMessage(`MISS! ${dbHit.name} is #${dbHit.rank} with ${dbHit.stat} hits.`);
        }
    } else {
        // --- EDGE CASE: INVALID PLAYER ---
        // Player somehow not in stats DB (e.g. Pitcher with 0 hits?)
        activePlayer.strikes += 1;
        const missObj = { name: guessInput, rank: '-', stat: 0 };
        setMissedGuesses([...missedGuesses, missObj]);
        setFeedbackMessage(`MISS! ${guessInput} has no record.`);
    }

    // 4. Check Out
    if (activePlayer.strikes >= 3) {
      activePlayer.isOut = true;
      setFeedbackMessage(`STRIKE 3! ${activePlayer.name} is OUT!`);
    }

    // 5. Save & Switch
    updatedPlayers[turnIndex] = activePlayer;
    setPlayers(updatedPlayers);

    const allOut = updatedPlayers.every(p => p.isOut);
    if (!allOut) {
        let nextIndex = (turnIndex + 1) % updatedPlayers.length;
        let loopCount = 0;
        while (updatedPlayers[nextIndex].isOut && loopCount < updatedPlayers.length) {
            nextIndex = (nextIndex + 1) % updatedPlayers.length;
            loopCount++;
        }
        setTurnIndex(nextIndex);
    } else {
        setFeedbackMessage("GAME OVER! All players are out.");
    }
  };

  if (!gameStarted) {
    return <SetupScreen onStartGame={handleStartGame} />;
  }

  return (
    <div style={{ fontFamily: 'Arial', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Top 100 Career Hits</h1>
        
        {/* Feedback Banner */}
        <div style={{ padding: '10px', backgroundColor: '#f3f4f6', marginBottom: '10px', borderRadius: '4px', fontWeight: 'bold'}}>
          {feedbackMessage}
        </div>

        {/* INPUT AREA */}
        <div style={{ marginBottom: '30px', position: 'relative', zIndex: 50 }}>
            <PlayerInput 
              onGuess={handleGuess}
              currentPlayerName={players[turnIndex]?.name}
              isDisabled={players.every(p => p.isOut)}
            />
        </div>
      </div>

      {/* SCOREBOARD */}
      <Scoreboard players={players} activePlayerId={players[turnIndex]?.id} />

      {/* LEDGER */}
      <Ledger correctGuesses={correctGuesses} missedGuesses={missedGuesses} />

    </div>
  )
}

export default App