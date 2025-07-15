import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AttendanceList.css';

const AttendanceList = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      loadAttendanceRecords();
    } else {
      console.log("No user data available");
      setLoading(false);
    }
  }, [user]);

  // Format instructor ID based on instructor type
  const getFormattedInstructorId = () => {
    if (!user) return '';
    
    // Get instructor ID from user object
    let instructorId = user.instructorId || user.id || '';
    
    console.log("Raw instructor ID:", instructorId);
    
    // Check if ID already has a prefix
    if (typeof instructorId === 'string' && 
        (instructorId.startsWith('BO') || 
         instructorId.startsWith('BC') || 
         instructorId.startsWith('HV'))) {
      return instructorId;
    }
    
    // Format based on instructor type
    const instructorType = user.instructorType || '';
    console.log("Instructor type:", instructorType);
    
    if (instructorType === 'Bike') {
      return `BO${instructorId.toString().padStart(3, '0')}`;
    } else if (instructorType === 'BikeCar') {
      return `BC${instructorId.toString().padStart(3, '0')}`;
    } else if (instructorType === 'HeavyVehicle') {
      return `HV${instructorId.toString().padStart(3, '0')}`;
    }
    
    // If no specific format, use a default of "IN" (for Instructor)
    // This ensures we don't have an empty instructor ID
    if (instructorId) {
      return `IN${instructorId.toString().padStart(3, '0')}`;
    }
    
    return 'IN000'; // Default fallback
  };

  const loadAttendanceRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedInstructorId = getFormattedInstructorId();
      console.log('Fetching attendance for instructor:', formattedInstructorId);
      
      // Skip API call if we don't have a valid instructor ID
      if (!formattedInstructorId) {
        console.log('No valid instructor ID, skipping API call');
        setAttendanceRecords([]);
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/attendance/instructor/${formattedInstructorId}`);
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setAttendanceRecords(response.data.attendance || []);
      } else {
        console.error('API returned success: false', response.data);
        setError('Failed to load attendance records: ' + (response.data.message || 'Unknown error'));
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error('Error loading attendance records:', error);
      setError('Error loading attendance records: ' + (error.response?.data?.message || error.message));
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const syncAttendanceFromAppointments = async () => {
    setSyncing(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/attendance/sync-from-appointments');
      console.log('Sync Response:', response.data);
      
      if (response.data.success) {
        alert(response.data.message);
        await loadAttendanceRecords();
      } else {
        setError('Failed to sync attendance records: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error syncing attendance:', error);
      setError('Error syncing attendance records: ' + (error.response?.data?.message || error.message));
    } finally {
      setSyncing(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setEditForm({
      status: record.status,
      notes: record.notes || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`http://localhost:5000/api/attendance/${editingRecord._id}`, editForm);
      
      if (response.data.success) {
        // Update local state
        setAttendanceRecords(
          attendanceRecords.map(record => 
            record._id === editingRecord._id ? 
            { ...record, ...editForm } : 
            record
          )
        );
        
        setEditingRecord(null);
      } else {
        alert('Failed to update attendance: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Error updating attendance record: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const filterRecords = () => {
    if (!filterDate) {
      return attendanceRecords;
    }
    
    const filterDateObj = new Date(filterDate);
    
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === filterDateObj.toDateString();
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-absent';
      case 'Late': return 'status-late';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading attendance records...</div>;
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>Student Attendance Records</h2>
        
        <div className="attendance-actions">
          <div className="filter-container">
            <label htmlFor="date-filter">Filter by Date:</label>
            <input 
              type="date" 
              id="date-filter" 
              value={filterDate} 
              onChange={handleDateFilterChange}
            />
          </div>
          
          <button 
            className="sync-button" 
            onClick={syncAttendanceFromAppointments}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : 'Sync Attendance from Appointments'}
          </button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && filterRecords().length === 0 ? (
        <div className="no-records">
          <p>No attendance records found.</p>
          <p>Click the sync button to generate attendance records from your appointments.</p>
        </div>
      ) : (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterRecords().map(record => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.studentId}</td>
                  <td>{record.studentName}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="notes-cell">{record.notes}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(record)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {editingRecord && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Update Attendance</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Student: {editingRecord.studentName}</label>
                <p>Date: {new Date(editingRecord.date).toLocaleDateString()}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select 
                  id="status" 
                  name="status" 
                  value={editForm.status}
                  onChange={handleEditChange}
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notes:</label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  value={editForm.notes}
                  onChange={handleEditChange}
                  rows={3}
                  placeholder="Add notes about attendance"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-btn">Save</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditingRecord(null)}
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
};

export default AttendanceList; 