import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ coins }) => {
  return (
    <div className="scoreboard">
      <span className="coin-icon" role="img" aria-label="coin">🪙</span>
      <span className="coin-count">{coins}</span>
    </div>
  );
};

export default Scoreboard;
