import React from 'react';

// This component expects:
// - players: Array of player objects [{id, name, score, strikes, isOut}]
// - activePlayerId: The ID of the person whose turn it is
const Scoreboard = ({ players, activePlayerId }) => {
  
  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
      {players.map((player) => {
        
        const isActive = player.id === activePlayerId;
        
        // Dynamic Styles
        const cardStyle = {
          border: isActive ? '3px solid #f59e0b' : '1px solid #ccc', // Gold border if active
          backgroundColor: isActive ? '#fffbeb' : '#f3f4f6',          // Light yellow bg if active
          borderRadius: '8px',
          padding: '15px',
          width: '150px',
          textAlign: 'center',
          opacity: player.isOut ? 0.5 : 1, // Fade out if eliminated
          boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
        };

        return (
          <div key={player.id} style={cardStyle}>
            {/* Player Name */}
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
              {player.name}
            </h3>
            
            {/* Score */}
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
              {player.score} pts
            </div>

            {/* Strikes (Visualized as Red Xs) */}
            <div style={{ marginTop: '10px', color: '#dc2626', fontSize: '1.2rem' }}>
              {'X '.repeat(player.strikes)}
              {/* Show empty circles for remaining lives? Optional polish. */}
            </div>
            
            {player.isOut && <div style={{color: 'red', fontWeight: 'bold'}}>OUT</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;