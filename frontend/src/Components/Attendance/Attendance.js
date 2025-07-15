import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AttendanceList from '../AttendanceList/AttendanceList';
import AttendanceSync from '../AttendanceSync/AttendanceSync';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Attendance.css';

function Attendance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState(null);
  const [editedStatuses, setEditedStatuses] = useState({});
  const tableRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchInstructorAttendance();
  }, [user, navigate]);

  useEffect(() => {
    filterAttendanceRecords(searchTerm);
  }, [searchTerm, attendanceRecords]);

  // Get MongoDB ObjectId for instructor
  const getInstructorObjectId = () => {
    return user?.instructorId || '';
  };

  // Format instructor ID in the BO0001 format
  const getFormattedInstructorId = () => {
    if (user && user.instructorId) {
      // Get the instructor type to determine the prefix
      const instructorType = user.instructorType || '';
      const instructorId = user.instructorId.toString();
      
      // Check if instructor ID already has a prefix to avoid duplication
      if (instructorId.startsWith('BO') || instructorId.startsWith('BC') || instructorId.startsWith('HV')) {
        return instructorId;
      } else {
        // Add prefix based on instructor type
        if (instructorType === 'Bike') {
          return `BO${instructorId.padStart(3, '0')}`;
        } else if (instructorType === 'BikeCar') {
          return `BC${instructorId.padStart(3, '0')}`;
        } else if (instructorType === 'HeavyVehicle') {
          return `HV${instructorId.padStart(3, '0')}`;
        } else {
          // Fallback to raw instructor ID if type is unknown
          return instructorId;
        }
      }
    } else {
      // Fallback if no user.instructorId is available
      return user?.id || '';
    }
  };

  const fetchInstructorAttendance = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get both IDs for matching
      const objectId = getInstructorObjectId();
      const formattedId = getFormattedInstructorId();
      
      console.log('Fetching attendance records for instructor with:');
      console.log('- ObjectId:', objectId);
      console.log('- Formatted ID:', formattedId);
      
      // Get all attendance records
      const response = await axios.get('http://localhost:5000/api/attendance');
      
      // Filter records that match either the ObjectId or the formatted ID
      const instructorRecords = response.data.filter(record => 
        record.instructorId === objectId || 
        record.instructorId === formattedId ||
        (record.formattedInstructorId && record.formattedInstructorId === formattedId)
      );
      
      console.log(`Found ${instructorRecords.length} records for this instructor`);
      
      setAttendanceRecords(instructorRecords);
      setFilteredRecords(instructorRecords);
    } catch (err) {
      console.error('Error fetching attendance records:', err);
      setError(err.response?.data?.message || 'Failed to load attendance records');
      if (err.response && err.response.status === 404) {
        setAttendanceRecords([]);
        setFilteredRecords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterAttendanceRecords = (search) => {
    if (!search) {
      setFilteredRecords(attendanceRecords);
      return;
    }
    
    const searchLower = search.toLowerCase();
    const filtered = attendanceRecords.filter(record => 
      (record.studentName && record.studentName.toLowerCase().includes(searchLower)) || 
      (record.studentId && record.studentId.toLowerCase().includes(searchLower))
    );
    
    setFilteredRecords(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilter = async () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    try {
      // Get both IDs for matching
      const objectId = getInstructorObjectId();
      const formattedId = getFormattedInstructorId();
      
      const response = await axios.get(
        `http://localhost:5000/api/attendance/date/${dateFilter.startDate}/${dateFilter.endDate}`
      );
      
      // Filter by instructor ID locally using both ID formats
      const instructorRecords = response.data.filter(record => 
        record.instructorId === objectId || 
        record.instructorId === formattedId ||
        (record.formattedInstructorId && record.formattedInstructorId === formattedId)
      );
      
      setFilteredRecords(instructorRecords);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to filter attendance records');
      console.error('Filter error:', err);
    }
  };

  const handleResetFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
    setSearchTerm('');
    setFilteredRecords(attendanceRecords);
  };

  const handleStatusChange = (id, status) => {
    setEditedStatuses({
      ...editedStatuses,
      [id]: status
    });
  };

  const updateStatus = async (id) => {
    try {
      const newStatus = editedStatuses[id] || filteredRecords.find(record => record._id === id)?.status;
      
      if (!newStatus) {
        alert('No status change detected');
        return false;
      }
      
      // Show confirmation
      const confirmed = window.confirm(`Are you sure you want to update this record's status to "${newStatus}"?`);
      if (!confirmed) return false;
      
      // Update in database
      await axios.put(`http://localhost:5000/api/attendance/${id}`, {
        status: newStatus
      });
      
      // Update local state
      const updatedRecords = attendanceRecords.map(record => 
        record._id === id ? {...record, status: newStatus} : record
      );
      setAttendanceRecords(updatedRecords);
      setFilteredRecords(
        filteredRecords.map(record => 
          record._id === id ? {...record, status: newStatus} : record
        )
      );
      
      // Show success message
      alert('Attendance status updated successfully!');
      
      // Clear the edited status for this record
      const newEditedStatuses = {...editedStatuses};
      delete newEditedStatuses[id];
      setEditedStatuses(newEditedStatuses);
      
      return true;
    } catch (err) {
      console.error('Update error:', err);
      // Show error message
      alert(`Failed to update status: ${err.response?.data?.message || 'Unknown error occurred'}`);
      return false;
    }
  };

  const deleteAttendanceRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return false;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/attendance/${id}`);
      
      // Update local state
      const updatedRecords = attendanceRecords.filter(record => record._id !== id);
      setAttendanceRecords(updatedRecords);
      setFilteredRecords(filteredRecords.filter(record => record._id !== id));
      
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      return false;
    }
  };

  const handleAttendanceSynced = () => {
    fetchInstructorAttendance();
    setActiveTab('list');
  };

  // Handle navigation based on user role
  const getHomeLink = () => {
    if (user && user.role === 'instructor') {
      return '/instructordashboard';
    }
    return '/dashboard';
  };

  // Download attendance report as PDF
  const handlePrintReport = () => {
    if (!tableRef.current || filteredRecords.length === 0) {
      alert('No attendance data to download');
      return;
    }

    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Add title and date
      pdf.setFontSize(18);
      pdf.text('Attendance Report', pdfWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 22, { align: 'center' });

      // Add the table image
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('attendance-report.pdf');
    });
  };

  // Send report via WhatsApp
  const handleSendReport = () => {
    const phoneNumber = "+94766324158"; // Update with the appropriate phone number
    const message = `Attendance Report - ${new Date().toLocaleDateString()}\n${filteredRecords.length} records found.`;
    const whatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsAppUrl, "_blank");
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>
          <span className="icon">📋</span> Attendance Management
        </h1>
        <div className="breadcrumb">
          <Link to={getHomeLink()}>Home</Link> / Attendance
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Attendance Records
        </button>
        <button 
          className={`tab-button ${activeTab === 'sync' ? 'active' : ''}`}
          onClick={() => setActiveTab('sync')}
        >
          Sync from Appointments
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="attendance-content">
          <div className="attendance-filters">
            
            
            <div className="date-filter">
              <div className="date-inputs">
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
                <button className="filter-btn" onClick={handleDateFilter}>Apply Filter</button>
                <button className="reset-btn" onClick={handleResetFilter}>Reset</button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Loading attendance records...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : filteredRecords.length === 0 ? (
            <div className="no-records">
              <p>No attendance records found for your students.</p>
              <p>Use the 'Sync from Appointments' tab to create attendance records from confirmed appointments.</p>
            </div>
          ) : (
            <div>
              <div ref={tableRef} className="table-wrapper">
                <table className="attendance-table">
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
                    {filteredRecords.map(record => (
                      <tr key={record._id}>
                        <td>{record.studentId}</td>
                        <td>{record.studentName}</td>
                        <td>{record.formattedInstructorId || getFormattedInstructorId() || record.instructorId}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <div className="status-editor">
                            <select 
                              value={editedStatuses[record._id] || record.status}
                              onChange={(e) => handleStatusChange(record._id, e.target.value)}
                              className={`status-select ${(editedStatuses[record._id] || record.status).toLowerCase()}`}
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Late">Late</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <button 
                            className="update-btn"
                            onClick={() => updateStatus(record._id)}
                            title="Save status"
                          >
                            Update
                          </button>
                          <button 
                            className="delete-btn" 
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

              <div className="report-actions">
                <button className="download-report-btn" onClick={handlePrintReport}>
                  Download Report
                </button>
                
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="sync-tab">
          <AttendanceSync onSyncComplete={handleAttendanceSynced} />
        </div>
      )}
    </div>
  );
}

export default Attendance;
