import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Progress.css';
import ProgressSync from '../ProgressSync/ProgressSync';

function Progress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    notes: ''
  });

  const filters = [
    'All',
    'Not Started',
    'Theory Learning',
    'Theory Test Passed',
    'Practical Training',
    'Ready for License Test',
    'Licensed'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStudentProgress();
  }, [user, navigate]);

  useEffect(() => {
    filterStudents(activeFilter, searchTerm);
  }, [activeFilter, searchTerm, students]);

  // Format instructor ID based on course type
  const formatInstructorId = (instructorId, courseName) => {
    if (!instructorId) return '';
    
    // If instructorId already has a format like BO001, return as is
    if (typeof instructorId === 'string' && /^[A-Z]{2}\d{3}$/.test(instructorId)) {
      return instructorId;
    }
    
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

  // Function to sync progress records from appointments
  const syncProgressFromAppointments = async () => {
    setSyncing(true);
    try {
      const response = await axios.post('http://localhost:5000/api/progress/sync-from-appointments');
      alert(response.data.message || 'Progress records have been synced successfully.');
      // Refresh the progress records
      fetchStudentProgress();
    } catch (error) {
      console.error('Error syncing progress records:', error);
      alert('Failed to sync progress records. Please try again later.');
    } finally {
      setSyncing(false);
    }
  };

  // Fetch student progress records from the Progress model
  const fetchStudentProgress = async () => {
    setLoading(true);
    try {
      // Format instructor ID based on instructor type from user credentials
      let formattedInstructorId;
      
      if (user && user.instructorId) {
        // Get the instructor type to determine the prefix
        const instructorType = user.instructorType || '';
        const instructorId = user.instructorId.toString();
        
        // Check if instructor ID already has a prefix to avoid duplication
        if (instructorId.startsWith('BO') || instructorId.startsWith('BC') || instructorId.startsWith('HV')) {
          formattedInstructorId = instructorId;
        } else {
          // Add prefix based on instructor type
          if (instructorType === 'Bike') {
            formattedInstructorId = `BO${instructorId.padStart(3, '0')}`;
          } else if (instructorType === 'BikeCar') {
            formattedInstructorId = `BC${instructorId.padStart(3, '0')}`;
          } else if (instructorType === 'HeavyVehicle') {
            formattedInstructorId = `HV${instructorId.padStart(3, '0')}`;
          } else {
            // Fallback to raw instructor ID if type is unknown
            formattedInstructorId = instructorId;
          }
        }
      } else {
        // Fallback if no user.instructorId is available
        formattedInstructorId = user.id || '';
      }
      
      console.log('Fetching progress records for instructor ID:', formattedInstructorId);
      
      // Fetch progress records for this instructor
      const response = await axios.get(`http://localhost:5000/api/progress/instructor/${formattedInstructorId}`);
      const progressRecords = response.data || [];
      
      console.log('Fetched progress records:', progressRecords);
      
      // Map progress records to the format needed for the UI
      const formattedStudents = progressRecords.map(record => {
        const statusValues = {
          'Not Started': 0,
          'Theory Learning': 20,
          'Theory Test Passed': 40,
          'Practical Training': 60,
          'Ready for License Test': 80,
          'Licensed': 100
        };
        
        return {
          id: record._id,
          studentId: record.studentId,
          name: record.studentName,
          startDate: new Date(record.startDate).toLocaleDateString(),
          status: record.studentProgress,
          progress: statusValues[record.studentProgress] || 0,
          notes: record.notes,
          courseName: record.name
        };
      });
      
      setStudents(formattedStudents);
      setFilteredStudents(formattedStudents);
    } catch (error) {
      console.error('Error fetching progress records:', error);
      // If 404 error (no records found), show empty state
      if (error.response && error.response.status === 404) {
        setStudents([]);
        setFilteredStudents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = (status, search) => {
    let result = students;
    if (status !== 'All') {
      result = result.filter(student => student.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(student => 
        (student.name && student.name.toLowerCase().includes(searchLower)) || 
        (student.studentId && student.studentId.toLowerCase().includes(searchLower))
      );
    }
    setFilteredStudents(result);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      status: student.status,
      notes: student.notes || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update progress record in the database
      await axios.put(`http://localhost:5000/api/progress/${editingStudent.id}`, {
        studentProgress: editForm.status,
        notes: editForm.notes
      });
      
      // Update the local state
      const updatedStudents = students.map(student => {
        if (student.id === editingStudent.id) {
          const statusValues = {
            'Not Started': 0,
            'Theory Learning': 20,
            'Theory Test Passed': 40,
            'Practical Training': 60,
            'Ready for License Test': 80,
            'Licensed': 100
          };
          
          return {
            ...student,
            status: editForm.status,
            progress: statusValues[editForm.status] || student.progress,
            notes: editForm.notes
          };
        }
        return student;
      });
      
      setStudents(updatedStudents);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student progress:', error);
      alert('Failed to update student progress. Please try again.');
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this progress record?')) {
      try {
        // Delete progress record from the database
        await axios.delete(`http://localhost:5000/api/progress/${studentId}`);
        
        // Update local state
        const updatedStudents = students.filter(student => student.id !== studentId);
        setStudents(updatedStudents);
        setFilteredStudents(updatedStudents);
      } catch (error) {
        console.error('Error deleting student progress:', error);
        alert('Failed to delete student progress. Please try again.');
      }
    }
  };

  const getProgressBarColor = (status) => {
    switch(status) {
      case 'Not Started':
        return '#e74c3c';
      case 'Theory Learning':
        return '#f39c12';
      case 'Theory Test Passed':
        return '#2ecc71';
      case 'Practical Training':
        return '#3498db';
      case 'Ready for License Test':
        return '#9b59b6';
      case 'Licensed':
        return '#1abc9c';
      default:
        return '#95a5a6';
    }
  };

  // Handle navigation based on user role
  const getHomeLink = () => {
    if (user && user.role === 'instructor') {
      return '/instructordashboard';
    }
    return '/dashboard';
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h1>
          <span className="icon">⏱️</span> Progress
        </h1>
        <div className="breadcrumb">
          <Link to={getHomeLink()}>Home</Link> / Progress
        </div>
      </div>

      <ProgressSync />

      <div className="student-progress-timeline">
        <h2>Student Progress Timeline</h2>
        
        <div className="progress-filters">
          {filters.map(filter => (
            <button 
              key={filter}
              className={activeFilter === filter ? 'active' : ''}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        {loading ? (
          <div className="loading">Loading student progress...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="no-results">
            <p>No students found matching the criteria.</p>
            <div className="sync-container">
              <p>If you're expecting to see student progress, you may need to sync data from appointments.</p>
              <button 
                className="sync-btn" 
                onClick={syncProgressFromAppointments}
                disabled={syncing}
              >
                {syncing ? 'Syncing...' : 'Sync Progress from Appointments'}
              </button>
            </div>
          </div>
        ) : (
          <div className="students-list">
            {filteredStudents.map(student => (
              <div key={student.id} className="student-card">
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p>ID: {student.studentId} | Course: {student.courseName}</p>
                  <p>Start Date: {student.startDate}</p>
                </div>
                
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${student.progress}%`,
                      backgroundColor: getProgressBarColor(student.status)
                    }}
                  ></div>
                </div>
                
                <div className="student-status">
                  <span style={{ color: getProgressBarColor(student.status) }}>
                    {student.status}
                  </span>
                </div>
                
                {student.notes && (
                  <div className="student-notes">
                    <p><strong>Notes:</strong> {student.notes}</p>
                  </div>
                )}
                
                <div className="student-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="progress-legend">
        <h3>Progress Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#e74c3c' }}></span>
            <span>Not Started</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
            <span>Theory Learning</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#2ecc71' }}></span>
            <span>Theory Test Passed</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#3498db' }}></span>
            <span>Practical Training</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#9b59b6' }}></span>
            <span>Ready for License Test</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#1abc9c' }}></span>
            <span>Licensed</span>
          </div>
        </div>
      </div>

      {editingStudent && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Update Progress for {editingStudent.name}</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  required
                >
                  {filters.filter(f => f !== 'All').map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditChange}
                  placeholder="Add notes about student progress"
                  rows="4"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save Changes</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Progress; 