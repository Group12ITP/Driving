import React, { useState, useEffect } from 'react';
import ScheduleService from '../../services/ScheduleService';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import './AvailableSchedules.css';

const AvailableSchedules = ({ user, courseInfo }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await ScheduleService.getAllSchedules();
        console.log('Raw schedules from API:', data);
        
        // Sort by date (newest first)
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setSchedules(data);
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Filter schedules whenever schedules or courseInfo changes
  useEffect(() => {
    if (!schedules.length || !courseInfo) return;
    
    console.log('Filtering schedules based on courseInfo:', courseInfo);
    
    // Get course type (bike, car, heavy vehicle)
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
    
    // Get the student's course type
    const studentCourseType = getCourseType(courseInfo.courseName);
    console.log('Student course type:', studentCourseType);
    
    // Filter schedules based on course type
    const filtered = schedules.filter(schedule => {
      // Get schedule course type
      const scheduleCourseType = getCourseType(schedule.courseName);
      
      // Match by course type
      const matchesCourseType = studentCourseType === scheduleCourseType;
      
      // Match by instructor (if available and needed)
      const matchesInstructor = courseInfo.instructorId ? 
        (schedule.instructorId && String(schedule.instructorId).includes(String(courseInfo.instructorId))) ||
        (schedule.instructorName && courseInfo.instructorName && 
         schedule.instructorName.toLowerCase() === courseInfo.instructorName.toLowerCase())
        : true;
      
      // For debugging
      console.log(`Schedule ${schedule._id} - Course: ${schedule.courseName}, Type: ${scheduleCourseType}, Matches: ${matchesCourseType}`);
      
      // Only include active schedules
      const isActive = schedule.status !== 'cancelled' && schedule.status !== 'completed';
      
      return matchesCourseType && isActive;
    });
    
    console.log(`Filtered ${schedules.length} schedules down to ${filtered.length} matching schedules`);
    setFilteredSchedules(filtered);
  }, [schedules, courseInfo]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="student-schedules-loading">Loading schedules...</div>;
  }

  if (error) {
    return <div className="student-schedules-error">{error}</div>;
  }

  if (filteredSchedules.length === 0) {
    return (
      <div className="student-no-schedules">
        No relevant schedules found for your course type: {courseInfo?.courseName || 'Unknown'}
      </div>
    );
  }

  return (
    <div className="student-available-schedules">
      <h3>Available Lessons for {courseInfo?.courseName || 'Your Course'}</h3>
      <div className="student-schedule-count">Found {filteredSchedules.length} relevant schedules</div>
      
      <div className="student-schedule-cards">
        {filteredSchedules.slice(0, 5).map((schedule) => (
          <div key={schedule._id} className="student-schedule-card">
            <div className="student-schedule-card-header">
              <h4>{schedule.lessonTitle}</h4>
              <span className={`student-schedule-status student-schedule-status-${schedule.status}`}>
                {schedule.status}
              </span>
            </div>
            
            <div className="student-schedule-card-details">
              <div className="student-schedule-detail">
                <FaCalendarAlt className="student-schedule-icon" />
                <span>{formatDate(schedule.date)}</span>
              </div>
              
              <div className="student-schedule-detail">
                <FaClock className="student-schedule-icon" />
                <span>{schedule.startTime} - {schedule.endTime}</span>
              </div>
              
              <div className="student-schedule-detail">
                <FaMapMarkerAlt className="student-schedule-icon" />
                <span>{schedule.location}</span>
              </div>
            </div>
            
            <div className="student-schedule-card-info">
              <div className="student-schedule-course">Course: {schedule.courseName}</div>
              <div className="student-schedule-instructor">Instructor: {schedule.instructorName}</div>
            </div>
            
            <Link 
              to={`/schedule/student/${schedule._id}`}
              className="student-schedule-view-button"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
      
      <div className="student-view-all-link-container">
        <Link to="/schedules/student" className="student-view-all-link">
          View All Schedules ({filteredSchedules.length})
        </Link>
      </div>
    </div>
  );
};

export default AvailableSchedules; 