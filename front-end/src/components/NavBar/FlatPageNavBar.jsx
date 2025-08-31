import { Link, useNavigate } from "react-router-dom";
import "./FlatPageNavBar.css";
import { FaCog } from 'react-icons/fa';

function FlatPageNavBar({ onSettingsClick }) {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/');
    }

    return <nav className="navbar">
        <div className="navbar-title">
            FlatQuest
        </div>
        <div className="navbar-links">
            <Link to="/flatpage" className="nav-link">FlatPage</Link>
            <Link to="/games" className="nav-link">Mini games</Link>
            <Link to="/details" className="nav-link">Edit account</Link>
            <button onClick={onSettingsClick} className="settings-button">
                <FaCog />
            </button>
            <button className="nav-link logout-button" onClick={logout}>Logout</button>
            
        </div>
    </nav>
}

export default FlatPageNavBar;