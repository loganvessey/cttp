import React, { useState, useEffect, useRef } from 'react';
import allPlayers from '../data/all_players.json';

const PlayerInput = ({ onGuess, currentPlayerName, isDisabled }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Ref to handle clicking outside the box to close it
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Close dropdown if user clicks outside
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleChange = (e) => {
    const userInput = e.target.value;
    setInputValue(userInput);

    // Filter Logic:
    // 1. Only start searching after 2 characters (Optimization)
    // 2. Limit to top 10 results (UX)
    if (userInput.length > 1) {
      const filtered = allPlayers.filter(
        (player) => player.toLowerCase().includes(userInput.toLowerCase())
      ).slice(0, 10); // Show max 10
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (name) => {
    setInputValue(name);
    setShowSuggestions(false);
    onGuess(name); // Auto-submit when clicked
    setInputValue(""); // Clear after submit
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuess(inputValue); // Submit whatever is in the box
    setInputValue("");
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder={`Player ${currentPlayerName}, enter guess...`}
          style={{
            padding: '15px',
            fontSize: '1.2rem',
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
          autoFocus // Keep focus here for speed
        />
      </form>

      {/* THE DROPDOWN LIST */}
      {showSuggestions && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          margin: 0,
          padding: 0,
          listStyleType: 'none',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {suggestions.map((player, index) => (
            <li
              key={index}
              onClick={() => handleSelect(player)}
              style={{
                padding: '12px 15px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                fontSize: '1rem',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              {player}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerInput;
