const mongoose = require('mongoose');

const instructorCredentialsSchema = new mongoose.Schema({
    instructorId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    instructorType: {
        type: String,
        enum: ['Bike', 'BikeCar', 'HeavyVehicle'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.InstructorCredentials || mongoose.model('InstructorCredentials', instructorCredentialsSchema); 