const express = require("express");
const { getAllCourse, addCourse, getById, updateCourse, deleteCourse } = require("../Controllers/AddcourseControl");

const router = express.Router();

router.get("/", getAllCourse);  // Get all courses
router.post("/add", addCourse);  // Add new course
router.get("/:id", getById);  // Get course by ID
router.put("/:id", updateCourse);  // Update course by ID
router.delete("/:id", deleteCourse);  // Delete course by ID

module.exports = router;