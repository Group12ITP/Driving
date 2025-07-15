const express = require('express');
const router = express.Router();
const {
    getAllAppointments,
    createAppointment,
    getStudentAppointments,
    getInstructorAppointments,
    getAvailableTimeSlots,
    updateAppointment,
    deleteAppointment
} = require('../Controllers/AddAppointmentsControl');

// Get all appointments
router.get('/', getAllAppointments);

// Create new appointment
router.post('/create', createAppointment);

// Get appointments for a student
router.get('/student/:studentId', getStudentAppointments);

// Get appointments for an instructor
router.get('/instructor/:instructorId', getInstructorAppointments);

// Get available time slots for a specific date
router.get('/available-slots/:instructorId/:date', getAvailableTimeSlots);

// Update appointment
router.put('/:id', updateAppointment);

// Delete appointment
router.delete('/:id', deleteAppointment);

module.exports = router;