const mongoose = require('mongoose');

const heavyVehicleInstructorSchema = new mongoose.Schema({
  instructorId: {
    type: String,
    default: function() {
      // Generate a random number between 1 and 999
      const randomNum = Math.floor(Math.random() * 999) + 1;
      // Format as HV001, HV002, etc.
      return `HV${randomNum.toString().padStart(3, '0')}`;
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
    default: 'Heavy Vehicle Training'
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
    enum: ['Truck', 'Bus', 'HGV', 'LGV'],
    required: true
  },
  licenseTypes: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.HeavyVehicleInstructor || mongoose.model('HeavyVehicleInstructor', heavyVehicleInstructorSchema);
