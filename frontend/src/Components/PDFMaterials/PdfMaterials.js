import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import PdfUpload from './PdfUpload';
import PdfList from './PdfList';
import './PdfMaterials.css';
import { FaFileAlt, FaInfoCircle } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000';

const PdfMaterials = () => {
  const { user } = useAuth();
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Determine if user is instructor or student
  const isInstructor = user?.role === 'instructor';
  
  // Fetch student course info for filtering
  useEffect(() => {
    const fetchStudentData = async () => {
      if (isInstructor || !user) {
        setLoading(false);
        return;
      }
      
      // For students, fetch course and instructor info
      try {
        const studentId = user._id || user.studentId;
        
        if (!studentId) {
          setLoading(false);
          return;
        }
        
        // Try to fetch student's appointment info to get course and instructor
        let appointmentsResponse;
        try {
          appointmentsResponse = await axios.get(`${API_BASE_URL}/api/appointments/student/${studentId}`);
        } catch (error) {
          console.log('First appointment endpoint failed, trying alternate endpoint');
          appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments/student/${studentId}`);
        }
        
        // Handle different response structures
        let appointments = [];
        if (Array.isArray(appointmentsResponse.data)) {
          appointments = appointmentsResponse.data;
        } else if (appointmentsResponse.data && appointmentsResponse.data.appointments) {
          appointments = appointmentsResponse.data.appointments;
        } else if (appointmentsResponse.data && typeof appointmentsResponse.data === 'object') {
          const possibleArrayFields = Object.values(appointmentsResponse.data).filter(Array.isArray);
          if (possibleArrayFields.length > 0) {
            appointments = possibleArrayFields[0];
          }
        }
        
        if (appointments && appointments.length > 0) {
          // Map appointments data
          const mappedAppointments = appointments.map(app => ({
            status: app.status || app.appointmentStatus,
            date: app.date || app.appointmentDate,
            courseName: app.courseName || app.course || app.courseTitle || app.courseDetails?.name || app.courseId,
            instructorName: app.instructorName || app.instructor || app.instructorDetails?.name || app.instructorId,
            instructorId: app.instructorId || app.instructor_id,
          }));
          
          // Get confirmed appointments
          const confirmedAppointments = mappedAppointments.filter(app => 
            app.status && app.status.toLowerCase() === 'confirmed'
          );
          
          if (confirmedAppointments.length > 0) {
            // Get latest confirmed appointment
            const latestAppointment = confirmedAppointments.sort((a, b) => 
              new Date(b.date || 0) - new Date(a.date || 0)
            )[0];
            
            setCourseInfo({
              courseName: latestAppointment.courseName || 'Unknown Course',
              instructorName: latestAppointment.instructorName || 'Unknown Instructor',
              instructorId: latestAppointment.instructorId
            });
          } else if (mappedAppointments.length > 0) {
            // Use the latest appointment if no confirmed ones found
            const latestAppointment = mappedAppointments.sort((a, b) => 
              new Date(b.date || 0) - new Date(a.date || 0)
            )[0];
            
            setCourseInfo({
              courseName: latestAppointment.courseName || 'Unknown Course',
              instructorName: latestAppointment.instructorName || 'Unknown Instructor',
              instructorId: latestAppointment.instructorId
            });
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [user, isInstructor]);
  
  return (
    <div className="pdf-materials-container">
      <div className="pdf-materials-header">
        <FaFileAlt className="pdf-header-icon" />
        <h1 className="pdf-materials-title">Course Materials</h1>
      </div>
      
      {courseInfo && !isInstructor && (
        <div className="course-info-banner">
          <div className="course-info-icon">
            <FaInfoCircle />
          </div>
          <div className="course-info-content">
            <p>
              <strong>Your Course:</strong> {courseInfo.courseName} • 
              <strong> Instructor:</strong> {courseInfo.instructorName}
            </p>
            <p className="course-info-note">
              You will only see materials related to your enrolled course and assigned instructor.
            </p>
          </div>
        </div>
      )}
      
      <div className="pdf-materials-content">
        {/* Only instructors can upload PDFs */}
        {isInstructor && (
          <div className="pdf-upload-section">
            <PdfUpload />
          </div>
        )}
        
        {/* Both instructors and students can view PDFs */}
        <div className="pdf-list-section">
          {loading ? (
            <div className="pdf-loading">Loading your course information...</div>
          ) : (
            <PdfList 
              type={isInstructor ? 'instructor' : 'student'} 
              filteredCourse={!isInstructor ? courseInfo?.courseName : undefined}
              filteredInstructor={!isInstructor ? courseInfo?.instructorId : undefined}
              studentInfo={!isInstructor ? courseInfo : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfMaterials; 