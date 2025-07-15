const mongoose = require('mongoose');

const enrolledCourseSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'instructorModel'
  },
  instructorModel: {
    type: String,
    required: true,
    enum: ['BikeInstructor', 'BikeCarInstructor', 'HeavyVehicleInstructor']
  },
  instructorName: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EnrolledCourse', enrolledCourseSchema); 