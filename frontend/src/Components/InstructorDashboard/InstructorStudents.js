import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './InstructorStudents.css';

function InstructorStudents() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect if not logged in or not an instructor
    useEffect(() => {
        if (!user || user.role !== 'instructor') {
            navigate('/login');
        } else {
            fetchStudents();
        }
    }, [user, navigate]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            // Updated API endpoint path to match the backend route
            const response = await axios.get(`/api/instructors/${user.instructorId}/students`);
            setStudents(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to load students. Please try again later.');
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="loading-container">Loading...</div>;
    }

    if (loading) {
        return <div className="loading-container">Loading students...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="instructor-students-container">
            <header className="students-header">
                <h1>My Students</h1>
                <div className="header-actions">
                    <button onClick={() => navigate('/instructordashboard')} className="back-btn">
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="students-list-container">
                {students.length === 0 ? (
                    <div className="no-students-message">
                        <p>You don't have any assigned students yet.</p>
                    </div>
                ) : (
                    <div className="students-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>Progress</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student._id}>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.phone || 'N/A'}</td>
                                        <td>{student.course || 'Not assigned'}</td>
                                        <td>
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress" 
                                                    style={{ width: `${student.progress || 0}%` }}
                                                ></div>
                                            </div>
                                            <span>{student.progress || 0}%</span>
                                        </td>
                                        <td>
                                            <button 
                                                className="view-details-btn"
                                                onClick={() => navigate(`/student/${student._id}`)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InstructorStudents; 