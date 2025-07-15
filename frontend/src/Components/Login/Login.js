import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav2';
import './Login.css';
import { useAuth } from '../../context/AuthContext';

function Login() {
    const history = useNavigate();
    const { login } = useAuth();
    const [user, setUser] = useState({
        gmail: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({...prevUser, [name]: value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check for admin credentials
        if(user.gmail === "admin" && user.password === "admin") {
            login({ name: "Admin", gmail: "admin", role: "admin" });
            alert("Admin Login Successful!");
            history("/admin", { replace: true });
            return;
        }
        if(user.gmail === "ins" && user.password === "ins") {
            login({ name: "Instructor", gmail: "ins", role: "instructor" });
            alert("Instructor Login Successful!");
            history("/studentdetails", { replace: true });
            return;
        }
        
        // Regular user login
        try {
            const response = await sendRequest();
            if(response.status === "ok") {
                // Process instructor ID if this is an instructor
                if (response.user.role === "instructor" && response.user.instructorId) {
                    const instructorId = response.user.instructorId.toString();
                    
                    // Check if ID already has a prefix to avoid duplication
                    if (!(instructorId.startsWith('BO') || 
                          instructorId.startsWith('BC') || 
                          instructorId.startsWith('HV'))) {
                        
                        // Don't modify the ID here - we'll handle prefixing in the Progress component
                        // This avoids potential multiple prefixing
                        console.log('Logging in with instructor ID:', instructorId);
                    }
                }
                
                // Store additional debug info
                localStorage.setItem('lastLoggedInUser', JSON.stringify({
                    ...response.user,
                    loginTime: new Date().toISOString()
                }));
                
                login(response.user);
                alert("Login Successful");
                
                // Redirect based on user role
                if (response.user.role === "student") {
                    // Redirect students to the student dashboard instead of home
                    history("/student-dashboard", { replace: true });
                } else if (response.user.role === "instructor") {
                    history("/instructordashboard", { replace: true });
                }
            } else {
                alert("Invalid credentials");
            }
        } catch(err) {
            alert("Error: " + err.message);
        }
    };

    const sendRequest = async() => {
        return axios.post("http://localhost:5000/login", {
            gmail: user.gmail,
            password: user.password,
        })
        .then((res) => res.data);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="modern-login-container">
            <Nav/>
            <div className="login-card">
                <div className="login-form-container">
                    <div className="login-header">
                        <div className="login-icon"></div>
                        <h1>Log In</h1>
                        <p>Welcome back! Please enter your details</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className='modern-login-form' autoComplete="off">
                        <div className="input-field">
                            <label htmlFor="gmail">Email</label>
                            <div className="password-field">
                                <input 
                                    type="text" 
                                    id="gmail"
                                    value={user.gmail} 
                                    onChange={handleInputChange} 
                                    name="gmail" 
                                    placeholder="Enter your email"
                                    required 
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="input-field">
                            <label htmlFor="password">Password</label>
                            <div className="password-field">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="password" 
                                    value={user.password} 
                                    onChange={handleInputChange} 
                                    name="password"
                                    placeholder="Enter your password"
                                    required 
                                    autoComplete="new-password"
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password" 
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-btn form-login-btn">Log In</button>
                        
                        <p className="signup-prompt">
                            Don't have an account? <a href="/register">Sign up</a>
                        </p>
                    </form>
                </div>
                <div className="login-image">
                    {/* The image will be added via CSS */}
                </div>
            </div>
        </div>
    )
}

export default Login
