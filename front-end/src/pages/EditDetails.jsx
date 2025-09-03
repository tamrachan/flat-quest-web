import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../components/AuthRoute";
import IconPicker from "../components/IconPicker/IconPicker";
import "../css/EditDetails.css";
import toast from "react-hot-toast";

function EditDetails() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [code, setGroupCode] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('default');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You are not logged in");
            navigate("/login");
            return;
        }

        try {
            // Verify token is valid
            jwtDecode(token);
        } catch {
            toast.error("Invalid token");
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        // Fetch fresh user data from backend instead of using JWT payload
        api.get('/reset/me')
            .then(res => {
                const userData = res.data.user;
                setUser(userData);
                
                // Pre-populate form fields with FRESH data
                setName(userData.name || '');
                setUsername(userData.username || userData.user || '');
                setEmail(userData.email || '');
                setGroupCode(userData.code || '');
                setSelectedIcon(userData.icon || 'default');
            })
            .catch(err => {
                console.error("Failed to fetch user data:", err);
                toast.error("Session expired. Please login again.");
                localStorage.removeItem("token");
                navigate("/login");
            });

        // Remove the old protected route call since /me replaces it
    }, [navigate]);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (name && name !== user.name) {
            api.patch('/reset/update-name', { name })
                .then(res => {
                    console.log(res.data);
                    // Update both user state and form field
                    setUser(prevUser => ({
                        ...prevUser,
                        name: name
                    }));
                    toast.success('Name updated successfully!');
                })
                .catch(err => console.error(err));
        }

        if (username && username !== (user.username || user.user)) {
            api.patch('/reset/update-user', { username })
                .then(res => {
                    setUser(prevUser => ({
                        ...prevUser,
                        username: username,
                        user: username // Handle both field names
                    }));
                    toast.success('Username updated successfully!');
                })
                .catch(err => console.error(err));
        }

        if (email && email !== user.email) {
            api.patch('/reset/update-email', { email })
                .then(res => {
                    setUser(prevUser => ({
                        ...prevUser,
                        email: email
                    }));
                    toast.success('Email updated successfully!');
                })
                .catch(err => console.error(err));
        }

        if (pass) {
            api.patch('/reset/change-password', { 
                currentPassword: 'prompt_user_for_this', // You'll need current password
                newPassword: pass 
            })
                .then(res => {
                    toast.success('Password updated successfully!');
                    setPass(''); // Clear password field after success
                })
                .catch(err => console.error(err));
        }

        if (code && code.length === 6 && code !== user.code) {
            api.patch('/reset/update-code', { groupCode: code })
                .then(res => {
                    setUser(prevUser => ({
                        ...prevUser,
                        code: code
                    }));
                    toast.success('Group code updated successfully!');
                })
                .catch(err => console.error(err));
        }

        if (selectedIcon && selectedIcon !== (user.icon || 'default')) {
            api.patch('/reset/update-icon', { icon: selectedIcon })
                .then(res => {
                    // Update user state locally to reflect the change immediately
                    setUser(prevUser => ({
                        ...prevUser,
                        icon: selectedIcon
                    }));
                    // IMPORTANT: Update localStorage so other parts of the app see the change
                    const storedUser = JSON.parse(localStorage.getItem("userData"));
                    if (storedUser) {
                        storedUser.icon = selectedIcon;
                        localStorage.setItem("userData", JSON.stringify(storedUser));
                    }
                    // print("Updated icon to: %s", selectedIcon);
                    toast.success('Icon updated successfully!');
                })
                .catch(err => {
                    console.error("Failed to update icon:", err);
                    // print("Updated icon to: %s", selectedIcon);
                    toast.error("There was an error updating your icon.");
                });
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="edit-details-page">
            <div className="edit-details-form-container">
                <h2>Edit my account details</h2>
                <form className="edit-details-form" onSubmit={handleSubmit}>

                    <IconPicker 
                        currentIcon={selectedIcon} 
                        onIconSelect={(iconName) => setSelectedIcon(iconName)} 
                    />

                    <br />

                    <label htmlFor="name">Full name:</label>
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        type="text" 
                        placeholder="Enter your full name"
                        id="name" 
                        name="name" 
                    />
                    <br />
                    
                    <label htmlFor="user">Username:</label>
                    <input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        type="text" 
                        placeholder="Enter your username"
                        id="user" 
                        name="user" 
                    />
                    <br />
                    
                    <label htmlFor="email">Email:</label>
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        placeholder="Enter your email"
                        id="email" 
                        name="email" 
                    />
                    <br />
                    
                    <label htmlFor="password">New Password:</label>
                    <input 
                        value={pass} 
                        onChange={(e) => setPass(e.target.value)} 
                        type="password" 
                        placeholder="Enter new password (optional)"
                        id="password" 
                        name="password" 
                    />
                    <br />
                    
                    <label htmlFor="groupCode">Group Code:</label>
                    <input 
                        value={code} 
                        onChange={(e) => setGroupCode(e.target.value.toUpperCase())} 
                        type="text" 
                        placeholder="Enter 6-character group code"
                        id="groupCode" 
                        name="groupCode" 
                        maxLength={6} 
                    />

                    <br />
                    
                    <button type="submit">Update details</button>
                </form>
            </div>
        </div>
    );
}


export default EditDetails;