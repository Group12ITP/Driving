import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddNewCourse from './AddNewCourse/AddNewCourse';
import CourseList from './CourseList/CourseList';
import './UserDetails/display.css';
import axios from 'axios'; // Importing axios for API calls

function DisplayCourse() {
  const [showAddCourse, setShowAddCourse] = useState(false); // Default to viewing the course list
  const [courses, setCourses] = useState([]); // State to store the course list

  // Fetch courses from the server when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses from the server
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Addcourse'); // Ensure the correct endpoint
      setCourses(response.data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    }
  };

  // Add a new course and refresh the list
  const addCourse = async (newCourse) => {
    try {
      await axios.post('http://localhost:5000/Addcourse/add', newCourse); // Ensure correct endpoint
      fetchCourses(); // Refresh the course list after adding
    } catch (err) {
      console.error("Error adding course:", err.message);
    }
  };

  // Delete a course and refresh the list
  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Addcourse/${id}`);    // Ensure correct endpoint
      fetchCourses(); // Refresh the course list after deleting
    } catch (err) {
      console.error("Error deleting course:", err.message);
    }
  };

  // Update a course and refresh the list
  const updateCourse = async (id, updatedCourse) => {
    try {
      await axios.put(`http://localhost:5000/Addcourse/${id}`, updatedCourse); // Ensure correct endpoint
      fetchCourses(); // Refresh the course list after updating
    } catch (err) {
      console.error("Error updating course:", err.message);
    }
  };

  return (
    <div className="app-container44">
      {showAddCourse ? (
        <AddNewCourse 
          setShowAddCourse={setShowAddCourse} 
          addCourse={addCourse} 
        />
      ) : (
        <CourseList 
          setShowAddCourse={setShowAddCourse} 
          courses={courses} 
          deleteCourse={deleteCourse} 
          updateCourse={updateCourse} 
        />
      )}
    </div>
  );
}

export default DisplayCourse;