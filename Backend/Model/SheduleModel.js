const mongoose = require('mongoose');

// Schema for scheduling lessons by instructors
const ScheduleSchema = new mongoose.Schema({
    instructorId: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Instructor',
        required: [true, 'Instructor ID is required']
    },
    instructorName: {
        type: String,
        required: [true, 'Instructor name is required']
    },
    courseName: {
        type: String,
        required: [true, 'Course name is required']
    },
    lessonTitle: {
        type: String,
        required: [true, 'Lesson title is required']
    },
    lessonDescription: {
        type: String,
        required: [true, 'Lesson description is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        validate: {
            validator: function(v) {
                // Get today's date at midnight
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Get lesson date at midnight
                const lessonDate = new Date(v);
                lessonDate.setHours(0, 0, 0, 0);
                
                return lessonDate >= today;
            },
            message: 'Lesson date must be today or in the future'
        }
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        validate: {
            validator: function(v) {
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                return timeRegex.test(v);
            },
            message: 'Invalid time format. Use HH:MM format'
        }
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        validate: {
            validator: function(v) {
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                return timeRegex.test(v);
            },
            message: 'Invalid time format. Use HH:MM format'
        }
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    maxStudents: {
        type: Number,
        required: [true, 'Maximum number of students is required'],
        min: [1, 'At least one student must be allowed']
    },
    enrolledStudents: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: {
            values: ['scheduled', 'in-progress', 'completed', 'cancelled'],
            message: '{VALUE} is not a valid status'
        },
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create a compound index to prevent double bookings
ScheduleSchema.index({ instructorId: 1, date: 1, startTime: 1 }, { unique: true });

// Add a pre-save middleware to format the date
ScheduleSchema.pre('save', function(next) {
    if (this.date) {
        // Set the date to midnight in local timezone
        this.date.setHours(0, 0, 0, 0);
    }
    next();
});

// Add validation to ensure endTime is after startTime
ScheduleSchema.path('endTime').validate(function(value) {
    // Skip validation if startTime or endTime is not provided
    if (!this.startTime || !value) {
        return true; // Let the required validator handle this
    }
    
    try {
        const startHours = parseInt(this.startTime.split(':')[0]);
        const startMinutes = parseInt(this.startTime.split(':')[1]);
        const endHours = parseInt(value.split(':')[0]);
        const endMinutes = parseInt(value.split(':')[1]);
        
        return (endHours > startHours) || (endHours === startHours && endMinutes > startMinutes);
    } catch (error) {
        console.error('Error validating time:', error);
        return false; // Validation fails on parsing error
    }
}, 'End time must be after start time');

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;
