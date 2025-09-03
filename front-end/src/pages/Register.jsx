import { useState } from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import "../css/Login.css"
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('member'); // default to member
    const [groupCode, setGroupCode] = useState('');
    const navigate = useNavigate();

    // Generate random 6-letter code
    const generateGroupCode = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return result;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (name && user && email && pass && (role === 'leader' || (role === 'member' && groupCode && groupCode.length === 6))) {
            // TODO: Check if member groupCode is in the database

            let generatedGroupCode = groupCode;
            // If leader, auto-generate code
            if (role === 'leader') {
                generatedGroupCode = generateGroupCode();
                setGroupCode(generatedGroupCode);
            }
            
            console.log(name, user, email, pass, role, generatedGroupCode)
            axios.post('http://localhost:5050/record/register', {
                name,
                user,
                email,
                pass,
                role,
                groupCode: generatedGroupCode,
                defaultIcon: "../assets/icons/anonymous.png"
            })
            .then(result => {
                console.log(result)
                navigate('/flatpage');
            })
            .catch(err => {
                alert(err);
                console.log(err);
            });

            console.log("Valid entries - adding to database");
            setEmail('');
            setPass('');
            setName('');
            setUser('');
            setGroupCode('');
        } else {
            alert("Error creating account: Ensure all entries are valid.");
        }
    };

    return (
        <div className="register">
            <div className="auth-form-container">
                <h2>Register</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="custom-radio-group">
                        <label className="custom-radio">
                            <input type="radio" name="role" value="leader" checked={role === 'leader'} onChange={(e) => setRole(e.target.value)} />
                            <span className="checkmark"></span>
                            <span className="label-text">Group Leader</span>
                        </label>

                        <label className="custom-radio">
                            <input type="radio" name="role" value="member" checked={role === 'member'} onChange={(e) => setRole(e.target.value)} />
                            <span className="checkmark"></span>
                            <span className="label-text">Member (group code)</span>
                        </label>
                    </div>

                    <label htmlFor="name">Full name:</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="Full name" id="name" name="name" />
                    <br></br>
                    <label htmlFor="user">Username:</label>
                    <input value={user} onChange={(e) => setUser(e.target.value)} type="user" placeholder="username" id="user" name="user" />
                    <br></br>
                    <label htmlFor="email">Email:</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                    <br></br>
                    <label htmlFor="password">Password:</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="*********" id="password" name="password" />
                    <br></br>
                    {role === 'member' && (
                        <>
                            <label htmlFor="groupCode">Enter Group Code:</label>
                            <input value={groupCode} onChange={(e) => setGroupCode(e.target.value.toUpperCase())} type="text" placeholder="6 letter group code" 
                            id="groupCode" name="groupCode" maxLength={6} />
                        </>
                    )}
                    <br></br>
                    <button type="submit">Register</button>
                </form>
                <Link to="/login" className="link-btn">Already have an account? Sign in here!</Link>
            </div>
        </div>
    )
}

export default Register;

{/* CODE GRAVEYARD  
    <div>
        <label>
            <input
                type="radio"
                value="leader"
                checked={role === 'leader'}
                onChange={(e) => setRole(e.target.value)}
            />
            Group Leader
        </label>
        <label style={{ marginLeft: "10px" }}>
            <input
                type="radio"
                value="member"
                checked={role === 'member'}
                onChange={(e) => setRole(e.target.value)}
            />
            Member (group code)
        </label>
    </div> */}