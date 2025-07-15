import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaMoneyBillWave, FaBook, FaCalendarAlt, FaIdCard, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminHome.css';

const AdminHome = () => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  const handleCardSelect = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-home-container">
      <div className="admin-header">
        <h2 className="admin-home-title">Admin Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
      
      <div className="admin-content">
        <div className="admin-cards-container">
          <div className={`admin-card ${animate ? 'animate' : ''}`} style={{ animationDelay: '0.1s' }}>
            <div className="card-icon">
              <FaUserGraduate />
            </div>
            <h3>Student Operations</h3>
            <p>Manage student profiles and Messages</p>
            <button className="select-button" onClick={() => handleCardSelect('/userdetails')}>Select</button>
          </div>

          <div className={`admin-card ${animate ? 'animate' : ''}`} style={{ animationDelay: '0.3s' }}>
            <div className="card-icon">
              <FaChalkboardTeacher />
            </div>
            <h3>Attendance Operations</h3>
            <p>Manage attendance of students</p>
            <button className="select-button" onClick={() => handleCardSelect('/attendance-list')}>Select</button>
          </div>

          <div className={`admin-card ${animate ? 'animate' : ''}`} style={{ animationDelay: '0.5s' }}>
            <div className="card-icon">
              <FaBook />
            </div>
            <h3>Progress Operations</h3>
            <p>Manage progress of students in courses</p>
            <button className="select-button" onClick={() => handleCardSelect('/progress-list')}>Select</button>
          </div>

          <div className={`admin-card ${animate ? 'animate' : ''}`} style={{ animationDelay: '0.7s' }}>
            <div className="card-icon">
              <FaMoneyBillWave />
            </div>
            <h3>Payment Operations</h3>
            <p>Manage fee collection, payment processing, and financial reports</p>
            <button className="select-button" onClick={() => handleCardSelect('/payments')}>Select</button>
          </div>

          <div className={`admin-card ${animate ? 'animate' : ''}`} style={{ animationDelay: '0.9s' }}>
            <div className="card-icon">
              <FaIdCard />
            </div>
            <h3>Instructor Credentials</h3>
            <p>Manage instructor credentials, update their access and roles</p>
            <button className="select-button" onClick={() => handleCardSelect('/instructor-credentials')}>Select</button>
          </div>

          <div className={`admin-card ${animate ? 'animate' : ''}`} style={{ animationDelay: '1.1s' }}>
            <div className="card-icon">
              <FaCalendarAlt />
            </div>
            <h3>Appointment Operations</h3>
            <p>Manage and view all student-instructor appointments</p>
            <button className="select-button" onClick={() => handleCardSelect('/allappointments')}>Select</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
