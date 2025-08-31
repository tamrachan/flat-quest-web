import { Link } from "react-router-dom";
import "./NavBar.css"

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-title">
            <h3>FlatQuest</h3>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
        </div>
    </nav>
}

export default NavBar;