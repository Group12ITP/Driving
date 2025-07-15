import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AttendanceList.css';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [editingStatus, setEditingStatus] = useState({});

  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  const loadAttendanceRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:5000/api/attendance');
      setAttendanceRecords(response.data);
      
      // Initialize editing status for each record
      const initialEditingStatus = {};
      response.data.forEach(record => {
        initialEditingStatus[record._id] = record.status;
      });
      setEditingStatus(initialEditingStatus);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance records');
      console.error('Error loading attendance records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendance/date/${dateFilter.startDate}/${dateFilter.endDate}`
      );
      setAttendanceRecords(response.data);
      
      // Initialize editing status for filtered records
      const initialEditingStatus = {};
      response.data.forEach(record => {
        initialEditingStatus[record._id] = record.status;
      });
      setEditingStatus(initialEditingStatus);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to filter attendance records');
      console.error('Filter error:', err);
    }
  };

  const handleResetFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
    loadAttendanceRecords();
  };

  const handleStatusChange = (id, status) => {
    setEditingStatus({
      ...editingStatus,
      [id]: status
    });
  };

  const updateStatus = async (id) => {
    try {
      const newStatus = editingStatus[id];
      
      await axios.put(`http://localhost:5000/api/attendance/${id}`, {
        status: newStatus
      });
      
      // Update local state
      setAttendanceRecords(attendanceRecords.map(record => 
        record._id === id ? {...record, status: newStatus} : record
      ));
      
      alert('Status updated successfully!');
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
      console.error('Update error:', err);
    }
  };

  const deleteAttendanceRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/attendance/${id}`);
      
      // Update local state
      setAttendanceRecords(attendanceRecords.filter(record => record._id !== id));
    } catch (err) {
      alert('Failed to delete record: ' + (err.response?.data?.message || err.message));
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="atd-loading">Loading attendance records...</div>;
  if (error) return <div className="atd-error-message">Error: {error}</div>;
  if (attendanceRecords.length === 0) return <div className="atd-no-records">No attendance records found. Please sync with appointments first.</div>;

  return (
    <div className="atd-container">
      <h2 className="atd-filter-title">Attendance Records</h2>
      
      <div className="atd-filter-section">
        <h3 className="atd-filter-title">Filter by Date Range</h3>
        <div className="atd-date-inputs">
          <label>
            Start Date:
            <input 
              type="date" 
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
            />
          </label>
          <label>
            End Date:
            <input 
              type="date" 
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
            />
          </label>
          <button className="atd-filter-btn" onClick={handleFilter}>Apply Filter</button>
          <button className="atd-reset-btn" onClick={handleResetFilter}>Reset</button>
        </div>
      </div>
      
      <div className="atd-table-container">
        <table className="atd-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Instructor ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map(record => (
              <tr key={record._id}>
                <td>{record.studentId}</td>
                <td>{record.studentName}</td>
                <td>{record.formattedInstructorId || record.instructorId}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <div className="atd-status-editor">
                    <select 
                      value={editingStatus[record._id] || record.status}
                      onChange={(e) => handleStatusChange(record._id, e.target.value)}
                      className={`atd-status-select ${(editingStatus[record._id] || record.status).toLowerCase()}`}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </div>
                </td>
                <td>
                  <button 
                    className="atd-update-btn"
                    onClick={() => updateStatus(record._id)}
                    title="Update status"
                  >
                    Update
                  </button>
                  <button 
                    className="atd-delete-btn" 
                    onClick={() => deleteAttendanceRecord(record._id)}
                    title="Delete record"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;