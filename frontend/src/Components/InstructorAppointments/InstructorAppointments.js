import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './InstructorAppointments.css';

const API_BASE_URL = 'http://localhost:5000/api/appointments';

function InstructorAppointments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Redirect if not logged in or not an instructor
        if (!user || user.role !== 'instructor') {
            navigate('/login');
            return;
        }
        
        // Debug user information
        console.log("Current instructor user:", user);
        console.log("Instructor ID:", user.instructorId);
        console.log("Instructor Name:", user.name);
        
        fetchInstructorAppointments();
    }, [user, navigate]);

    const fetchInstructorAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch all appointments instead of filtering by instructor ID
            const response = await axios.get(`${API_BASE_URL}`);
            console.log("All appointments response:", response.data);
            
            if (response.data && (response.data.appointments || Array.isArray(response.data))) {
                const allAppointments = response.data.appointments || response.data;
                console.log("All appointments:", allAppointments);
                
                // Filter appointments for the current instructor by name or ID
                const instructorAppointments = allAppointments.filter(apt => {
                    const matchesId = apt.instructorId === user.instructorId;
                    const matchesFormattedId = apt.formattedInstructorId === user.instructorId;
                    const matchesName = apt.instructorName && 
                                        user.name && 
                                        apt.instructorName.toLowerCase() === user.name.toLowerCase();
                    
                    console.log(`Appointment ${apt._id}:`, {
                        aptInstructorId: apt.instructorId,
                        userInstructorId: user.instructorId,
                        aptFormattedId: apt.formattedInstructorId,
                        aptInstructorName: apt.instructorName,
                        userName: user.name,
                        matchesId,
                        matchesFormattedId,
                        matchesName,
                        isMatch: matchesId || matchesFormattedId || matchesName
                    });
                    
                    return matchesId || matchesFormattedId || matchesName;
                });
                
                console.log("Filtered instructor appointments:", instructorAppointments);
                
                // Sort appointments by date and time
                const sortedAppointments = instructorAppointments.sort((a, b) => {
                    // First sort by date
                    const dateComparison = new Date(a.date) - new Date(b.date);
                    if (dateComparison !== 0) return dateComparison;
                    
                    // If same date, sort by time
                    return a.time.localeCompare(b.time);
                });
                
                setAppointments(sortedAppointments);
            } else {
                setError('Failed to fetch appointments: No data returned');
            }
        } catch (error) {
            console.error('Error fetching instructor appointments:', error);
            setError('Error fetching appointments: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to determine the status color
    const getStatusClass = (status) => {
        if (!status) return 'status-pending';
        
        status = status.toLowerCase();
        if (status === 'completed') return 'status-completed';
        if (status === 'confirmed') return 'status-confirmed';
        if (status === 'cancelled') return 'status-cancelled';
        return 'status-pending';
    };

    return (
        <div className="instructor-appointments-container">
            <div className="instructor-appointments-header">
                <h1>My Appointments</h1>
                <button onClick={() => navigate('/instructordashboard')} className="back-button">
                    Back to Dashboard
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : appointments.length === 0 ? (
                <div className="empty-state">
                    <h2>No appointments found</h2>
                    <p>You currently don't have any scheduled appointments.</p>
                </div>
            ) : (
                <div className="appointments-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>{formatDate(appointment.date)}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.studentName}</td>
                                    <td>{appointment.courseName}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                                            {appointment.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default InstructorAppointments; 