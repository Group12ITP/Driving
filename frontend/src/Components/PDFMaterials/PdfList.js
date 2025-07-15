import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './PdfMaterials.css';
import { FaFilePdf, FaDownload, FaTrash, FaSpinner, FaFilter, FaSearch, FaInfoCircle } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000';

const PdfList = ({ type = 'student', filteredInstructor = null, filteredCourse = null, studentInfo = null }) => {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'instructor', 'course'
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(filteredCourse || '');
  const [selectedInstructor, setSelectedInstructor] = useState(filteredInstructor || '');
  const [downloading, setDownloading] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [studentFiltered, setStudentFiltered] = useState(type === 'student' && (filteredCourse || filteredInstructor));

  // Load PDFs based on user type and filters
  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let url = `${API_BASE_URL}/api/pdfs`;
        
        // Apply filters based on type and selected filters
        if (type === 'instructor' && user?.instructorId) {
          // Instructor sees their own uploaded PDFs
          url = `${API_BASE_URL}/api/pdfs/instructor/${user.instructorId}`;
        } else if (type === 'student' && studentInfo) {
          // Student view - first get all PDFs then filter in frontend
          // This allows us to filter by both course AND instructor
          const response = await axios.get(url);
          
          if (response.data.success && response.data.pdfs) {
            // First get all PDFs
            let allPdfs = response.data.pdfs;
            
            // Filter PDFs by student's course and instructor
            const studentPdfs = allPdfs.filter(pdf => {
              const matchesCourse = pdf.courseName === studentInfo.courseName;
              const matchesInstructor = pdf.instructorId === studentInfo.instructorId || 
                                         pdf.instructorName === studentInfo.instructorName;
              
              // PDF must match either the student's course OR instructor
              return matchesCourse || matchesInstructor;
            });
            
            setPdfs(studentPdfs);
            
            // Extract unique courses and instructors for filters from student's PDFs only
            const uniqueCourses = [...new Set(studentPdfs.map(pdf => pdf.courseName))];
            const uniqueInstructors = [...new Set(studentPdfs.map(pdf => pdf.instructorId))];
            
            setCourses(uniqueCourses);
            setInstructors(uniqueInstructors);
            setLoading(false);
            
            if (studentPdfs.length === 0) {
              setError('No materials found for your course and instructor.');
              setStudentFiltered(true);
            } else {
              setStudentFiltered(true);
            }
            
            return;
          }
        } else if (filter === 'instructor' && selectedInstructor) {
          url = `${API_BASE_URL}/api/pdfs/instructor/${selectedInstructor}`;
        } else if (filter === 'course' && selectedCourse) {
          url = `${API_BASE_URL}/api/pdfs/course/${encodeURIComponent(selectedCourse)}`;
        }
        
        const response = await axios.get(url);
        
        if (response.data.success && response.data.pdfs) {
          setPdfs(response.data.pdfs);
          
          // Extract unique courses and instructors for filters
          const uniqueCourses = [...new Set(response.data.pdfs.map(pdf => pdf.courseName))];
          const uniqueInstructors = [...new Set(response.data.pdfs.map(pdf => pdf.instructorId))];
          
          setCourses(uniqueCourses);
          setInstructors(uniqueInstructors);
        } else {
          setPdfs([]);
          setError('No PDF materials found');
        }
      } catch (error) {
        console.error('Error fetching PDFs:', error);
        setError('Failed to load PDF materials. Please try again later.');
        setPdfs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPdfs();
  }, [type, user, filter, selectedCourse, selectedInstructor, filteredCourse, filteredInstructor, studentInfo]);

  // Handle PDF download
  const handleDownload = async (pdfId, fileName) => {
    setDownloading(pdfId);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pdfs/download/${pdfId}`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      
      // Append to html page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download the PDF. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  // Handle PDF deletion (only for instructors)
  const handleDelete = async (pdfId) => {
    if (!window.confirm('Are you sure you want to delete this PDF material?')) {
      return;
    }
    
    setDeleting(pdfId);
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/pdfs/${pdfId}`);
      
      if (response.data.success) {
        // Remove from state
        setPdfs(pdfs.filter(pdf => pdf._id !== pdfId));
      } else {
        alert(response.data.message || 'Failed to delete PDF');
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
      alert('Failed to delete the PDF. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Filter PDFs based on search term
  const filteredPdfs = pdfs.filter(pdf => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      pdf.fileName.toLowerCase().includes(searchTermLower) ||
      pdf.courseName.toLowerCase().includes(searchTermLower) ||
      pdf.instructorName.toLowerCase().includes(searchTermLower) ||
      (pdf.description && pdf.description.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="pdf-list-container">
      <h2 className="pdf-section-title">
        {type === 'instructor' ? 'Manage Course Materials' : 'Course Materials'}
      </h2>
      
      {/* Student view notice - only when materials exist */}
      {type === 'student' && studentInfo && studentFiltered && pdfs.length > 0 && (
        <div className="pdf-student-filter-notice">
          <FaInfoCircle /> Showing materials for your course and instructor.
        </div>
      )}
      
      {/* Filter and search controls - only show if there are materials */}
      {pdfs.length > 0 && (
        <div className="pdf-filters">
          <div className="pdf-search">
            <FaSearch className="pdf-search-icon" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pdf-search-input"
            />
          </div>
          
          {/* Only show filter controls for non-students or if not automatically filtered */}
          {(type !== 'student' || !studentFiltered) && (
            <div className="pdf-filter-controls">
              <div className="pdf-filter-select">
                <label><FaFilter /> Filter by:</label>
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setSelectedCourse('');
                    setSelectedInstructor('');
                  }}
                >
                  <option value="all">All Materials</option>
                  <option value="course">By Course</option>
                  <option value="instructor">By Instructor</option>
                </select>
              </div>
              
              {filter === 'course' && (
                <div className="pdf-filter-select">
                  <label>Course:</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {filter === 'instructor' && (
                <div className="pdf-filter-select">
                  <label>Instructor:</label>
                  <select
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor, index) => (
                      <option key={index} value={instructor}>{instructor}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && !loading && (
        <div className="pdf-error-message">{error}</div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="pdf-loading">
          <FaSpinner className="fa-spin" /> Loading materials...
        </div>
      )}
      
      {/* PDF list */}
      {!loading && filteredPdfs.length > 0 ? (
        <div className="pdf-grid">
          {filteredPdfs.map((pdf) => (
            <div key={pdf._id} className="pdf-card">
              <div className="pdf-icon">
                <FaFilePdf />
              </div>
              <div className="pdf-details">
                <h3 className="pdf-title">{pdf.fileName}</h3>
                <p className="pdf-course">Course: {pdf.courseName}</p>
                <p className="pdf-instructor">By: {pdf.instructorName}</p>
                {pdf.description && (
                  <p className="pdf-description">{pdf.description}</p>
                )}
                <p className="pdf-date">
                  Uploaded: {new Date(pdf.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="pdf-actions">
                <button
                  className="pdf-download-btn"
                  onClick={() => handleDownload(pdf._id, pdf.fileName)}
                  disabled={downloading === pdf._id}
                >
                  {downloading === pdf._id ? (
                    <><FaSpinner className="fa-spin" /> Downloading...</>
                  ) : (
                    <><FaDownload /> Download</>
                  )}
                </button>
                
                {/* Only show delete button for instructor's own PDFs */}
                {type === 'instructor' && user?.instructorId === pdf.instructorId && (
                  <button
                    className="pdf-delete-btn"
                    onClick={() => handleDelete(pdf._id)}
                    disabled={deleting === pdf._id}
                  >
                    {deleting === pdf._id ? (
                      <><FaSpinner className="fa-spin" /> Deleting...</>
                    ) : (
                      <><FaTrash /> Delete</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <div className="pdf-no-results">
            <p>No PDF materials found</p>
          </div>
        )
      )}
    </div>
  );
};

export default PdfList; 