import React, { useState, useEffect } from 'react';
import './CourseList.css';



function CourseList({ setShowAddCourse }) {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [updatedCourse, setUpdatedCourse] = useState({
    id: '',
    name: '',
    description: '',
    duration: ''
  });

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(storedCourses);
  }, []);

  const handleDelete = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  const handleEdit = (course, index) => {
    setEditingCourse(index);
    setUpdatedCourse(course);
  };

  const handleUpdate = () => {
    const updatedCourses = [...courses];
    updatedCourses[editingCourse] = updatedCourse;
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setEditingCourse(null);
    setUpdatedCourse({ id: '', name: '', description: '', duration: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCourse({
      ...updatedCourse,
      [name]: value
    });
  };

  return (
    <div className="course-list">
      <h1 className="title">📋 Course List</h1>
      
      {editingCourse !== null && (
        <div className="update-form">
          <h2>Update Course</h2>
          <label>
            Course ID:
            <input
             type="text"
              name="id"
              value={updatedCourse.id}
              onChange={handleChange}
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updatedCourse.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={updatedCourse.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Duration (weeks):
            <input
              type="number"
              name="duration"
              value={updatedCourse.duration}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleUpdate} className="update-button">
            Update Course
          </button>
        </div>
      )}

      <table className="course-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Duration (weeks)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.duration}</td>
              <td>
                <button
                  onClick={() => handleEdit(course, index)}
                  className="edit-button"
                >
                  ✏ Edit
                </button>
                <button 
                  onClick={() => handleDelete(index)} 
                  className="delete-button">
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Course Button */}
      <div className="add-course-button-container">
        <button onClick={() => setShowAddCourse(true)} className="add-course-button">
          ➕ Add Course
        </button>
      </div>
      
    </div>
  );
}

export default CourseList;