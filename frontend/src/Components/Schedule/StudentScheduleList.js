import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ScheduleService from '../../services/ScheduleService';
import './StudentScheduleList.css';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaBook, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

function StudentScheduleList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    courseName: '',
    instructorName: '',
    status: '',
  });
  const [studentCourseType, setStudentCourseType] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);

  // Helper function to determine course type
  const getCourseType = (courseName) => {
    if (!courseName) return null;
    
    const courseNameLower = courseName.toLowerCase();
    if (courseNameLower.includes('heavy') || 
        courseNameLower.includes('truck') || 
        courseNameLower.includes('bus')) {
      return 'heavy';
    } else if (courseNameLower.includes('bike') && !courseNameLower.includes('car')) {
      return 'bike';
    } else if (courseNameLower.includes('car') || 
             (courseNameLower.includes('bike') && courseNameLower.includes('car'))) {
      return 'bikecar';
    }
    return null;
  };

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch all schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First get the student's course information
        let studentCourse = null;
        let studentInstructor = null;
        
        // Try to get student course info from user object if available
        if (user && (user.course || user.courseName)) {
          studentCourse = user.course || user.courseName;
          studentInstructor = user.instructorId || user.instructorName;
          console.log('Found course info in user data:', studentCourse, studentInstructor);
        } else {
          // Otherwise fetch from appointments API
          try {
            const studentId = user?._id || user?.studentId;
            console.log('DEBUG: Student ID from user:', studentId);
            console.log('DEBUG: Full user object:', user);
            
            // Try both API endpoints
            let appointmentsResponse;
            try {
              appointmentsResponse = await axios.get(`http://localhost:5000/api/appointments/student/${studentId}`);
            } catch (error) {
              console.log('First appointment endpoint failed, trying alternate endpoint');
              appointmentsResponse = await axios.get(`http://localhost:5000/appointments/student/${studentId}`);
            }
            
            console.log('DEBUG: Appointments response:', appointmentsResponse?.data);
            
            // Process appointment data to find course and instructor
            if (appointmentsResponse.data) {
              let appointments = [];
              if (Array.isArray(appointmentsResponse.data)) {
                appointments = appointmentsResponse.data;
              } else if (appointmentsResponse.data.appointments) {
                appointments = appointmentsResponse.data.appointments;
              } else if (typeof appointmentsResponse.data === 'object') {
                const possibleArrayFields = Object.values(appointmentsResponse.data).filter(Array.isArray);
                if (possibleArrayFields.length > 0) {
                  appointments = possibleArrayFields[0];
                }
              }
              
              console.log('DEBUG: Extracted appointments array:', appointments);
              
              if (appointments && appointments.length > 0) {
                // Get the confirmed or most recent appointment
                const confirmedAppointments = appointments.filter(app => 
                  app.status && app.status.toLowerCase() === 'confirmed'
                );
                
                console.log('DEBUG: Confirmed appointments:', confirmedAppointments);
                
                const appointment = confirmedAppointments.length > 0 
                  ? confirmedAppointments[0] 
                  : appointments[0];
                
                studentCourse = appointment.courseName || appointment.course || appointment.courseTitle;
                studentInstructor = appointment.instructorId || appointment.instructorName;
                console.log('Found course info in appointments:', studentCourse, studentInstructor);

                // Store course info for filtering
                setCourseInfo({
                  courseName: studentCourse || 'Unknown Course',
                  instructorName: appointment.instructorName || 'Unknown Instructor',
                  instructorId: appointment.instructorId
                });
              }
            }
          } catch (err) {
            console.error('Error fetching student appointment data:', err);
          }
        }
        
        // Determine course type
        if (studentCourse) {
          const courseType = getCourseType(studentCourse);
          setStudentCourseType(courseType);
          console.log('Detected student course type:', courseType);
          
          if (!courseInfo) {
            setCourseInfo({
              courseName: studentCourse || 'Unknown Course',
              instructorName: studentInstructor || 'Unknown Instructor',
              instructorId: studentInstructor
            });
          }
        }
        
        // Get all schedules
        const data = await ScheduleService.getAllSchedules();
        console.log('DEBUG: All schedules from API:', data);
        
        setSchedules(data);
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Failed to load schedules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'student') {
      fetchSchedules();
    }
  }, [user]);

  // Filter schedules when search term or filters change
  useEffect(() => {
    if (!schedules || schedules.length === 0) return;

    const filtered = schedules.filter(schedule => {
      // Check if schedule matches search term
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = !searchTerm || 
        schedule.lessonTitle.toLowerCase().includes(searchTermLower) ||
        schedule.courseName.toLowerCase().includes(searchTermLower) ||
        schedule.instructorName.toLowerCase().includes(searchTermLower) ||
        schedule.location.toLowerCase().includes(searchTermLower);
      
      // Check if schedule matches filters
      const matchesCourseName = !filters.courseName || schedule.courseName === filters.courseName;
      const matchesInstructorName = !filters.instructorName || schedule.instructorName === filters.instructorName;
      const matchesStatus = !filters.status || schedule.status === filters.status;
      
      // Check if schedule matches student's course type
      const scheduleCourseType = getCourseType(schedule.courseName);
      const matchesCourseType = !studentCourseType || scheduleCourseType === studentCourseType;
      
      console.log(`Schedule ${schedule._id} - Course: ${schedule.courseName}, Type: ${scheduleCourseType}, Matches student type (${studentCourseType}): ${matchesCourseType}`);
      
      return matchesSearchTerm && matchesCourseName && matchesInstructorName && matchesStatus && matchesCourseType;
    });
    
    console.log(`Filtered ${schedules.length} schedules down to ${filtered.length} matching schedules`);
    setFilteredSchedules(filtered);
  }, [searchTerm, filters, schedules, studentCourseType]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  // Get unique values for filters
  const getUniqueFilterValues = (field) => {
    if (!schedules) return [];
    return ['', ...new Set(schedules.map(schedule => schedule[field]))];
  };

  // View schedule details
  const handleViewDetails = (scheduleId) => {
    navigate(`/schedule/student/${scheduleId}`);
  };

  return (
    <div className="student-schedule-list__container">
      <div className="student-schedule-list__header">
        <h1 className="student-schedule-list__title">
          Course Lessons {courseInfo?.courseName ? `for ${courseInfo?.courseName}` : ''}
        </h1>
        <div className="student-schedule-list__search">
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="student-schedule-list__search-input"
          />
        </div>
      </div>

      <div className="student-schedule-list__filters">
        <div className="student-schedule-list__filter">
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <div className="student-schedule-list__error">{error}</div>}

      {loading ? (
        <div className="student-schedule-list__loading">Loading schedules...</div>
      ) : filteredSchedules.length > 0 ? (
        <div className="student-schedule-list__grid">
          {filteredSchedules.map((schedule) => (
            <div key={schedule._id} className="student-schedule-list__card">
              <div className={`student-schedule-list__card-header student-schedule-list__card-header--${schedule.status}`}>
                <h3 className="student-schedule-list__card-title">{schedule.lessonTitle}</h3>
                <span className="student-schedule-list__card-status">
                  {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                </span>
              </div>
              
              <div className="student-schedule-list__card-content">
                <div className="student-schedule-list__card-info">
                  <span className="student-schedule-list__card-icon"><FaBook /></span>
                  <span className="student-schedule-list__card-text">{schedule.courseName}</span>
                </div>
                
                <div className="student-schedule-list__card-info">
                  <span className="student-schedule-list__card-icon"><FaUser /></span>
                  <span className="student-schedule-list__card-text">{schedule.instructorName}</span>
                </div>
                
                <div className="student-schedule-list__card-info">
                  <span className="student-schedule-list__card-icon"><FaCalendarAlt /></span>
                  <span className="student-schedule-list__card-text">{formatDate(schedule.date)}</span>
                </div>
                
                <div className="student-schedule-list__card-info">
                  <span className="student-schedule-list__card-icon"><FaClock /></span>
                  <span className="student-schedule-list__card-text">{schedule.startTime} - {schedule.endTime}</span>
                </div>
                
                <div className="student-schedule-list__card-info">
                  <span className="student-schedule-list__card-icon"><FaMapMarkerAlt /></span>
                  <span className="student-schedule-list__card-text">{schedule.location}</span>
                </div>
                
                <div className="student-schedule-list__card-seats">
                  <span className="student-schedule-list__card-text">
                    Seats: {schedule.enrolledStudents} / {schedule.maxStudents}
                    {schedule.enrolledStudents >= schedule.maxStudents && (
                      <span className="student-schedule-list__card-full"> (Full)</span>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="student-schedule-list__card-footer">
                <button
                  className="student-schedule-list__card-button"
                  onClick={() => handleViewDetails(schedule._id)}
                >
                  <FaInfoCircle /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="student-schedule-list__empty">
          <p>No schedules found matching your criteria.</p>
          {studentCourseType && (
            <p>You are enrolled in a {studentCourseType === 'heavy' ? 'heavy vehicle' : 
                                     studentCourseType === 'bike' ? 'bike' : 
                                     studentCourseType === 'bikecar' ? 'car/bike' : 'unknown'} course.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentScheduleList; 