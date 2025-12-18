import { useState } from 'react'
import Scoreboard from './components/Scoreboard'
import Ledger from './components/Ledger'
import SetupScreen from './components/SetupScreen' // Import the new screen
import topHitsData from './data/top_hits.json'

function App() {
  // --- APP STATE (Is game running?) ---
  const [gameStarted, setGameStarted] = useState(false);
  
  // --- GAME STATE ---
  const [players, setPlayers] = useState([]);
  
  // Turn Management
  const [turnIndex, setTurnIndex] = useState(0); // Index in the array (0, 1, 2)
  const [direction, setDirection] = useState(1); // 1 = Forward, -1 = Backward (Snake)

  const [inputValue, setInputValue] = useState("");
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
  const handleGuess = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Current Player Info
    const currentPlayer = players[turnIndex];
    if (currentPlayer.isOut) return; // Safety check

    const rawInput = inputValue.trim();
    const normalizedInput = rawInput.toLowerCase().replace('.', '').replace('-', ' ');

    // 2. Duplicate Check
    if (alreadyGuessedNames.has(normalizedInput)) {
      setFeedbackMessage(`⚠️ Already guessed: ${rawInput}`);
      setInputValue("");
      return;
    }

    // 3. Process Guess
    const foundPlayer = topHitsData.find(p => p.normalized === normalizedInput);
    let points = 0;
    let strikes = 0;
    let message = "";

    setAlreadyGuessedNames(prev => new Set(prev).add(normalizedInput));

    if (foundPlayer) {
      if (foundPlayer.rank <= 100) {
        // HIT
        points = foundPlayer.rank; // Points = Rank
        setCorrectGuesses(prev => [...prev, foundPlayer]);
        message = `✅ Correct! ${foundPlayer.name} is #${foundPlayer.rank}`;
      } else {
        // MISS (101-200)
        strikes = 1;
        setMissedGuesses(prev => [...prev, foundPlayer]);
        message = `❌ Ouch! ${foundPlayer.name} is #${foundPlayer.rank}`;
      }
    } else {
      // WHIFF
      strikes = 1;
      message = `🚫 "${rawInput}" is not on the list!`;
    }

    // 4. Update Score & Check Elimination
    const updatedPlayers = [...players];
    const p = updatedPlayers[turnIndex];
    p.score += points;
    p.strikes += strikes;
    if (p.strikes >= 3) p.isOut = true;
    
    setPlayers(updatedPlayers);
    setFeedbackMessage(message);
    setInputValue("");

    // 5. PASS THE TURN (The Snake Logic)
    advanceTurn(updatedPlayers, turnIndex, direction);
  };

  // --- THE SNAKE ALGORITHM ---
  const advanceTurn = (currentPlayers, currentIndex, currentDirection) => {
    
    // Check if Game Over (Only 0 or 1 player left standing)
    const activeCount = currentPlayers.filter(p => !p.isOut).length;
    if (activeCount === 0) { // Or 1, depending on rules. Let's play til death.
        setFeedbackMessage("GAME OVER! Everyone is out.");
        return;
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

        {/* INPUT FORM */}
        <form onSubmit={handleGuess}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Player ${players[turnIndex]?.name}, enter guess...`} 
            disabled={players.every(p => p.isOut)}
            style={{ padding: '15px', fontSize: '1.2rem', width: '100%', maxWidth: '400px', borderRadius: '8px', border: '1px solid #ccc' }} 
            autoFocus
          />
        </form>
      </div>

      {/* SCOREBOARD (Pass the ID of the current turn's player) */}
      <Scoreboard players={players} activePlayerId={players[turnIndex]?.id} />

      {/* LEDGER */}
      <Ledger correctGuesses={correctGuesses} missedGuesses={missedGuesses} />

    </div>
  )
}

export default App