import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './PdfMaterials.css';
import { FaFileUpload, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000';

const PdfUpload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState([
    'Car Driving', 
    'Motorcycle Driving', 
    'Heavy Vehicle Driving', 
    'Traffic Rules', 
    'Defensive Driving'
  ]); // You can fetch this from your API if available

  useEffect(() => {
    // Fetch courses if needed
    // Example: 
    // const fetchCourses = async () => {
    //   try {
    //     const response = await axios.get(`${API_BASE_URL}/Addcourse`);
    //     if (response.data) {
    //       setCourses(response.data.map(course => course.name));
    //     }
    //   } catch (error) {
    //     console.error('Error fetching courses:', error);
    //   }
    // };
    // fetchCourses();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    
    if (!courseName) {
      setError('Please select a course');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const formData = new FormData();
    formData.append('pdfFile', file);
    formData.append('courseName', courseName);
    formData.append('instructorName', user.name);
    formData.append('instructorId', user.instructorId);
    formData.append('description', description);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/pdfs/upload`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFile(null);
        setCourseName('');
        setDescription('');
        // Reset file input
        document.getElementById('pdf-file-input').value = '';
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError(error.response?.data?.message || 'Failed to upload PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-upload-container">
      <h2 className="pdf-section-title">Upload Course Material</h2>
      
      {error && (
        <div className="pdf-error-message">
          <FaTimesCircle /> {error}
        </div>
      )}
      
      {success && (
        <div className="pdf-success-message">
          <FaCheckCircle /> PDF uploaded successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="pdf-upload-form">
        <div className="pdf-form-group">
          <label htmlFor="courseName">Course:</label>
          <select
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Select a course</option>
            {courses.map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </select>
        </div>
        
        <div className="pdf-form-group">
          <label htmlFor="pdf-file-input">PDF File:</label>
          <div className="pdf-file-input-wrapper">
            <input
              type="file"
              id="pdf-file-input"
              accept=".pdf"
              onChange={handleFileChange}
              required
              disabled={loading}
            />
            <div className="pdf-file-details">
              {file && (
                <span className="pdf-file-name">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="pdf-form-group">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for this material"
            disabled={loading}
            rows={3}
          />
        </div>
        
        <button 
          type="submit" 
          className="pdf-upload-button"
          disabled={loading || !file || !courseName}
        >
          {loading ? <FaSpinner className="fa-spin" /> : <FaFileUpload />} {loading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
    </div>
  );
};

export default PdfUpload; 