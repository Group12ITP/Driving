const express = require("express");
const router = express.Router();
const attendanceController = require("../Controllers/attendanceController");

// Get all attendance records
router.get("/", attendanceController.getAllAttendance);

// Create attendance records from appointments
router.post("/sync-from-appointments", attendanceController.createAttendanceFromAppointments);

// Get attendance by ID
router.get("/:id", attendanceController.getAttendanceById);

// Get attendance by student ID
router.get("/student/:studentId", attendanceController.getAttendanceByStudentId);

// Get attendance by instructor ID
router.get("/instructor/:instructorId", attendanceController.getAttendanceByInstructorId);

// Get attendance by date range
router.get("/date/:startDate/:endDate", attendanceController.getAttendanceByDateRange);

// Create a new attendance record
router.post("/", attendanceController.createAttendance);

// Update attendance
router.put("/:id", attendanceController.updateAttendance);

// Delete attendance
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;