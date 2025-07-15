import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StudentNavbar.css';
import { FaHome, FaUserGraduate, FaCalendarAlt, FaCreditCard, FaChartLine, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Check if the current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="student-navbar">
      <div className="navbar-logo">
        <img src="https://i.ibb.co/6bQ7Q8d/driving-logo.png" alt="Driving School Logo" />
        <span>Driving School</span>
      </div>
      
      <div className="navbar-user">
        <img src="https://i.ibb.co/6WZ8g7Q/user.png" alt="User" />
        <span>{user?.name || 'Student'}</span>
      </div>
      
      <ul className="navbar-links">
        <li>
          <Link to="/student-dashboard" className={isActive("/student-dashboard") ? "active" : ""}>
            <FaHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/appointments" className={isActive("/appointments") ? "active" : ""}>
            <FaCalendarAlt /> Appointments
          </Link>
        </li>
        <li>
          <Link to="/progress" className={isActive("/progress") ? "active" : ""}>
            <FaChartLine /> Progress
          </Link>
        </li>
        <li>
          <Link to="/payment" className={isActive("/payment") ? "active" : ""}>
            <FaCreditCard /> Payments
          </Link>
        </li>
        <li>
          <Link to="/courses" className={isActive("/courses") ? "active" : ""}>
            <FaUserGraduate /> Course Details
          </Link>
        </li>
        <li>
          <Link to="/materials" className={isActive("/materials") ? "active" : ""}>
            <FaFileAlt /> Course Materials
          </Link>
        </li>
        <li>
          <button onClick={logout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default StudentNavbar; 