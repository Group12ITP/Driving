const express = require('express');
const router = express.Router();
const {
    createSchedule,
    getAllSchedules,
    getSchedulesByInstructor,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    getSchedulesByDateRange,
    updateScheduleStatus
} = require('../Controllers/SheduleController');

// Create a new schedule
router.post('/', createSchedule);

// Get all schedules
router.get('/', getAllSchedules);

// Get schedules by instructor ID
router.get('/instructor/:instructorId', getSchedulesByInstructor);

// Get schedules by date range
router.get('/date-range', getSchedulesByDateRange);

// Get, update, delete a schedule by ID
router.get('/:id', getScheduleById);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

// Update schedule status
router.patch('/:id/status', updateScheduleStatus);

module.exports = router;
