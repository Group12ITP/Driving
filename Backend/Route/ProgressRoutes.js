const express = require("express");
const router = express.Router();
const progressController = require("../Controllers/ProgressController");

// Get all progress records
router.get("/", progressController.getAllProgress);

// Create progress records from appointments
router.post("/sync-from-appointments", progressController.createProgressFromAppointments);

// Get progress by ID
router.get("/:id", progressController.getProgressById);

// Get progress by student ID
router.get("/student/:studentId", progressController.getProgressByStudentId);

// Get progress by instructor ID
router.get("/instructor/:instructorId", progressController.getProgressByInstructorId);

// Create a new progress record
router.post("/", progressController.createProgress);

// Update progress
router.put("/:id", progressController.updateProgress);

// Delete progress
router.delete("/:id", progressController.deleteProgress);

module.exports = router;
