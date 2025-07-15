const express = require('express');
const router = express.Router();
const BikeInstructor = require('../Model/BikeInstructorModel');
const BikeCarInstructor = require('../Model/BikeCarInstructorModel');
const HeavyVehicleInstructor = require('../Model/HeavyVehicleInstructor');

// Get instructors by type
router.get('/type/:type', async (req, res) => {
  try {
    let instructors;
    switch (req.params.type) {
      case 'bike':
        instructors = await BikeInstructor.find();
        break;
      case 'bikecar':
        instructors = await BikeCarInstructor.find();
        break;
      case 'heavy':
        instructors = await HeavyVehicleInstructor.find();
        break;
      default:
        return res.status(400).json({ message: 'Invalid instructor type' });
    }
    res.json({ instructors });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ message: 'Error fetching instructors' });
  }
});

module.exports = router; 