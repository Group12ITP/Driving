const mongoose = require('mongoose');

// Check if the model already exists before creating it
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', new mongoose.Schema({
    studentId: {
        type: String,
        required: [true, 'Student ID is required']
    },
    studentName: {
        type: String,
        required: [true, 'Student name is required']
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: [true, 'Instructor ID is required']
    },
    formattedInstructorId: {
        type: String,
        default: ''
    },
    instructorName: {
        type: String,
        required: [true, 'Instructor name is required']
    },
    courseName: {
        type: String,
        required: [true, 'Course name is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        validate: {
            validator: function(v) {
                // Get today's date at midnight
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Get appointment date at midnight
                const appointmentDate = new Date(v);
                appointmentDate.setHours(0, 0, 0, 0);
                
                return appointmentDate >= today;
            },
            message: 'Appointment date must be today or in the future'
        }
    },
    time: {
        type: String,
        required: [true, 'Time is required'],
        validate: {
            validator: function(v) {
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                return timeRegex.test(v);
            },
            message: 'Invalid time format. Use HH:MM format'
        }
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'confirmed', 'cancelled'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
}));

// Create a compound index to prevent double bookings
Appointment.schema.index({ instructorId: 1, date: 1, time: 1 }, { unique: true });

// Add a pre-save middleware to format the date
Appointment.schema.pre('save', function(next) {
    if (this.date) {
        // Set the date to midnight in local timezone
        this.date.setHours(0, 0, 0, 0);
    }
    next();
});

module.exports = Appointment;
