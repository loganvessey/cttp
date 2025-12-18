import React from 'react';

const Ledger = ({ correctGuesses, missedGuesses }) => {
  
  // Shared style for the list containers
  const listContainerStyle = {
    flex: 1,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '0', // Header takes up top space
    backgroundColor: 'white',
    height: '400px', // Fixed height with scroll
    overflowY: 'auto'
  };

  const headerStyle = (color) => ({
    backgroundColor: color,
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'sticky',
    top: 0
  });

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 15px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '0.9rem'
  };

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      
      {/* LEFT COLUMN: Correct Guesses */}
      <div style={listContainerStyle}>
        <div style={headerStyle('#059669')}> {/* Green Header */}
          TOP 100 (HITS)
        </div>
        <div>
          {correctGuesses.length === 0 && <p style={{textAlign: 'center', color: '#999', padding: '20px'}}>No hits yet...</p>}
          
          {correctGuesses.map((player) => (
            <div key={player.rank} style={rowStyle}>
              <span style={{fontWeight: 'bold', width: '40px'}}>#{player.rank}</span>
              <span style={{flex: 1}}>{player.name}</span>
              <span style={{fontWeight: 'bold', color: '#059669'}}>{player.stat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Misses */}
      <div style={listContainerStyle}>
        <div style={headerStyle('#dc2626')}> {/* Red Header */}
          MISSES (101-200)
        </div>
        <div>
          {missedGuesses.length === 0 && <p style={{textAlign: 'center', color: '#999', padding: '20px'}}>No misses yet!</p>}

          {missedGuesses.map((player) => (
            <div key={player.rank} style={rowStyle}>
              <span style={{fontWeight: 'bold', width: '40px', color: '#dc2626'}}>#{player.rank}</span>
              <span style={{flex: 1, color: '#666'}}>{player.name}</span>
              <span style={{fontWeight: 'bold', color: '#999'}}>{player.stat}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Ledger;