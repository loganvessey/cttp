import { useState } from 'react'
import Scoreboard from './components/Scoreboard'
import Ledger from './components/Ledger'
import SetupScreen from './components/SetupScreen'
import PlayerInput from './components/PlayerInput' // <--- Add this line
import topHitsData from './data/top_hits.json'

function App() {
  // --- APP STATE (Is game running?) ---
  const [gameStarted, setGameStarted] = useState(false);
  
  // --- GAME STATE ---
  const [players, setPlayers] = useState([]);
  
  // Turn Management
  const [turnIndex, setTurnIndex] = useState(0); // Index in the array (0, 1, 2)
  const [direction, setDirection] = useState(1); // 1 = Forward, -1 = Backward (Snake)

  const [feedbackMessage, setFeedbackMessage] = useState("Enter a player name to start");
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [missedGuesses, setMissedGuesses] = useState([]);
  const [alreadyGuessedNames, setAlreadyGuessedNames] = useState(new Set());

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

    // 1. Validation Logic (Strict Match)
    const hit = topHitsData.find(p => p.name === guessInput);
    const isRepeat = correctGuesses.some(g => g.name === guessInput);

    if (isRepeat) {
      setFeedbackMessage(`REPEAT: ${guessInput} already taken!`);
      return;
    }

    // 2. Create copy of players to update state
    const updatedPlayers = [...players];
    const activePlayer = { ...updatedPlayers[turnIndex] };

    if (hit) {
      // --- HIT LOGIC ---
      const points = 100 - hit.rank + 1;
      activePlayer.score += points;
      
      setCorrectGuesses([...correctGuesses, hit]);
      setFeedbackMessage(`HIT! ${hit.name} #${hit.rank}`);
    } else {
      // --- MISS LOGIC (Restored) ---
      activePlayer.strikes += 1;
      setMissedGuesses([...missedGuesses, guessInput]);

      if (activePlayer.strikes >= 3) {
        activePlayer.isOut = true;
        setFeedbackMessage(`STRIKE 3! ${activePlayer.name} is OUT!`);
      } else {
        setFeedbackMessage(`MISS! Not on list. Strike ${activePlayer.strikes}.`);
      }
    }

    // 3. Save Player State
    updatedPlayers[turnIndex] = activePlayer;
    setPlayers(updatedPlayers);

    // 4. Switch Turn (Skip Eliminated Players)
    const allOut = updatedPlayers.every(p => p.isOut);
    
    if (!allOut) {
        let nextIndex = (turnIndex + 1) % updatedPlayers.length;
        // Loop until we find a player who is NOT out
        // (Safety check: break if we loop back to start to prevent infinite loop)
        let loopCount = 0;
        while (updatedPlayers[nextIndex].isOut && loopCount < updatedPlayers.length) {
            nextIndex = (nextIndex + 1) % updatedPlayers.length;
            loopCount++;
        }
        setTurnIndex(nextIndex);
    } else {
        setFeedbackMessage("GAME OVER! All players are out.");
    }

    let nextIndex = currentIndex + currentDirection;
    let nextDirection = currentDirection;

    // Did we hit the walls?
    if (nextIndex >= currentPlayers.length) {
      // Hit the end -> Bounce back
      nextIndex = currentPlayers.length - 1; 
      nextDirection = -1; 
      // If we are at the end, the same player goes again (Double Turn), 
      // UNLESS they are out. Logic handles this in the recursion below.
    } else if (nextIndex < 0) {
      // Hit the start -> Bounce forward
      nextIndex = 0;
      nextDirection = 1;
    }

    // RECURSION: If the next player is OUT, keep moving in that direction
    if (currentPlayers[nextIndex].isOut) {
      // Be careful of infinite loops if everyone is out!
      // But we checked activeCount above, so we are safe.
      advanceTurn(currentPlayers, nextIndex, nextDirection); // Recursively find next
    } else {
      // We found a valid player! Commit state.
      setTurnIndex(nextIndex);
      setDirection(nextDirection);
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

      {/* SCOREBOARD (Pass the ID of the current turn's player) */}
      <Scoreboard players={players} activePlayerId={players[turnIndex]?.id} />

      {/* LEDGER */}
      <Ledger correctGuesses={correctGuesses} missedGuesses={missedGuesses} />

    </div>
  )
}

export default App