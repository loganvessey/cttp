import { useState } from 'react'
import Scoreboard from './components/Scoreboard'
import Ledger from './components/Ledger'
import SetupScreen from './components/SetupScreen'
import PlayerInput from './components/PlayerInput'
import topHitsData from './data/top_hits.json'

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

    // 1. Find the player in our "Answer Key" (Top 200)
    const dbHit = topHitsData.find(p => p.name === guessInput);
    
    // Check for repeats (in either list)
    const isRepeat = correctGuesses.some(g => g.name === guessInput) || 
                     missedGuesses.some(g => g.name === guessInput);

    if (isRepeat) {
      setFeedbackMessage(`REPEAT: ${guessInput} already taken!`);
      return;
    }

    // 2. Prepare state updates
    const updatedPlayers = [...players];
    const activePlayer = { ...updatedPlayers[turnIndex] };

    // 3. Logic: Hit vs. Miss (Implementing Ticket #6 & #7)
    if (dbHit && dbHit.rank <= 100) {
      // --- HIT (Rank 1-100) ---
      const points = dbHit.rank;
      activePlayer.score += points;
      
      setCorrectGuesses([...correctGuesses, dbHit]);
      setFeedbackMessage(`HIT! ${dbHit.name} #${dbHit.rank}`);
      
    } else {
      // --- STRIKE (Rank 101+ OR Not in DB) ---
      activePlayer.strikes += 1;
      
      if (dbHit) {
        // Strategic Miss (Rank 101-200): Use real data
        setMissedGuesses([...missedGuesses, dbHit]);
        setFeedbackMessage(`MISS! ${dbHit.name} is #${dbHit.rank} (Outside Top 100)`);
      } else {
        // Pure Miss (Not in DB): Create dummy object
        const missObj = { name: guessInput, rank: '-', stat: 0 };
        setMissedGuesses([...missedGuesses, missObj]);
        setFeedbackMessage(`MISS! ${guessInput} not in Top 200.`);
      }
    }

    // 4. Check for Out
    if (activePlayer.strikes >= 3) {
      activePlayer.isOut = true;
      setFeedbackMessage(`STRIKE 3! ${activePlayer.name} is OUT!`);
    }

    // 5. Update Player State
    updatedPlayers[turnIndex] = activePlayer;
    setPlayers(updatedPlayers);

    // 6. Switch Turn (Skip Eliminated Players)
    const allOut = updatedPlayers.every(p => p.isOut);
    
    if (!allOut) {
        let nextIndex = (turnIndex + 1) % updatedPlayers.length;
        let loopCount = 0;
        // Loop until we find a player who is NOT out
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