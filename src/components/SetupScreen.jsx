import React, { useState } from 'react';

function SetupScreen({ onStartGame }) {
  const [name, setName] = useState("");
  const [lobbyPlayers, setLobbyPlayers] = useState([]);

  const addPlayer = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Add new player to the list
    const newPlayer = {
      id: lobbyPlayers.length + 1, // Simple ID 1, 2, 3...
      name: name.trim(),
      score: 0,
      strikes: 0,
      isOut: false
    };
    
    setLobbyPlayers([...lobbyPlayers, newPlayer]);
    setName(""); // Clear input
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>⚾ New Game Setup</h1>
      
      {/* Player Entry Form */}
      <form onSubmit={addPlayer} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Enter player name..." 
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', fontSize: '1.2rem', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>
          Add
        </button>
      </form>

      {/* The List of People Joining */}
      <div style={{ marginBottom: '30px', textAlign: 'left', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
        <h3>Lineup:</h3>
        {lobbyPlayers.length === 0 ? <p style={{color: '#999'}}>No players yet...</p> : (
          <ul>
            {lobbyPlayers.map(p => (
              <li key={p.id} style={{ fontSize: '1.2rem', marginBottom: '5px' }}>
                Player {p.id}: <strong>{p.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Start Button */}
      {lobbyPlayers.length > 0 && (
        <button 
          onClick={() => onStartGame(lobbyPlayers)}
          style={{ 
            backgroundColor: '#2563eb', color: 'white', padding: '15px 30px', 
            fontSize: '1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer' 
          }}
        >
          Play Ball! ⚾
        </button>
      )}
    </div>
  );
}

export default SetupScreen;