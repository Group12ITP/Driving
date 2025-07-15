import React, { useState } from 'react';
import axios from 'axios';
import './AttendanceForm.css';

const AttendanceForm = ({ onAttendanceAdded }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    instructorId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear messages when form changes
    setError(null);
    setSuccess(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Validation
    if (!formData.studentId || !formData.studentName || !formData.instructorId || !formData.date) {
      setError('Please fill out all required fields');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/attendance',
        formData
      );
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        studentId: '',
        studentName: '',
        instructorId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        notes: ''
      });
      
      // Notify parent component of new record
      if (onAttendanceAdded) {
        onAttendanceAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add attendance record');
      console.error('Add attendance error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="attendance-form-container">
      <h2>Add Attendance Record</h2>
      
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="form-success">
          Attendance record added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentId">Student ID *</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="studentName">Student Name *</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="instructorId">Instructor ID *</label>
          <input
            type="text"
            id="instructorId"
            name="instructorId"
            value={formData.instructorId}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Attendance Record'}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm; 