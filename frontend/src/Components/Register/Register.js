import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';
import Nav2 from '../Nav/Nav2';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Register() {
    const history = useNavigate();
    const [user, setUser] = useState({
        name: "",
        gmail: "",
        password: "",
        confirmPassword: "",
        age: "",
        gender: "",
        address: "",
        phoneNumber: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        gmail: "",
        password: "",
        confirmPassword: "",
        age: "",
        gender: "",
        address: "",
        phoneNumber: "",
        general: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateField = (name, value) => {
        let error = "";
        
        switch (name) {
            case "name":
                if (!value.trim()) {
                    error = "Name is required";
                } else if (value.trim().length < 2) {
                    error = "Name must be at least 2 characters";
                }
                break;
            case "gmail":
                if (!value.trim()) {
                    error = "Email is required";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Please enter a valid email address";
                }
                break;
            case "password":
                if (!value) {
                    error = "Password is required";
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters";
                } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
                    error = "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character";
                }
                break;
            case "confirmPassword":
                if (!value) {
                    error = "Please confirm your password";
                } else if (value !== user.password) {
                    error = "Passwords do not match";
                }
                break;
            case "age":
                if (!value) {
                    error = "Age is required";
                } else if (isNaN(value) || parseInt(value) < 17 || parseInt(value) > 150) {
                    error = "Please enter a valid age between 17 and 150";
                }
                break;
            case "gender":
                if (!value) {
                    error = "Please select a gender";
                }
                break;
            case "address":
                if (!value.trim()) {
                    error = "Address is required";
                } else if (value.trim().length < 5) {
                    error = "Please enter a complete address";
                }
                break;
            case "phoneNumber":
                if (!value.trim()) {
                    error = "Phone number is required";
                } else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
                    error = "Please enter a valid 10-digit phone number";
                }
                break;
            default:
                break;
        }

        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
        
        // Validate field as user types
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
        
        // Clear general error when user makes changes
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: "" }));
        }
        
        // Check password match when either password field changes
        if (name === "password" || name === "confirmPassword") {
            if (name === "password" && user.confirmPassword) {
                const confirmError = value !== user.confirmPassword ? "Passwords do not match" : "";
                setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
            } else if (name === "confirmPassword") {
                const confirmError = value !== user.password ? "Passwords do not match" : "";
                setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
            }
        }
    }

    const validateForm = () => {
        let formValid = true;
        const newErrors = { ...errors };
        
        // Validate each field
        Object.keys(user).forEach(key => {
            if (key !== "confirmPassword") { // Skip confirmPassword as it's validated separately
                const error = validateField(key, user[key]);
                newErrors[key] = error;
                if (error) {
                    formValid = false;
                }
            }
        });
        
        // Validate confirmPassword
        const confirmError = validateField("confirmPassword", user.confirmPassword);
        newErrors.confirmPassword = confirmError;
        if (confirmError) {
            formValid = false;
        }
        
        setErrors(newErrors);
        return formValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate entire form before submission
        if (!validateForm()) {
            setErrors(prev => ({ ...prev, general: "Please fix all errors before submitting" }));
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/users", {
                name: user.name,
                gmail: user.gmail,
                password: user.password,
                age: Number(user.age),
                gender: user.gender,
                address: user.address,
                phoneNumber: user.phoneNumber
            });

            if (response.data) {
                alert("Registration Successful!");
                history("/login");
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response) {
                if (error.response.data.message === "Email already exists") {
                    setErrors(prev => ({ ...prev, gmail: "Email already exists", general: "" }));
                } else {
                    setErrors(prev => ({ ...prev, general: error.response.data.message || "Registration failed" }));
                }
            } else {
                setErrors(prev => ({ ...prev, general: "Network error. Please try again." }));
            }
        }
    };

    return (
        <div>
            <Nav2 />
            <div className="register-auth-container">
                <div className="register-auth-card">
                    <div className="register-welcome-section">
                        <div className="register-logo">

                        </div>
                        <h2>Welcome!</h2>
                        <p>To keep connected with us please login with your personal info</p>
                        <a href="/login" className="register-sign-btn">SIGN IN</a>
                    </div>

                    <div className="register-form-section">
                        <h2>Create Account</h2>

                        <div className="register-social-icons">
                            <a href="#" className="register-social-icon register-facebook-icon">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="register-social-icon register-google-icon">
                                <i className="fab fa-google"></i>
                            </a>
                            <a href="#" className="register-social-icon register-instagram-icon">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>

                        <p className="register-or-text">or use your email for registration:</p>

                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="register-input-field">
                                <i className="fas fa-user"></i>
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    name="name"
                                    placeholder="Name"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            {errors.name && <p className="register-error-message">{errors.name}</p>}

                            <div className="register-input-field">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    value={user.gmail}
                                    onChange={handleInputChange}
                                    name="gmail"
                                    placeholder="Email"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            {errors.gmail && <p className="register-error-message">{errors.gmail}</p>}

                            <div className="register-input-field">
                                <i className="fas fa-user"></i>
                                <input
                                    type="number"
                                    value={user.age}
                                    onChange={handleInputChange}
                                    name="age"
                                    placeholder="Age"
                                    required
                                    min="17"
                                    max="150"
                                    className="register-age-input"
                                    autoComplete="off"
                                />
                            </div>
                            {errors.age && <p className="register-error-message">{errors.age}</p>}

                            <div className="register-input-field">
                                <i className="fas fa-venus-mars"></i>
                                <select
                                    value={user.gender}
                                    onChange={handleInputChange}
                                    name="gender"
                                    required
                                    className="register-gender-select"
                                    autoComplete="off"
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <i className="fas fa-chevron-down register-select-arrow"></i>
                            </div>
                            {errors.gender && <p className="register-error-message">{errors.gender}</p>}

                            <div className="register-input-field">
                                <i className="fas fa-map-marker-alt"></i>
                                <input
                                    type="text"
                                    value={user.address}
                                    onChange={handleInputChange}
                                    name="address"
                                    placeholder="Address"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            {errors.address && <p className="register-error-message">{errors.address}</p>}

                            <div className="register-input-field">
                                <i className="fas fa-phone"></i>
                                <input
                                    type="tel"
                                    value={user.phoneNumber}
                                    onChange={handleInputChange}
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            {errors.phoneNumber && <p className="register-error-message">{errors.phoneNumber}</p>}

                            <div className="register-input-field">
                                <i className="fas fa-lock"></i>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={user.password}
                                    onChange={handleInputChange}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    autoComplete="new-password"
                                />
                                <span className="register-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {errors.password && <p className="register-error-message">{errors.password}</p>}

                            <div className="register-input-field">
                                <i className="fas fa-lock"></i>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={user.confirmPassword}
                                    onChange={handleInputChange}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    required
                                    autoComplete="new-password"
                                />
                                <span className="register-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {errors.confirmPassword && <p className="register-error-message">{errors.confirmPassword}</p>}

                            {errors.general && <p className="register-error-message">{errors.general}</p>}

                            <button type="submit" className="register-signup-btn">SIGN UP</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
