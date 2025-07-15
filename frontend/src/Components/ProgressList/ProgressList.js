import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ProgressList.css';

// Format instructor ID in case it's not already formatted
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

const ProgressList = () => {
  const [progressRecords, setProgressRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currentProgress, setCurrentProgress] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    loadProgressRecords();
  }, []);

  const loadProgressRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:5000/api/progress');
      setProgressRecords(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load progress records');
      console.error('Error loading progress records:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (record) => {
    setEditingId(record._id);
    setCurrentProgress(record.studentProgress);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCurrentProgress('');
  };

  const updateProgress = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/progress/${id}`, {
        studentProgress: currentProgress
      });
      
      // Update local state
      setProgressRecords(progressRecords.map(record => 
        record._id === id ? {...record, studentProgress: currentProgress} : record
      ));
      
      // Exit edit mode
      setEditingId(null);
    } catch (err) {
      alert('Failed to update progress: ' + (err.response?.data?.message || err.message));
      console.error('Update error:', err);
    }
  };

  // Handle PDF report generation
  const handlePrintReport = () => {
    if (!tableRef.current || progressRecords.length === 0) {
      alert('No progress data to download');
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
      pdf.text('Student Progress Report', pdfWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 22, { align: 'center' });

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('student-progress-report.pdf');
    });
  };

  if (loading) return <div className="prg-loading">Loading progress records...</div>;
  if (error) return <div className="prg-error-message">Error: {error}</div>;
  if (progressRecords.length === 0) return <div className="prg-no-records">No progress records found. Please sync with appointments first.</div>;

  return (
    <div className="prg-container">
      <h2 className="prg-title">Student Progress Records</h2>
      
      <div ref={tableRef} className="prg-table-container">
        <table className="prg-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Instructor ID</th>
              <th>Start Date</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {progressRecords.map(record => (
              <tr key={record._id}>
                <td>{record.name}</td>
                <td>{record.studentId}</td>
                <td>{record.studentName || 'N/A'}</td>
                <td>{record.formattedInstructorId}</td>
                <td>{new Date(record.startDate).toLocaleDateString()}</td>
                <td>
                  {editingId === record._id ? (
                    <select 
                      value={currentProgress}
                      onChange={(e) => setCurrentProgress(e.target.value)}
                      className="prg-progress-select"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Theory Learning">Theory Learning</option>
                      <option value="Theory Test Passed">Theory Test Passed</option>
                      <option value="Practical Training">Practical Training</option>
                      <option value="Ready for License Test">Ready for License Test</option>
                      <option value="Licensed">Licensed</option>
                    </select>
                  ) : (
                    <span className={`prg-progress-badge ${record.studentProgress.toLowerCase().replace(/\s+/g, '-')}`}>
                      {record.studentProgress}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === record._id ? (
                    <div className="prg-action-buttons">
                      <button className="prg-save-btn" onClick={() => updateProgress(record._id)}>Save</button>
                      <button className="prg-cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </div>
                  ) : (
                    <button className="prg-edit-btn" onClick={() => startEdit(record)}>
                      Update Progress
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="prg-report-actions">
        <button className="prg-download-btn" onClick={handlePrintReport}>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ProgressList; 