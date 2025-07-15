import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ScheduleService from '../../services/ScheduleService';
import './ScheduleForm.css';

function ScheduleForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    instructorId: '',
    instructorName: '',
    courseName: '',
    lessonTitle: '',
    lessonDescription: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxStudents: 1,
    status: 'scheduled'
  });

  // Redirect if not logged in or not an instructor
  useEffect(() => {
    if (!user || user.role !== 'instructor') {
      navigate('/login');
    } else if (user && !isEditMode) {
      // Pre-fill instructor details in create mode
      console.log('User object:', user); // Log the user object to inspect it
      setFormData(prev => ({
        ...prev,
        instructorId: user._id || user.instructorId || '', // Try both possible ID fields
        instructorName: user.name || ''
      }));
    }
  }, [user, navigate, isEditMode]);

  // Fetch schedule data in edit mode
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await ScheduleService.getScheduleById(id);
        
        // Format date for input field (YYYY-MM-DD)
        const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
        
        setFormData({
          ...data,
          date: formattedDate
        });
      } catch (err) {
        setError('Failed to load schedule data. Please try again.');
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchSchedule();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = formData.date ? new Date(formData.date) : null;
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0);
    }
    
    if (!formData.lessonTitle?.trim()) {
      errors.lessonTitle = 'Lesson title is required';
    }
    
    if (!formData.courseName?.trim()) {
      errors.courseName = 'Course name is required';
    }
    
    if (!formData.lessonDescription?.trim()) {
      errors.lessonDescription = 'Lesson description is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    } else if (selectedDate < today) {
      errors.date = 'Date cannot be in the past';
    }
    
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.startTime)) {
      errors.startTime = 'Invalid start time format. Use HH:MM format';
    }
    
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.endTime)) {
      errors.endTime = 'Invalid end time format. Use HH:MM format';
    } else if (formData.startTime && formData.endTime) {
      try {
        const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
        const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
        
        if ((endHours < startHours) || (endHours === startHours && endMinutes <= startMinutes)) {
          errors.endTime = 'End time must be after start time';
        }
      } catch (error) {
        console.error('Error validating time:', error);
        errors.endTime = 'Invalid time format';
      }
    }
    
    if (!formData.location?.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!formData.maxStudents || formData.maxStudents < 1) {
      errors.maxStudents = 'Maximum students must be at least 1';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('Submitting form data:', formData); // Log form data being sent
      
      if (isEditMode) {
        const response = await ScheduleService.updateSchedule(id, formData);
        console.log('Update response:', response); // Log response
        setSuccess('Schedule updated successfully!');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/instructorschedule', { 
            state: { message: 'Schedule updated successfully!' }
          });
        }, 1500);
      } else {
        const response = await ScheduleService.createSchedule(formData);
        console.log('Create response:', response); // Log response
        setSuccess('Schedule created successfully!');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/instructorschedule', { 
            state: { message: 'Schedule created successfully!' }
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Detailed error:', err); // Log detailed error
      let errorMessage = 'Failed to save schedule. Please try again.';
      
      // Extract more detailed error message if available
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = `Error: ${err.response.data.message}`;
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/instructorschedule');
  };

  if (!user) {
    return <div className="schedule-form__loading">Loading...</div>;
  }

  return (
    <div className="schedule-form__container">
      <div className="schedule-form__header">
        <h1 className="schedule-form__title">
          {isEditMode ? 'Edit Lesson Schedule' : 'Create New Lesson Schedule'}
        </h1>
      </div>

      {loading ? (
        <div className="schedule-form__loading">Loading...</div>
      ) : (
        <div className="schedule-form__card">
          {error && (
            <div className="schedule-form__alert schedule-form__alert--error">
              {error}
            </div>
          )}
          
          {success && (
            <div className="schedule-form__alert schedule-form__alert--success">
              {success}
            </div>
          )}
          
          <form className="schedule-form__form" onSubmit={handleSubmit}>
            <div className="schedule-form__row">
              <div className="schedule-form__group schedule-form__group--half">
                <label className="schedule-form__label">Course Name</label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className="schedule-form__input"
                  placeholder="Enter course name"
                />
                {formErrors.courseName && (
                  <div className="schedule-form__error">{formErrors.courseName}</div>
                )}
              </div>
              
              <div className="schedule-form__group schedule-form__group--half">
                <label className="schedule-form__label">Lesson Title</label>
                <input
                  type="text"
                  name="lessonTitle"
                  value={formData.lessonTitle}
                  onChange={handleChange}
                  className="schedule-form__input"
                  placeholder="Enter lesson title"
                />
                {formErrors.lessonTitle && (
                  <div className="schedule-form__error">{formErrors.lessonTitle}</div>
                )}
              </div>
            </div>
            
            <div className="schedule-form__group">
              <label className="schedule-form__label">Lesson Description</label>
              <textarea
                name="lessonDescription"
                value={formData.lessonDescription}
                onChange={handleChange}
                className="schedule-form__textarea"
                placeholder="Describe what will be covered in this lesson"
              ></textarea>
              {formErrors.lessonDescription && (
                <div className="schedule-form__error">{formErrors.lessonDescription}</div>
              )}
            </div>
            
            <div className="schedule-form__row">
              <div className="schedule-form__group schedule-form__group--half">
                <label className="schedule-form__label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="schedule-form__input"
                />
                {formErrors.date && (
                  <div className="schedule-form__error">{formErrors.date}</div>
                )}
              </div>
              
              <div className="schedule-form__group schedule-form__group--half">
                <label className="schedule-form__label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="schedule-form__input"
                  placeholder="Enter location"
                />
                {formErrors.location && (
                  <div className="schedule-form__error">{formErrors.location}</div>
                )}
              </div>
            </div>
            
            <div className="schedule-form__row">
              <div className="schedule-form__group schedule-form__group--half">
                <label className="schedule-form__label">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="schedule-form__input"
                />
                {formErrors.startTime && (
                  <div className="schedule-form__error">{formErrors.startTime}</div>
                )}
              </div>
              
              <div className="schedule-form__group schedule-form__group--half">
                <label className="schedule-form__label">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="schedule-form__input"
                />
                {formErrors.endTime && (
                  <div className="schedule-form__error">{formErrors.endTime}</div>
                )}
              </div>
            </div>
            
            <div className="schedule-form__row">
              <div className="schedule-form__group schedule-form__group--half">
                <label className="schedule-form__label">Maximum Students</label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  className="schedule-form__input"
                  min="1"
                />
                {formErrors.maxStudents && (
                  <div className="schedule-form__error">{formErrors.maxStudents}</div>
                )}
              </div>
              
              {isEditMode && (
                <div className="schedule-form__group schedule-form__group--half">
                  <label className="schedule-form__label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="schedule-form__select"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="schedule-form__buttons">
              <button
                type="button"
                className="schedule-form__button schedule-form__button--secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="schedule-form__button schedule-form__button--primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Schedule' : 'Create Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ScheduleForm; 