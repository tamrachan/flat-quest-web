import "../css/Games.css"
import redBeachBall from '../assets/icons/red_beach_ball.png';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../components/AuthRoute";

function Games() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetch fresh user data instead of using JWT payload
        api.get('/reset/me')
            .then(res => {
                setUser(res.data.user); // Fresh data from database
            })
            .catch(err => {
                console.error("Failed to fetch user data:", err);
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, []);

    const goToGame = () => {
        navigate("/games/tictactoe");
    };

    return (
        <div className="game-menu">
            <h1>Mini games</h1>

            <p>{user?.user}'s score: 0</p>
            
            <p>Add mini games here</p>
            <div className="game-grid" onClick={goToGame} style={{ cursor: "pointer" }}>
                <div className="game-card">
                    <h3>TicTacToe</h3>
                    <h4>2 players</h4>
                    <img className="game-img" src={redBeachBall}></img>
                    <p className="game-desc">Battle it out over a two-player TicTacToe game</p>
                    {/* TODO: make button link to game */}
                </div>
            </div>
        </div>
    )
}

export default Games;