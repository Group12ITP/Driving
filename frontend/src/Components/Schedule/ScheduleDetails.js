import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ScheduleService from '../../services/ScheduleService';
import './ScheduleDetails.css';

function ScheduleDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Redirect if not logged in or not an instructor
  useEffect(() => {
    if (!user || user.role !== 'instructor') {
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
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Failed to load schedule. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  const handleEdit = () => {
    // Ensure the schedule is fully loaded before navigating to edit
    if (schedule && schedule._id) {
      navigate(`/schedule/edit/${id}`);
    } else {
      setError('Cannot edit: Schedule data is not fully loaded. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await ScheduleService.deleteSchedule(id);
        navigate('/instructorschedule', { state: { message: 'Schedule deleted successfully' } });
      } catch (err) {
        setError('Failed to delete schedule. Please try again.');
        console.error('Error deleting schedule:', err);
      }
    }
  };

  const handleBack = () => {
    navigate('/instructorschedule');
  };

  const handleUpdateStatus = async (status) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('Updating status to:', status);
      const updatedSchedule = await ScheduleService.updateScheduleStatus(id, status);
      console.log('Updated schedule:', updatedSchedule);
      
      setSchedule(updatedSchedule);
      setSuccess(`Schedule status has been updated to ${status.charAt(0).toUpperCase() + status.slice(1)}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
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
    return <div className="schedule-details__loading">Loading...</div>;
  }

  return (
    <div className="schedule-details__container">
      <div className="schedule-details__header">
        <h1 className="schedule-details__title">Lesson Details</h1>
        <div className="schedule-details__actions">
          <button 
            className="schedule-details__button schedule-details__button--secondary" 
            onClick={handleBack}
          >
            Back to Schedule
          </button>
          <button 
            className="schedule-details__button schedule-details__button--primary" 
            onClick={handleEdit}
          >
            Edit
          </button>
          <button 
            className="schedule-details__button schedule-details__button--danger" 
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {error && <div className="schedule-details__error">{error}</div>}
      {success && <div className="schedule-details__success">{success}</div>}

      {loading ? (
        <div className="schedule-details__loading">Loading schedule details...</div>
      ) : schedule ? (
        <>
          <div className="schedule-details__card">
            <div className="schedule-details__section">
              <h2 className="schedule-details__section-title">Lesson Information</h2>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Title</div>
                <div className="schedule-details__value">{schedule.lessonTitle}</div>
              </div>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Course</div>
                <div className="schedule-details__value">{schedule.courseName}</div>
              </div>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Description</div>
                <div className="schedule-details__value schedule-details__description">{schedule.lessonDescription}</div>
              </div>
            </div>

            <div className="schedule-details__section">
              <h2 className="schedule-details__section-title">Schedule Details</h2>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Date</div>
                <div className="schedule-details__value">{formatDate(schedule.date)}</div>
              </div>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Time</div>
                <div className="schedule-details__value">{schedule.startTime} - {schedule.endTime}</div>
              </div>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Location</div>
                <div className="schedule-details__value">{schedule.location}</div>
              </div>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Status</div>
                <div className="schedule-details__value">
                  <span className={`schedule-details__status schedule-details__status--${schedule.status}`}>
                    {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Students</div>
                <div className="schedule-details__value">{schedule.enrolledStudents} / {schedule.maxStudents}</div>
              </div>
            </div>

            <div className="schedule-details__section">
              <h2 className="schedule-details__section-title">Instructor Information</h2>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Instructor</div>
                <div className="schedule-details__value">{schedule.instructorName}</div>
              </div>
              
              <div className="schedule-details__row">
                <div className="schedule-details__label">Instructor ID</div>
                <div className="schedule-details__value">{schedule.instructorId}</div>
              </div>
            </div>

            <div className="schedule-details__section">
              <h2 className="schedule-details__section-title">Update Status</h2>
              <div className="schedule-details__actions">
                <button 
                  className="schedule-details__button schedule-details__button--primary" 
                  onClick={() => handleUpdateStatus('scheduled')}
                  disabled={schedule.status === 'scheduled'}
                >
                  Mark as Scheduled
                </button>
                <button 
                  className="schedule-details__button schedule-details__button--primary" 
                  onClick={() => handleUpdateStatus('in-progress')}
                  disabled={schedule.status === 'in-progress'}
                  style={{ marginLeft: '10px' }}
                >
                  Mark as In Progress
                </button>
                <button 
                  className="schedule-details__button schedule-details__button--primary" 
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={schedule.status === 'completed'}
                  style={{ marginLeft: '10px' }}
                >
                  Mark as Completed
                </button>
                <button 
                  className="schedule-details__button schedule-details__button--danger" 
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={schedule.status === 'cancelled'}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel Lesson
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="schedule-details__error">Schedule not found</div>
      )}
    </div>
  );
}

export default ScheduleDetails; 