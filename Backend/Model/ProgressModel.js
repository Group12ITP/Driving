const mongoose = require("mongoose");

// Helper function to format instructor ID
const formatInstructorId = (instructorId, courseName) => {
    if (!instructorId) return '';
    
    // If instructorId already has a format like BO001, return as is
    if (typeof instructorId === 'string' && /^[A-Z]{2}\d{3}$/.test(instructorId)) {
        return instructorId;
    }
    
    if (!courseName) return instructorId;
    
    const courseNameLower = courseName.toLowerCase();
    
    if (courseNameLower.includes('bike') && !courseNameLower.includes('car')) {
        return `BO${instructorId.toString().padStart(3, '0')}`;
    } else if (courseNameLower.includes('bike') && courseNameLower.includes('car')) {
        return `BC${instructorId.toString().padStart(3, '0')}`;
    } else if (courseNameLower.includes('heavy')) {
        return `HV${instructorId.toString().padStart(3, '0')}`;
    }
    
    return instructorId;
};

const progressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
 
    startDate: {
        type: Date,
        default: Date.now
    },
    studentId: {
        type: String,
        required: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    instructorId: {
        type: String,
        required: true,
    },
    studentProgress: {
        type: String,
        enum: ['Not Started', 'Theory Learning', 'Theory Test Passed', 'Practical Training', 'Ready for License Test', 'Licensed'],
        default: 'Not Started'
    },
    notes: {
        type: String,
        default: ''
    }
});

// Add a pre-save middleware to ensure instructor ID is formatted properly
progressSchema.pre('save', function(next) {
    // Only format if not already formatted
    if (this.instructorId && this.name && !(/^[A-Z]{2}\d{3}$/.test(this.instructorId))) {
        this.instructorId = formatInstructorId(this.instructorId, this.name);
    }
    next();
});

module.exports = mongoose.model("ProgressModel", progressSchema);