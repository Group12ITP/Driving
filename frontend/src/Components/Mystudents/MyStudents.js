import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MyStudents.css';

const URL = 'http://localhost:5000/api/appointments/';

const fetchAppointments = async () => {
  return await axios.get(URL).then((res) => res.data);
};

// Format instructor ID based on course type
const formatInstructorId = (courseName, instructorId) => {
  if (!courseName) return instructorId;
  
  const courseNameLower = courseName.toLowerCase();
  
  if (courseNameLower.includes('bike') && !courseNameLower.includes('car')) {
    return `BO${instructorId.toString().padStart(3, '0')}`;
  } else if (courseNameLower.includes('bike') && courseNameLower.includes('car')) {
    return `BC${instructorId.toString().padStart(3, '0')}`;
  } else if (courseNameLower.includes('heavy')) {
    return `HV${instructorId.toString().padStart(3, '0')}`;
  }
  
  return instructorId;
};

function MyStudents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'studentName', direction: 'ascending' });

  useEffect(() => {
    // Redirect if not logged in or not an instructor
    if (!user || user.role !== 'instructor') {
      navigate('/login');
      return;
    }
    
    loadAppointments();
  }, [user, navigate]);

  const loadAppointments = () => {
    setLoading(true);
    fetchAppointments().then((data) => {
      // Filter appointments for the current instructor
      const instructorAppointments = data.appointments.filter(
        apt => apt.instructorId == user.instructorId || 
               apt.instructorName.toLowerCase() === user.name.toLowerCase()
      );
      
      // Create unique student list with their latest appointment details
      const uniqueStudents = Object.values(instructorAppointments.reduce((acc, apt) => {
        // If student doesn't exist in accumulator or this appointment is more recent
        if (!acc[apt.studentId] || new Date(apt.date) > new Date(acc[apt.studentId].date)) {
          acc[apt.studentId] = {
            studentId: apt.studentId,
            studentName: apt.studentName,
            courseName: apt.courseName,
            lastAppointment: new Date(apt.date).toLocaleDateString(),
            totalAppointments: 1
          };
        } else {
          // Increment total appointments if student already exists
          acc[apt.studentId].totalAppointments++;
        }
        return acc;
      }, {}));
      
      setAppointments(uniqueStudents);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching appointments:", error);
      setError("Failed to load student data. Please try again later.");
      setLoading(false);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-pending';
    
    status = status.toLowerCase();
    if (status === 'completed') return 'status-completed';
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'cancelled') return 'status-cancelled';
    return 'status-pending';
  };

  // Sorting function
  const sortedStudents = React.useMemo(() => {
    const sortableItems = [...appointments];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [appointments, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return <div className="loading-container">Loading your students...</div>;
  }

  if (!user) {
    return <div className="error-container">You must be logged in to view this page.</div>;
  }

  return (
    <div className="my-students-container">
      <div className="instructor-header-section">
        <h1>My Students</h1>
        <div className="instructor-info">
          <p>Instructor: {user.name}</p>
          <p>ID: {user.instructorId || "Not assigned"}</p>
          <button onClick={() => navigate('/instructordashboard')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {appointments.length === 0 ? (
        <div className="no-students-message">
          <p>You don't have any students assigned yet.</p>
        </div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('studentId')}>
                  Student ID {getSortIndicator('studentId')}
                </th>
                <th onClick={() => requestSort('studentName')}>
                  Student Name {getSortIndicator('studentName')}
                </th>
                <th onClick={() => requestSort('courseName')}>
                  Course {getSortIndicator('courseName')}
                </th>
                <th onClick={() => requestSort('lastAppointment')}>
                  Last Appointment {getSortIndicator('lastAppointment')}
                </th>
                <th onClick={() => requestSort('totalAppointments')}>
                  Total Appointments {getSortIndicator('totalAppointments')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.studentId}</td>
                  <td>{student.studentName}</td>
                  <td>{student.courseName}</td>
                  <td>{student.lastAppointment}</td>
                  <td>{student.totalAppointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyStudents;
