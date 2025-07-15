import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSignOutAlt, 
    faUserGraduate, 
    faCalendarAlt, 
    faCalendarCheck, 
    faChartLine, 
    faClipboardCheck,
    faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import './InstructorDashboard.css';

function InstructorDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Redirect if not logged in or not an instructor
    React.useEffect(() => {
        if (!user || user.role !== 'instructor') {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="instructor-dashboard">
            <header className="dashboard-header">
                <h1>Instructor Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user.name}</span>
                    <button onClick={logout} className="ins-logout-btn">
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                </div>
            </header>

            <section className="dashboard-content">
                <div className="ins-profile">
                    <h2>Instructor Profile</h2>
                    <div className="ins-profile-details">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.gmail}</p>
                        <p><strong>Instructor ID:</strong> {user.instructorId}</p>
                        <p><strong>Instructor Type:</strong> {user.instructorType}</p>
                    </div>
                </div>

                <div className="ins-dashboard-cards">
                    <div className="ins-card">
                        <h3><FontAwesomeIcon icon={faUserGraduate} /> My Students</h3>
                        <p>View and manage your assigned students</p>
                        <button onClick={() => navigate('/mystudents')} className="ins-card-btn">
                            View Students
                        </button>
                    </div>
                    
                    <div className="ins-card">
                        <h3><FontAwesomeIcon icon={faCalendarAlt} /> Schedule</h3>
                        <p>View and manage your teaching schedule</p>
                        <button onClick={() => navigate('/instructorschedule')} className="ins-card-btn">
                            View Schedule
                        </button>
                    </div>
                    
                    <div className="ins-card">
                        <h3><FontAwesomeIcon icon={faCalendarCheck} /> Appointments</h3>
                        <p>Manage upcoming appointments</p>
                        <button onClick={() => navigate('/instructorappointments')} className="ins-card-btn">
                            View Appointments
                        </button>
                    </div>

                    <div className="ins-card">
                        <h3><FontAwesomeIcon icon={faChartLine} /> Student Progress</h3>
                        <p>Track student learning progress</p>
                        <button onClick={() => navigate('/progress')} className="ins-card-btn">
                            View Progress
                        </button>
                    </div>
                    
                    <div className="ins-card">
                        <h3><FontAwesomeIcon icon={faClipboardCheck} /> Attendance</h3>
                        <p>Mark and manage student attendance</p>
                        <button onClick={() => navigate('/attendance')} className="ins-card-btn">
                            Manage Attendance
                        </button>
                    </div>
                    
                    <div className="ins-card">
                        <h3><FontAwesomeIcon icon={faFileAlt} /> Course Materials</h3>
                        <p>Upload and manage course materials</p>
                        <button onClick={() => navigate('/materials')} className="ins-card-btn">
                            Manage Materials
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default InstructorDashboard; 