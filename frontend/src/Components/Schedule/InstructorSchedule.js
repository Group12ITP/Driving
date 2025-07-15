import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ScheduleService from '../../services/ScheduleService';
import './InstructorSchedule.css';

function InstructorSchedule() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success message in location state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
        // Also clear the location state
        window.history.replaceState({}, document.title);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Redirect if not logged in or not an instructor
  useEffect(() => {
    if (!user || user.role !== 'instructor') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch schedules for the instructor
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user) return;

      try {
        setLoading(true);
        console.log('Fetching schedules for instructor:', user);
        
        // Determine which ID to use (either _id or instructorId)
        const instructorId = user._id || user.instructorId;
        if (!instructorId) {
          console.error('No instructor ID found in user object:', user);
          setError('Unable to fetch schedules: No instructor ID found');
          setLoading(false);
          return;
        }
        
        console.log('Using instructor ID:', instructorId);
        const response = await ScheduleService.getSchedulesByInstructor(instructorId);
        console.log('Fetched schedules:', response);
        
        if (Array.isArray(response)) {
          setSchedules(response);
        } else if (response && Array.isArray(response.data)) {
          setSchedules(response.data);
        } else {
          console.error('Unexpected response format:', response);
          setSchedules([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Failed to load schedules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user]);

  const handleCreateSchedule = () => {
    navigate('/schedule/create');
  };

  const handleEditSchedule = (scheduleId) => {
    navigate(`/schedule/edit/${scheduleId}`);
  };

  const handleViewSchedule = (scheduleId) => {
    navigate(`/schedule/${scheduleId}`);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await ScheduleService.deleteSchedule(scheduleId);
        setSchedules(schedules.filter(schedule => schedule._id !== scheduleId));
      } catch (err) {
        setError('Failed to delete schedule. Please try again.');
        console.error('Error deleting schedule:', err);
      }
    }
  };

  const applyDateFilter = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      setLoading(true);
      const data = await ScheduleService.getSchedulesByDateRange(startDate, endDate);
      // Filter for the current instructor
      const filteredData = data.filter(schedule => schedule.instructorId === user._id);
      setSchedules(filteredData);
    } catch (err) {
      setError('Failed to filter schedules. Please try again.');
      console.error('Error filtering schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('');

    try {
      setLoading(true);
      const data = await ScheduleService.getSchedulesByInstructor(user._id);
      setSchedules(data);
    } catch (err) {
      setError('Failed to reset filters. Please try again.');
      console.error('Error resetting filters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter schedules by status
  const filteredSchedules = statusFilter 
    ? schedules.filter(schedule => schedule.status === statusFilter)
    : schedules;

  if (!user) {
    return <div className="schedule__loading">Loading...</div>;
  }

  return (
    <div className="schedule__container">
      <div className="schedule__header">
        <h1 className="schedule__header-title">Lesson Schedule</h1>
        <div className="schedule__header-actions">
          <button 
            className="schedule__button schedule__button--primary" 
            onClick={() => navigate('/schedule/create')}
          >
            Schedule New Lesson
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="schedule__alert schedule__alert--success">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="schedule__alert schedule__alert--error">
          {error}
        </div>
      )}

      <div className="schedule__filters">
        <div className="schedule__filter-group">
          <label className="schedule__filter-label">Start Date</label>
          <input 
            type="date" 
            className="schedule__filter-input" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="schedule__filter-group">
          <label className="schedule__filter-label">End Date</label>
          <input 
            type="date" 
            className="schedule__filter-input" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="schedule__filter-group">
          <label className="schedule__filter-label">Status</label>
          <select 
            className="schedule__filter-input" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="schedule__filter-group" style={{ justifyContent: 'flex-end' }}>
          <div style={{ marginTop: 'auto' }}>
            <button 
              className="schedule__button schedule__button--primary" 
              onClick={applyDateFilter}
              disabled={!startDate || !endDate}
            >
              Apply Filters
            </button>
            <button 
              className="schedule__button schedule__button--secondary" 
              onClick={resetFilters}
              style={{ marginLeft: '10px' }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="schedule__loading">Loading schedules...</div>
      ) : filteredSchedules.length === 0 ? (
        <div className="schedule__empty">
          <p>No schedules found. Create a new lesson schedule to get started.</p>
        </div>
      ) : (
        <div className="schedule__table-container">
          <table className="schedule__table">
            <thead className="schedule__table-header">
              <tr>
                <th>Lesson</th>
                <th>Course</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="schedule__table-body">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule._id}>
                  <td>{schedule.lessonTitle}</td>
                  <td>{schedule.courseName}</td>
                  <td>{formatDate(schedule.date)}</td>
                  <td>{schedule.startTime} - {schedule.endTime}</td>
                  <td>{schedule.location}</td>
                  <td>
                    <span className={`schedule__status schedule__status--${schedule.status}`}>
                      {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                    </span>
                  </td>
                  <td>{schedule.enrolledStudents} / {schedule.maxStudents}</td>
                  <td>
                    <div className="schedule__actions">
                      <button 
                        className="schedule__action-button schedule__action-button--edit"
                        onClick={() => handleViewSchedule(schedule._id)}
                      >
                        View
                      </button>
                      
                      <button 
                        className="schedule__action-button schedule__action-button--delete"
                        onClick={() => handleDeleteSchedule(schedule._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InstructorSchedule; 