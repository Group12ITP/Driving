const express = require('express');
const router = express.Router();
const {
  getAllInstructors,
  getInstructorsByType,
  createInstructor,
  getInstructorById,
  getInstructorsForCourse,
  enrollInCourse,
  getEnrolledCourses
} = require('../Controllers/InsController');

// Get all instructors
router.get('/instructors', getAllInstructors);

// Get instructors by type
router.get('/instructors/type/:type', getInstructorsByType);

// Create a new instructor
router.post('/instructors', createInstructor);

// Get instructor by ID
router.get('/instructors/id/:type/:id', getInstructorById);

// Get instructors for a specific course
router.get('/course/:courseType', getInstructorsForCourse);

// Enroll in a course with an instructor
router.post('/enroll', enrollInCourse);

// Get enrolled courses for a student
router.get('/enrolled/:studentId', getEnrolledCourses);


module.exports = router;
