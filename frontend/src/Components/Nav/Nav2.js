import React, { useState, useEffect } from 'react';
import './Nav.css';
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import MessageService from '../../services/MessageService';
import axios from 'axios';

function Nav2() {
  const { user, logout } = useAuth();
  const [pendingMessages, setPendingMessages] = useState(0);
  const [hasCompletedPayments, setHasCompletedPayments] = useState(false);
  const [showCourseNotification, setShowCourseNotification] = useState(() => {
    return localStorage.getItem('showCourseNotification') === 'true';
  });

  // Check if user is admin or instructor
  const isAdminOrInstructor = user && (user.gmail === "admin" || user.gmail === "ins");
  
  // Fetch pending messages count for admin
  useEffect(() => {
    if (isAdminOrInstructor) {
      const fetchPendingMessages = async () => {
        try {
          const count = await MessageService.getPendingMessagesCount();
          setPendingMessages(count);
        } catch (error) {
          console.error('Error fetching pending messages:', error);
        }
      };
      
      fetchPendingMessages();
      
      // Set up a timer to refresh the count every minute
      const interval = setInterval(fetchPendingMessages, 60000);
      
      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    }
  }, [isAdminOrInstructor]);

  // Check if user has completed payments to show Courses menu
  useEffect(() => {
    if (user && user.studentId && !isAdminOrInstructor) {
      const checkPayments = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/payments/student/${user.studentId}`);
          console.log('Payment API response:', response.data); // Debug log
          if (response.data && response.data.payments) {
            const completedPayments = response.data.payments.filter(
              payment => payment.status === 'Completed'
            );
            console.log('Completed payments:', completedPayments); // Debug log
            if (completedPayments.length > 0) {
              setHasCompletedPayments(true);
              if (localStorage.getItem('showCourseNotification') !== 'false') {
                setShowCourseNotification(true);
                localStorage.setItem('showCourseNotification', 'true');
              }
            } else {
              setHasCompletedPayments(false);
            }
          } else {
            setHasCompletedPayments(false);
          }
        } catch (error) {
          setHasCompletedPayments(false);
        }
      };
      checkPayments();
    } else {
      setHasCompletedPayments(false);
    }
  }, [user, isAdminOrInstructor]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className='driving-school-nav2-container'>
      <ul className="driving-school-home-ul">
        <li className='driving-school-home-ll'>
          <Link to="/mainhome" className="active driving-school-home-a">
            <h1>Home</h1>
          </Link>
        </li>

        {/* About Us Dropdown */}
        <li className='driving-school-home-ll driving-school-dropdown'>
          <a href="#" className="driving-school-home-a">
            <h1>About Us</h1>
          </a>
          <div className="driving-school-dropdown-content">
            <Link to="/aboutus">Our Story</Link>
            <Link to="/team">Our Team</Link>
            <Link to="/testimonials">Testimonials</Link>
          </div>
        </li>

        {/* Services Dropdown */}
        

        
        <li className='driving-school-home-ll'>
          <Link to="/packages" className="driving-school-home-a">
            <h1>Packages</h1>
          </Link>
        </li>



        <li className='driving-school-home-ll'>
          <Link to="/contactus" className="driving-school-home-a">
            <h1>Contact Us</h1>
          </Link>
        </li>

        

        {/* Courses Link - visible if payment completed and not admin/instructor */}
        {hasCompletedPayments && user && !isAdminOrInstructor && (
          <li className='driving-school-home-ll'>
            <Link 
              to="/courses" 
              className="driving-school-home-a" 
              onClick={() => {
                setShowCourseNotification(false);
                localStorage.setItem('showCourseNotification', 'false');
              }}
            >
              <h1>
                Appointment 
                {showCourseNotification && <span className="driving-school-new-badge">NEW</span>}
              </h1>
            </Link>
          </li>
        )}

        {hasCompletedPayments && user && !isAdminOrInstructor && (
          <li className='driving-school-home-ll'>
            <Link 
              to="/student-dashboard" 
              className="driving-school-home-a" 
              onClick={() => {
                setShowCourseNotification(false);
                localStorage.setItem('showCourseNotification', 'false');
              }}
            >
              <h1>
                My Dashboard
                {showCourseNotification && <span className="driving-school-new-badge">NEW</span>}
              </h1>
            </Link>
          </li>
        )}
        
        {/* Messages Link - visible for logged in users */}
        {user && (
          <li className='driving-school-home-ll'>
            <Link to={isAdminOrInstructor ? "/admin/messages" : "/messages"} className="driving-school-home-a">
              <h1>
                Messages
                {isAdminOrInstructor && pendingMessages > 0 && (
                  <span className="driving-school-message-badge">{pendingMessages}</span>
                )}
              </h1>
            </Link>
          </li>
        )}

        {user && !isAdminOrInstructor ? (
          <>
            <li className='driving-school-home-ll driving-school-user-profile'>
              <div className="driving-school-user-info">
                <div className="driving-school-user-name">{user.name}</div>
                <div className="driving-school-user-email">{user.gmail}</div>
                <div className="driving-school-user-id">
                  {user.studentId ? user.studentId : "Student ID"}
                </div>
              </div>
            </li>
            <li className='driving-school-home-ll driving-school-logout-btn'>
              <button onClick={handleLogout} className="driving-school-btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className='driving-school-home-ll driving-school-login-btn'>
              <Link to="/login" className="btn2">
                <button>Login</button>
              </Link>
            </li>
            <li className='driving-school-home-ll driving-school-register-btn'>
              <Link to="/register" className="btn1">
                <button>Register</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Nav2;