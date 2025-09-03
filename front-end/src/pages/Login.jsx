import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../css/Login.css"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

function Login() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();
    // const { setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email !== "" && pass !== "") {
            try {
                const res = await axios.post("http://localhost:5050/record/login", { email, pass });
                const token = res.data.token;

                if (typeof token === "string") {
                try {
                    const decoded = jwtDecode(token);
                    console.log("Decoded token:", decoded);
                } catch (err) {
                    console.error("Invalid token:", err);
                }
                } else {
                    console.warn("No token found or token is not a string");
                }

                // Store token
                localStorage.setItem("token", token);

                // Optionally decode token to get user info
                const user = jwtDecode(token);
                console.log("Logged in as:", user);

                // Navigate to a protected page
                console.log("/flatpage");
                navigate("/flatpage");
                toast.success("You are logged in.");
            } catch (err) {
                alert("Invalid login");
                console.error(err);
            }

            setEmail("");
            setPass("");
        }
    };
    

    return (
        <div className="login">
            <div className="auth-form-container">
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Username/Email:</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="username or youremail@gmail.com" id="email" name="email" />
                    <br></br>
                    <label htmlFor="password">Password:</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="***********" id="password" name="password" />
                    <br></br>
                    <button type="submit">Log in</button>
                </form>
                <Link to="/register" className="link-btn">Don't have an account? Register here!</Link>
                <Link to="/forgotpassword" className="link-btn">Forgot your password?</Link>
            </div>
        </div>
    )
}

export default Login;