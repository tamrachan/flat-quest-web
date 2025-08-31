import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/Games.css'; // Import the new CSS
import api from "../components/AuthRoute";

// Import game icons
import tictactoeIcon from '../assets/icons/red_beach_ball.png';
import placeholderIcon from '../assets/icons/red_beach_ball.png'; // Add a placeholder for future games

// Game data can be managed in an array for easier mapping
const gameList = [
  {
    id: 'tictactoe',
    title: 'Tic-Tac-Toe',
    players: '2 Players',
    description: 'Battle it out in a classic two-player game of Tic-Tac-Toe.',
    icon: tictactoeIcon,
    path: '/games/tictactoe',
  },
  {
    id: 'comingsoon',
    title: 'More Games',
    players: 'Coming Soon',
    description: 'New and exciting mini-games are on their way!',
    icon: placeholderIcon,
    path: null, // No path for the placeholder
  },
];

function Games() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
        return;
    }
    api.get('/reset/me')
        .then(res => {
            setUser(res.data.user);
        })
        .catch(err => {
            console.error("Failed to fetch user data:", err);
            localStorage.removeItem("token");
            navigate("/login");
        });
  }, [navigate]);

  const handleGameClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="games-page-container">
      <div className="games-header">
        <h1>Mini-Games</h1>
        {user && (
          <p className="games-user-score">
            Your Score: <strong>{user.score || 0}</strong>
          </p>
        )}
        <p>Challenge your flatmates to earn points!</p>
      </div>
      
        <div className="games-grid">
        {gameList.map((game) => (
          <div
            key={game.id}
            className={`game-card ${!game.path ? "disabled" : ""}`}
            onClick={game.path ? () => handleGameClick(game.path) : undefined}
          >
            <img
              className="game-card-icon"
              src={game.icon}
              alt={`${game.title} icon`}
            />
            <h3 className="game-card-title">{game.title}</h3>
            <h4 className="game-card-players">{game.players}</h4>
            <p className="game-card-desc">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games;
