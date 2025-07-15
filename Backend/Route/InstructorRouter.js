const express = require("express");
const router = express.Router();
const Instructor = require("../Model/InstructorModel");
const InstructorController = require("../Controllers/InstructorControl");

router.get("/",InstructorController.getAllInstructors);
router.post("/",InstructorController.addInstructors);
router.get("/:id",InstructorController.getInstructorbyId);
router.put("/:id",InstructorController.updateInstructor);
router.delete("/:id",InstructorController.deleteInstructor);
router.get("/:instructorId/students", InstructorController.getInstructorStudents);

module.exports = router;