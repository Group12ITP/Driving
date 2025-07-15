const mongoose = require('mongoose');

const bikeCarInstructorSchema = new mongoose.Schema({
  instructorId: {
    type: String,
    default: function() {
      // Generate a random number between 1 and 999
      const randomNum = Math.floor(Math.random() * 999) + 1;
      // Format as BC001, BC002, etc.
      return `BC${randomNum.toString().padStart(3, '0')}`;
    },
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/default-instructor.jpg'
  },
  experience: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ratings: {
    type: Number,
    default: 4.0,
    min: 1,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  specialization: {
    type: String,
    default: 'Bike & Car Training'
  },
  availability: {
    type: Boolean,
    default: true
  },
  contact: {
    email: String,
    phone: String
  },
  vehicleTypes: {
    type: [String],
    default: ['Bike', 'Car']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.BikeCarInstructor || mongoose.model('BikeCarInstructor', bikeCarInstructorSchema);
