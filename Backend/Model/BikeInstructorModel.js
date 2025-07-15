const mongoose = require('mongoose');

const bikeInstructorSchema = new mongoose.Schema({
  instructorId: {
    type: String,
    default: function() {
      // Generate a random number between 1 and 999
      const randomNum = Math.floor(Math.random() * 999) + 1;
      // Format as BO001, BO002, etc.
      return `BO${randomNum.toString().padStart(3, '0')}`;
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
    default: 'Bike Training'
  },
  availability: {
    type: Boolean,
    default: true
  },
  contact: {
    email: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.BikeInstructor || mongoose.model('BikeInstructor', bikeInstructorSchema);
