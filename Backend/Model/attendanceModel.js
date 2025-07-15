const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    instructorId: {
        type: String,
        required: true,
    },
    formattedInstructorId: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        required: true
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Create a compound index for efficient querying
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema); 