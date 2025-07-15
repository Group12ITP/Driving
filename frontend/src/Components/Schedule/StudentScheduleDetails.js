import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ScheduleService from '../../services/ScheduleService';
import './StudentScheduleDetails.css';
import axios from 'axios';

function StudentScheduleDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching schedule with ID:', id);
        const data = await ScheduleService.getScheduleById(id);
        console.log('Schedule data received:', data);
        setSchedule(data);
        
        // Check if this student is enrolled in this course
        checkEnrollmentStatus(data);
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Failed to load schedule. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id, user]);

  // Check if student is enrolled in this course
  const checkEnrollmentStatus = async (scheduleData) => {
    if (!scheduleData || !user || !user._id) return;
    
    try {
      const studentId = user._id || user.studentId;
      
      // First check if student's course and instructor match this schedule
      let isEligible = false;
      let studentCourse = null;
      let studentInstructor = null;
      let enrollmentMessage = '';
      
      // Try to get course info from user object if available
      if (user.course || user.courseName) {
        studentCourse = user.course || user.courseName;
        studentInstructor = user.instructorId || user.instructorName;
      } else {
        // Otherwise fetch from appointments API
        try {
          // Try both API endpoints
          let appointmentsResponse;
          try {
            appointmentsResponse = await axios.get(`http://localhost:5000/api/appointments/student/${studentId}`);
          } catch (error) {
            appointmentsResponse = await axios.get(`http://localhost:5000/appointments/student/${studentId}`);
          }
          
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
            
            if (appointments && appointments.length > 0) {
              // Get the confirmed or most recent appointment
              const confirmedAppointments = appointments.filter(app => 
                app.status && app.status.toLowerCase() === 'confirmed'
              );
              
              const appointment = confirmedAppointments.length > 0 
                ? confirmedAppointments[0] 
                : appointments[0];
              
              studentCourse = appointment.courseName || appointment.course || appointment.courseTitle;
              studentInstructor = appointment.instructorId || appointment.instructorName;
            }
          }
        } catch (err) {
          console.error('Error fetching student appointment data:', err);
        }
      }
      
      // Check if this schedule matches student's course and instructor
      if (studentCourse && scheduleData.courseName) {
        // Check course match
        const courseMatches = scheduleData.courseName.toLowerCase() === studentCourse.toLowerCase();
        
        // Check instructor match if available
        const instructorMatches = studentInstructor && (
          (scheduleData.instructorId && String(scheduleData.instructorId).includes(String(studentInstructor))) ||
          (scheduleData.instructorName && scheduleData.instructorName.toLowerCase().includes(String(studentInstructor).toLowerCase()))
        );
        
        if (!courseMatches) {
          isEligible = false;
          enrollmentMessage = `You can only enroll in lessons for your course: ${studentCourse}`;
        } else if (!instructorMatches && studentInstructor) {
          isEligible = false;
          enrollmentMessage = `You can only enroll in lessons with your assigned instructor`;
        } else {
          isEligible = true;
        }
      } else {
        // If we can't determine the student's course, default to not eligible
        isEligible = false;
        enrollmentMessage = 'Cannot verify your course enrollment. Please contact support.';
      }
      
      // Now check if already enrolled in this specific schedule
      // This is a placeholder - implement actual API call to check enrollment
      const isEnrolled = false; // Replace with actual enrollment check
      
      setEnrollmentStatus({
        eligible: isEligible,
        enrolled: isEnrolled,
        status: isEnrolled ? 'Enrolled' : 'Not Enrolled',
        message: enrollmentMessage
      });
    } catch (err) {
      console.error('Error checking enrollment status:', err);
    }
  };

  const handleBack = () => {
    navigate('/studentdashboard');
  };

  const handleEnroll = async () => {
    if (!schedule || !user || !user._id) return;
    
    // Don't allow enrollment if not eligible
    if (!enrollmentStatus || !enrollmentStatus.eligible) {
      setError('You are not eligible to enroll in this class.');
      return;
    }
    
    try {
      setLoading(true);
      
      // This is where you would call the API to enroll the student in this schedule
      // For now, we'll just simulate a successful enrollment
      console.log(`Enrolling student ${user._id} in schedule ${id}`);
      
      // Update the enrollment status in the UI
      setEnrollmentStatus({
        ...enrollmentStatus,
        enrolled: true,
        status: 'Enrolled'
      });
      
      // Show success message
      alert('You have successfully enrolled in this class!');
    } catch (err) {
      console.error('Error enrolling in schedule:', err);
      setError('Failed to enroll in this class. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return <div className="student-schedule-details__loading">Loading...</div>;
  }

  return (
    <div className="student-schedule-details__container">
      <div className="student-schedule-details__header">
        <h1 className="student-schedule-details__title">Lesson Details</h1>
        <button 
          className="student-schedule-details__button student-schedule-details__button--secondary" 
          onClick={handleBack}
        >
          Back to Dashboard
        </button>
      </div>

      {error && <div className="student-schedule-details__error">{error}</div>}

      {loading ? (
        <div className="student-schedule-details__loading">Loading schedule details...</div>
      ) : schedule ? (
        <>
          <div className="student-schedule-details__card">
            <div className="student-schedule-details__section">
              <h2 className="student-schedule-details__section-title">Lesson Information</h2>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Title</div>
                <div className="student-schedule-details__value">{schedule.lessonTitle}</div>
              </div>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Course</div>
                <div className="student-schedule-details__value">{schedule.courseName}</div>
              </div>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Description</div>
                <div className="student-schedule-details__value student-schedule-details__description">{schedule.lessonDescription}</div>
              </div>
            </div>

            <div className="student-schedule-details__section">
              <h2 className="student-schedule-details__section-title">Schedule Details</h2>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Date</div>
                <div className="student-schedule-details__value">{formatDate(schedule.date)}</div>
              </div>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Time</div>
                <div className="student-schedule-details__value">{schedule.startTime} - {schedule.endTime}</div>
              </div>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Location</div>
                <div className="student-schedule-details__value">{schedule.location}</div>
              </div>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Status</div>
                <div className="student-schedule-details__value">
                  <span className={`student-schedule-details__status student-schedule-details__status--${schedule.status}`}>
                    {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Availability</div>
                <div className="student-schedule-details__value">
                  {schedule.enrolledStudents} / {schedule.maxStudents} students
                  {schedule.enrolledStudents >= schedule.maxStudents ? 
                    <span className="student-schedule-details__full"> (Class Full)</span> : 
                    <span className="student-schedule-details__available"> (Spots Available)</span>
                  }
                </div>
              </div>
            </div>

            <div className="student-schedule-details__section">
              <h2 className="student-schedule-details__section-title">Instructor Information</h2>
              
              <div className="student-schedule-details__row">
                <div className="student-schedule-details__label">Instructor</div>
                <div className="student-schedule-details__value">{schedule.instructorName}</div>
              </div>
            </div>

            <div className="student-schedule-details__section">
              <h2 className="student-schedule-details__section-title">Enrollment Status</h2>
              
              {enrollmentStatus ? (
                <div className="student-schedule-details__enrollment-status">
                  <p>Your Status: 
                    <span className={`student-schedule-details__status ${
                      enrollmentStatus.enrolled ? 
                      'student-schedule-details__status--enrolled' : 
                      'student-schedule-details__status--not-enrolled'
                    }`}>
                      {enrollmentStatus.status}
                    </span>
                  </p>
                  
                  {enrollmentStatus.message && !enrollmentStatus.eligible && (
                    <div className="student-schedule-details__eligibility-message">
                      {enrollmentStatus.message}
                    </div>
                  )}
                  
                  {!enrollmentStatus.enrolled && schedule.enrolledStudents < schedule.maxStudents && (
                    <button 
                      className="student-schedule-details__button student-schedule-details__button--primary"
                      onClick={handleEnroll}
                      disabled={loading || !enrollmentStatus.eligible}
                    >
                      {enrollmentStatus.eligible ? 'Enroll in this Class' : 'Not Eligible for Enrollment'}
                    </button>
                  )}
                </div>
              ) : (
                <p>Checking enrollment status...</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="student-schedule-details__error">Schedule not found</div>
      )}
    </div>
  );
}

export default StudentScheduleDetails; 