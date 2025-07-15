import React, { useState, useEffect } from 'react';
import './AddNewCourse.css';


function AddNewCourse({ setShowAddCourse }) {
  const [course, setCourse] = useState({
    id: '',
    name: '',
    description: '',
    duration: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!course.id.trim()) {
      newErrors.id = 'Course ID is required';
    } else if (course.id.length < 3) {
      newErrors.id = 'Course ID must be at least 3 characters';
    }

    if (!course.name.trim()) {
      newErrors.name = 'Course name is required';
    } else if (course.name.length < 5) {
      newErrors.name = 'Course name must be at least 5 characters';
    }

    if (!course.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (course.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!course.duration) {
      newErrors.duration = 'Duration is required';
    } else if (course.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 week';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let courses = JSON.parse(localStorage.getItem("courses")) || [];
      courses.push(course);
      localStorage.setItem("courses", JSON.stringify(courses));
      
      setSuccessMessage('Course added successfully! 🎉');
      setCourse({ id: '', name: '', description: '', duration: '' });
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to add course. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-course55">
      <h1 className="title55">🚗 Add New Course</h1>
      <form onSubmit={handleSubmit} className="course-form55">
        <div className="form-group55">
          <label>Course ID:</label>
          <input
            type="text"
            name="id"
            value={course.id}
            onChange={handleChange}
            className={errors.id ? 'error' : ''}
            placeholder="Enter course ID"
          />
          {errors.id && <span className="error-message55">{errors.id}</span>}
        </div>

        <div className="form-group55">
          <label>Course Name:</label>
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter course name"
          />
          {errors.name && <span className="error-message55">{errors.name}</span>}
        </div>

        <div className="form-group55">
          <label>Description:</label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Enter course description"
          ></textarea>
          {errors.description && <span className="error-message55">{errors.description}</span>}
        </div>

        <div className="form-group55">
          <label>Duration (weeks):</label>
          <input
            type="number"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            className={errors.duration ? 'error' : ''}
            placeholder="Enter duration in weeks"
            min="1"
          />
          {errors.duration && <span className="error-message55">{errors.duration}</span>}
        </div>

        {successMessage && <div className="success-message55">{successMessage}</div>}
        {errors.submit && <div className="error-message55">{errors.submit}</div>}

        <button 
          type="submit" 
          className="submit-button55"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : '➕ Add Course'}
        </button>
      </form>

      <div className="nav-buttons55">
        <button 
          onClick={() => setShowAddCourse(false)} 
          className='view-course55'
        >
          📋 View Courses
        </button>
      </div>
    </div>
  );
}

export default AddNewCourse;