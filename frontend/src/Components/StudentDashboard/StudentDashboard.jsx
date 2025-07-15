import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './StudentDashboard.css';
import { FaGraduationCap, FaUserTie, FaCalendarCheck, FaCreditCard, FaExclamationTriangle, FaClock, FaFileAlt, FaDownload, FaArrowRight } from 'react-icons/fa';
import StudentNavbar from './StudentNavbar';
import Nav from '../Nav/Nav2'
import { Link } from 'react-router-dom';
import ScheduleService from '../../services/ScheduleService';
import DebugInfo from './DebugInfo';
import AvailableSchedules from './AvailableSchedules';

// Set base URL for API requests
const API_BASE_URL = 'http://localhost:5000';

// Helper function to format instructor ID
const formatInstructorId = (id, courseType = '') => {
  if (!id) return 'N/A';
  
  // Check if already formatted (starts with letters)
  if (typeof id === 'string' && /^[A-Z]{2}\d+$/.test(id)) {
    return id;
  }
  
  // Convert to string and pad with zeros
  const numericId = String(id).replace(/\D/g, '');
  const paddedId = numericId.padStart(4, '0');
  
  // Add prefix based on course type
  const courseLower = courseType.toLowerCase();
  if (courseLower.includes('bike') && !courseLower.includes('car')) {
    return `BO${paddedId}`;
  } else if (courseLower.includes('bike') && courseLower.includes('car')) {
    return `BC${paddedId}`;
  } else if (courseLower.includes('heavy')) {
    return `HV${paddedId}`;
  } else {
    return `IN${paddedId}`; // Default prefix for other types
  }
};

// Helper function to calculate progress percentage
const calculateProgressPercentage = (progressStatus) => {
  if (!progressStatus) return 0;
  
  const status = String(progressStatus).toLowerCase();
  
  // Match the exact status values used in the Progress component
  if (status.includes('not started')) return 0;
  if (status.includes('theory learning')) return 20;
  if (status.includes('theory test passed')) return 40;
  if (status.includes('practical training')) return 60;
  if (status.includes('ready for license test')) return 80;
  if (status.includes('licensed') || status.includes('completed')) return 100;
  
  // Try to extract a number if it's a percentage
  const percentMatch = status.match(/(\d+)%/);
  if (percentMatch && percentMatch[1]) {
    return parseInt(percentMatch[1], 10);
  }
  
  // If it's just a number
  if (!isNaN(status)) {
    const num = parseInt(status, 10);
    return num > 100 ? 100 : num < 0 ? 0 : num; // Ensure percentage is between 0-100
  }
  
  // Default fallback - treat any non-empty status as at least started
  return status ? 20 : 0;
};

// Add a helper function to determine progress bar color based on status
const getProgressBarColor = (status) => {
  if (!status) return '#95a5a6'; // Default gray
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('not started')) return '#e74c3c'; // Red
  if (statusLower.includes('theory learning')) return '#f39c12'; // Orange
  if (statusLower.includes('theory test passed')) return '#2ecc71'; // Green
  if (statusLower.includes('practical training')) return '#3498db'; // Blue
  if (statusLower.includes('ready for license test')) return '#9b59b6'; // Purple
  if (statusLower.includes('licensed') || statusLower.includes('completed')) return '#1abc9c'; // Teal
  
  // Default color
  return '#95a5a6'; // Gray
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Not Started');
  const [apiErrors, setApiErrors] = useState({});
  const [rawAppointmentData, setRawAppointmentData] = useState(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(true);

  useEffect(() => {
    // Log user info from localStorage for debugging
    try {
      const storedUser = localStorage.getItem('user');
      const lastLoggedInUser = localStorage.getItem('lastLoggedInUser');
      console.log('Stored user in localStorage:', storedUser ? JSON.parse(storedUser) : 'None');
      console.log('Last logged in user:', lastLoggedInUser ? JSON.parse(lastLoggedInUser) : 'None');
    } catch (e) {
      console.error('Error parsing localStorage data:', e);
    }
    
    const fetchStudentData = async () => {
      // Check for either _id or studentId property
      const studentId = user?._id || user?.studentId;
      
      if (!studentId) {
        setError('Please log in to view your dashboard. No student ID found.');
        setLoading(false);
        return;
      }

      try {
        console.log('Current user:', user); // Debug log
        console.log('Using student ID:', studentId); // Debug log
        
        const newApiErrors = {};
        let tempProgressData = null; // Declare at the top-level scope for the function
        
        // Fetch student appointments (for course and instructor info)
        try {
          console.log(`Fetching appointments from: ${API_BASE_URL}/api/appointments/student/${studentId}`);
          
          // First try using the /api prefix
          let appointmentsResponse;
          try {
            appointmentsResponse = await axios.get(`${API_BASE_URL}/api/appointments/student/${studentId}`);
          } catch (error) {
            console.log('First appointment endpoint failed, trying alternate endpoint');
            // If that fails, try without the /api prefix
            appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments/student/${studentId}`);
          }
          
          console.log('Appointments response structure:', JSON.stringify(appointmentsResponse.data)); // Debug full structure
          
          // Save raw appointment data for debugging
          setRawAppointmentData(appointmentsResponse.data);
          
          // Handle different response structures
          let appointments = [];
          if (Array.isArray(appointmentsResponse.data)) {
            appointments = appointmentsResponse.data;
          } else if (appointmentsResponse.data && appointmentsResponse.data.appointments) {
            appointments = appointmentsResponse.data.appointments;
          } else if (appointmentsResponse.data && typeof appointmentsResponse.data === 'object') {
            // Try to extract appointments from another field
            const possibleArrayFields = Object.values(appointmentsResponse.data).filter(Array.isArray);
            if (possibleArrayFields.length > 0) {
              appointments = possibleArrayFields[0];
            }
          }
          
          console.log('Extracted appointments array:', appointments);
          
          if (appointments && appointments.length > 0) {
            // Map all fields we might need to handle different naming conventions
            const mappedAppointments = appointments.map(app => ({
              status: app.status || app.appointmentStatus,
              date: app.date || app.appointmentDate,
              courseName: app.courseName || app.course || app.courseTitle || app.courseDetails?.name || app.courseId,
              instructorName: app.instructorName || app.instructor || app.instructorDetails?.name || app.instructorId,
              instructorId: app.instructorId || app.instructor_id,
              formattedInstructorId: app.formattedInstructorId || app.formatted_instructor_id,
              rawData: app // Store the raw data for debugging
            }));
            
            console.log('Mapped appointments:', mappedAppointments);
            
            const confirmedAppointments = mappedAppointments.filter(app => 
              app.status && app.status.toLowerCase() === 'confirmed'
            );
            console.log('Confirmed appointments:', confirmedAppointments);
            
            if (confirmedAppointments.length > 0) {
              const latestAppointment = confirmedAppointments.sort((a, b) => 
                new Date(b.date || 0) - new Date(a.date || 0)
              )[0];
              
              console.log('Latest confirmed appointment:', latestAppointment);
              console.log('Course name:', latestAppointment.courseName);
              console.log('Instructor name:', latestAppointment.instructorName);
              
              // Format instructor ID
              const formattedId = latestAppointment.formattedInstructorId || 
                                  formatInstructorId(latestAppointment.instructorId, latestAppointment.courseName);
              
              console.log('Formatted instructor ID:', formattedId);
              
              setCourseInfo({
                courseName: latestAppointment.courseName || 'Unknown Course',
                instructorName: latestAppointment.instructorName || 'Unknown Instructor',
                instructorId: formattedId,
                appointmentData: latestAppointment // Store full appointment data for debugging
              });
            } else {
              console.log('No confirmed appointments found, using the most recent appointment instead');
              // If no confirmed appointments, just use the latest appointment
              const latestAppointment = mappedAppointments.sort((a, b) => 
                new Date(b.date || 0) - new Date(a.date || 0)
              )[0];
              
              console.log('Latest appointment (any status):', latestAppointment);
              console.log('Course name:', latestAppointment.courseName);
              console.log('Instructor name:', latestAppointment.instructorName);
              
              // Format instructor ID
              const formattedId = latestAppointment.formattedInstructorId || 
                                  formatInstructorId(latestAppointment.instructorId, latestAppointment.courseName);
              
              console.log('Formatted instructor ID:', formattedId);
              
              setCourseInfo({
                courseName: latestAppointment.courseName || 'Unknown Course',
                instructorName: latestAppointment.instructorName || 'Unknown Instructor',
                instructorId: formattedId,
                appointmentData: latestAppointment // Store full appointment data for debugging
              });
            }
          } else {
            newApiErrors.appointments = "No appointments found";
            console.log('No appointments found for student ID:', studentId);
          }
        } catch (err) {
          console.error("Error fetching appointments:", err);
          newApiErrors.appointments = `Error: ${err.message}`;
        }

        // Fetch attendance records
        try {
          console.log(`Fetching attendance from: ${API_BASE_URL}/api/attendance/student/${studentId}`);
          
          // First try using the /api prefix
          let attendanceResponse;
          try {
            attendanceResponse = await axios.get(`${API_BASE_URL}/api/attendance/student/${studentId}`);
          } catch (error) {
            console.log('First attendance endpoint failed, trying alternate endpoint');
            // If that fails, try without the /api prefix
            attendanceResponse = await axios.get(`${API_BASE_URL}/attendance/student/${studentId}`);
          }
          
          console.log('Attendance response:', attendanceResponse.data); // Debug log
          
          if (attendanceResponse.data && attendanceResponse.data.length > 0) {
            setAttendanceCount(attendanceResponse.data.length);
          } else {
            newApiErrors.attendance = "No attendance records found";
          }
        } catch (err) {
          console.error("Error fetching attendance:", err);
          newApiErrors.attendance = `Error: ${err.message}`;
        }

        // Fetch payment status
        try {
          console.log(`Fetching payments from: ${API_BASE_URL}/payments/student/${studentId}`);
          const paymentsResponse = await axios.get(`${API_BASE_URL}/payments/student/${studentId}`);
          console.log('Payments response:', paymentsResponse.data); // Debug log
          
          if (paymentsResponse.data && paymentsResponse.data.payments && paymentsResponse.data.payments.length > 0) {
            // Get latest payment by date
            const latestPayment = paymentsResponse.data.payments
              .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0];
            
            console.log('Latest payment:', latestPayment);
            setPaymentStatus(latestPayment.status || 'Pending');
          } else {
            console.log('No payment records found in response. Response structure:', paymentsResponse.data);
            newApiErrors.payments = "No payment records found";
          }
        } catch (err) {
          console.error("Error fetching payments:", err);
          newApiErrors.payments = `Error: ${err.message}`;
        }

        // Fetch progress data - try multiple different endpoints and formats
        try {
          console.log(`Fetching progress from: ${API_BASE_URL}/api/progress/student/${studentId}`);
          
          // Try different endpoints to get progress data
          let progressResponse;
          
          // Attempt 1: /api/progress/student/{id}
          try {
            progressResponse = await axios.get(`${API_BASE_URL}/api/progress/student/${studentId}`);
            console.log('Progress response from /api/progress/student:', progressResponse.data);
            if (progressResponse.data && 
               (Array.isArray(progressResponse.data) ? progressResponse.data.length > 0 : Object.keys(progressResponse.data).length > 0)) {
              tempProgressData = progressResponse.data;
            }
          } catch (error) {
            console.log('First progress endpoint failed:', error.message);
          }
          
          // Attempt 2: /progress/student/{id}
          if (!tempProgressData) {
            try {
              progressResponse = await axios.get(`${API_BASE_URL}/progress/student/${studentId}`);
              console.log('Progress response from /progress/student:', progressResponse.data);
              if (progressResponse.data && 
                 (Array.isArray(progressResponse.data) ? progressResponse.data.length > 0 : Object.keys(progressResponse.data).length > 0)) {
                tempProgressData = progressResponse.data;
              }
            } catch (error) {
              console.log('Second progress endpoint failed:', error.message);
            }
          }
          
          // Attempt 3: /api/progress
          if (!tempProgressData) {
            try {
              progressResponse = await axios.get(`${API_BASE_URL}/api/progress`);
              console.log('Progress response from /api/progress:', progressResponse.data);
              
              // Filter for this student's data
              if (Array.isArray(progressResponse.data)) {
                const studentProgress = progressResponse.data.filter(p => 
                  p.studentId === studentId || String(p.studentId) === String(studentId)
                );
                if (studentProgress.length > 0) {
                  tempProgressData = studentProgress;
                }
              }
            } catch (error) {
              console.log('Third progress endpoint failed:', error.message);
            }
          }
          
          // Attempt 4: /progress
          if (!tempProgressData) {
            try {
              progressResponse = await axios.get(`${API_BASE_URL}/progress`);
              console.log('Progress response from /progress:', progressResponse.data);
              
              // Filter for this student's data
              if (Array.isArray(progressResponse.data)) {
                const studentProgress = progressResponse.data.filter(p => 
                  p.studentId === studentId || String(p.studentId) === String(studentId)
                );
                if (studentProgress.length > 0) {
                  tempProgressData = studentProgress;
                }
              }
            } catch (error) {
              console.log('Fourth progress endpoint failed:', error.message);
            }
          }
          
          console.log('Final progress data:', tempProgressData);
          
          if (tempProgressData) {
            // Process the progress data
            let progressItems = Array.isArray(tempProgressData) ? tempProgressData : [tempProgressData];
            
            if (progressItems.length > 0) {
              // Sort progress items by date (if available) or use the first one
              const latestProgress = progressItems.sort((a, b) => {
                const dateA = a.updatedAt || a.createdAt || a.date || 0;
                const dateB = b.updatedAt || b.createdAt || b.date || 0;
                return new Date(dateB) - new Date(dateA);
              })[0];
              
              console.log('Latest progress item:', latestProgress);
              
              // Find the progress status field
              const status = latestProgress.studentProgress || 
                             latestProgress.progress || 
                             latestProgress.status || 
                             latestProgress.progressStatus ||
                             'Not Started';
              
              console.log('Progress status:', status);
              setProgressStatus(status);
              
              // Calculate percentage
              const percentage = calculateProgressPercentage(status);
              console.log('Calculated progress percentage:', percentage);
              setProgress(percentage);
              
              // If progress percentage is 0 but we have a status, set a minimum value
              if (percentage === 0 && status && status.toLowerCase() !== 'not started') {
                setProgress(10); // Set a minimum progress indicator if there's any status
              }
            } else {
              newApiErrors.progress = "No progress records found for this student";
              setProgressStatus('Not Started');
              setProgress(0);
            }
          } else {
            newApiErrors.progress = "No progress data available";
            setProgressStatus('Not Started');
            setProgress(0);
          }
        } catch (err) {
          console.error("Error fetching progress:", err);
          newApiErrors.progress = `Error: ${err.message}`;
          setProgressStatus('Not Started');
          setProgress(0);
        }

        // Original set default progress values if no data was found
        if (!tempProgressData && !newApiErrors.progress) {
          setProgressStatus('Not Started');
          setProgress(0);
        }

        setApiErrors(newApiErrors);
        setLoading(false);
      } catch (err) {
        console.error("Global error fetching student data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  // Fetch upcoming schedules for student's course
  useEffect(() => {
    const fetchUpcomingSchedules = async () => {
      if (!courseInfo || !courseInfo.courseName) {
        console.log('DEBUG: No course info available, skipping schedule fetch');
        return;
      }
      
      try {
        setSchedulesLoading(true);
        console.log('DEBUG: Fetching schedules with course info:', courseInfo);
        
        // Get all schedules
        const allSchedules = await ScheduleService.getAllSchedules();
        console.log('DEBUG: All schedules from API:', allSchedules);
        
        // TEMPORARY: Show all schedules for testing
        console.log('DEBUG - TESTING: Showing all schedules for debugging');
        
        // Sort by date (newest first)
        allSchedules.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Show the most recent 5 schedules
        setUpcomingSchedules(allSchedules.slice(0, 5));
        
        // Original filtering code below - commented out for testing
        /*
        // Filter schedules for student's course and instructor, including all (past and future)
        const matchingSchedules = allSchedules.filter(schedule => {
          // Check if schedule is for the student's course
          const matchesCourse = schedule.courseName === courseInfo.courseName;
          
          // Check if schedule is for the student's instructor
          const matchesInstructor = 
            // Match by ID (numeric or string comparison)
            (schedule.instructorId && courseInfo.instructorId && 
             String(schedule.instructorId).includes(String(courseInfo.instructorId))) ||
            // Match by name
            (schedule.instructorName && courseInfo.instructorName && 
             schedule.instructorName.toLowerCase() === courseInfo.instructorName.toLowerCase());
          
          // Include any status except cancelled
          const isNotCancelled = schedule.status !== 'cancelled';
          
          // Debug individual schedule match
          console.log(`DEBUG: Schedule ${schedule._id} matching:`, {
            scheduleCourse: schedule.courseName,
            studentCourse: courseInfo.courseName,
            matchesCourse,
            scheduleInstructor: schedule.instructorId || schedule.instructorName,
            studentInstructor: courseInfo.instructorId || courseInfo.instructorName,
            matchesInstructor,
            status: schedule.status,
            isNotCancelled,
            overallMatch: matchesCourse && matchesInstructor && isNotCancelled
          });
          
          // Must match both course AND instructor AND not be cancelled
          return matchesCourse && matchesInstructor && isNotCancelled;
        });
        
        console.log('DEBUG: Matched schedules count:', matchingSchedules.length);
        
        // Sort by date (nearest future first, then most recent past)
        const now = new Date();
        matchingSchedules.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          // If both dates are in the future or both in the past, sort normally
          if ((dateA >= now && dateB >= now) || (dateA < now && dateB < now)) {
            return dateA - dateB;
          }
          
          // If one is in the future and one in the past, future comes first
          return dateA >= now ? -1 : 1;
        });
        
        console.log('DEBUG: All matched schedules after filtering:', matchingSchedules);
        
        // Take only the next few schedules to display
        setUpcomingSchedules(matchingSchedules.slice(0, 3));
        */
      } catch (err) {
        console.error('Error fetching schedules:', err);
      } finally {
        setSchedulesLoading(false);
      }
    };

    fetchUpcomingSchedules();
  }, [courseInfo]);

  // Format date for display
  const formatScheduleDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="student-dashboard-layout">
      <Nav />
      
      
      <div className="student-dashboard-container">
        <div className="student-dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome back, {user?.name || 'Student'}</p>
        </div>

        <DebugInfo user={user} courseInfo={courseInfo} />

        {Object.keys(apiErrors).length > 0 && (
          <div className="student-api-errors-container">
            <h3>Some data could not be loaded:</h3>
            <ul>
              {Object.entries(apiErrors).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="student-dashboard-stats-wrapper">
          <div className="student-dashboard-stats">
            <div className="student-stat-card student-orange">
              <div className="student-stat-icon">
                <FaGraduationCap />
              </div>
              <div className="student-stat-details">
                <h2>{courseInfo?.courseName || 'No Course'}</h2>
                <p>Current Course</p>
              </div>
              <div className="student-stat-count">{courseInfo ? '1' : '0'}</div>
            </div>

            <div className="student-stat-card student-blue">
              <div className="student-stat-icon">
                <FaUserTie />
              </div>
              <div className="student-stat-details">
                <h2>{courseInfo?.instructorName || 'Not Assigned'}</h2>
                <p>Instructor</p>
              </div>
              <div className="student-stat-count">ID: {courseInfo?.instructorId}</div>
            </div>

            <div className="student-stat-card student-green">
              <div className="student-stat-icon">
                <FaCalendarCheck />
              </div>
              <div className="student-stat-details">
                <h2>{attendanceCount}</h2>
                <p>Classes Attended</p>
              </div>
              <div className="student-stat-count">{attendanceCount > 0 ? 'Present' : 'No classes'}</div>
            </div>

            <div className="student-stat-card student-red">
              <div className="student-stat-icon">
                <FaCreditCard />
              </div>
              <div className="student-stat-details">
                <h2>{paymentStatus}</h2>
                <p>Payment</p>
              </div>
              <div className={`student-stat-count ${paymentStatus === 'Paid' || paymentStatus === 'Completed' ? 'student-paid' : 'student-pending'}`}>
                {paymentStatus === 'Paid' || paymentStatus === 'Completed' ? 'Completed' : 'Action Required'}
              </div>
            </div>
          </div>

          {/* Course Materials Section */}
          <div className="student-progress-section student-course-materials-section">
            <div className="student-progress-header">
              <h3><FaFileAlt className="student-section-icon" /> Course Materials</h3>
              <Link to="/materials" className="student-view-all-link">View All</Link>
            </div>
            <div className="student-course-materials-content">
              <p>Access PDF materials uploaded by your instructor for your course.</p>
              <div className="student-course-materials-info">
                {courseInfo ? (
                  <>
                    <p>
                      <strong>Course:</strong> {courseInfo.courseName} • 
                      <strong> Instructor:</strong> {courseInfo.instructorName}
                    </p>
                    <Link to="/materials" className="student-materials-button">
                      <FaDownload /> View Materials <FaArrowRight />
                    </Link>
                  </>
                ) : (
                  <p className="student-no-materials-info">
                    Once you're enrolled in a course, you'll have access to course materials here.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="student-progress-section">
            <div className="student-progress-header">
              <h3>Course Progress</h3>
              <span className="student-progress-percentage">{progress}%</span>
            </div>
            <div className="student-progress-bar-container">
              <div 
                className="student-progress-bar" 
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: getProgressBarColor(progressStatus)
                }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="student-progress-status">
              {progressStatus}
            </div>
          </div>
          <div className="student-progress-legend">
            <h3>Progress Legend</h3>
            <div className="student-legend-items">
              <div className="student-legend-item">
                <span className="student-legend-color" style={{ backgroundColor: '#e74c3c' }}></span>
                <span>Not Started</span>
              </div>
              <div className="student-legend-item">
                <span className="student-legend-color" style={{ backgroundColor: '#f39c12' }}></span>
                <span>Theory Learning</span>
              </div>
              <div className="student-legend-item">
                <span className="student-legend-color" style={{ backgroundColor: '#2ecc71' }}></span>
                <span>Theory Test Passed</span>
              </div>
              <div className="student-legend-item">
                <span className="student-legend-color" style={{ backgroundColor: '#3498db' }}></span>
                <span>Practical Training</span>
              </div>
              <div className="student-legend-item">
                <span className="student-legend-color" style={{ backgroundColor: '#9b59b6' }}></span>
                <span>Ready for License Test</span>
              </div>
              <div className="student-legend-item">
                <span className="student-legend-color" style={{ backgroundColor: '#1abc9c' }}></span>
                <span>Licensed</span>
              </div>
            </div>
          </div>
          
          {/* Alternative Schedules Display */}
          <AvailableSchedules user={user} courseInfo={courseInfo} />
          
          {/* Upcoming Schedules Section */}
          <div className="student-progress-section">
            <div className="student-progress-header">
              <h3>Course Lessons</h3>
              <Link to="/schedules/student" className="student-view-all-link">View All</Link>
            </div>
            {schedulesLoading ? (
              <div className="student-schedules-loading">Loading lessons...</div>
            ) : upcomingSchedules.length > 0 ? (
              <div className="student-upcoming-schedules">
                <div className="student-course-instructor-info">
                  <p>
                    <strong>Course:</strong> {courseInfo?.courseName || 'N/A'} • 
                    <strong> Instructor:</strong> {courseInfo?.instructorName || 'N/A'}
                  </p>
                </div>
                {upcomingSchedules.map((schedule) => (
                  <div key={schedule._id} className="student-upcoming-schedule-item">
                    <div className="student-upcoming-schedule-date">
                      <FaCalendarCheck className="student-upcoming-schedule-icon" />
                      <span>{formatScheduleDate(schedule.date)}</span>
                    </div>
                    <div className="student-upcoming-schedule-info">
                      <h4>{schedule.lessonTitle}</h4>
                      <div className="student-upcoming-schedule-details">
                        <span className="student-upcoming-schedule-time">
                          <FaClock className="student-upcoming-schedule-icon-small" />
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                        <span className="student-upcoming-schedule-location">
                          Location: {schedule.location}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to={`/schedule/student/${schedule._id}`} 
                      className="student-upcoming-schedule-button"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
                
                <div className="student-upcoming-schedules-footer">
                  <Link to="/schedules/student" className="student-view-all-button">
                    View All Available Lessons
                  </Link>
                </div>
              </div>
            ) : (
              <div className="student-no-schedules">
                <p>No lessons found for your current course and instructor.</p>
                <Link to="/schedules/student" className="student-view-all-button">
                  Browse All Available Lessons
                </Link>
              </div>
            )}
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 