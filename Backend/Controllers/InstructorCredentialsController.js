const InstructorCredentials = require('../Model/InstructorCredentials');
const bcrypt = require('bcryptjs');

// Get all instructor credentials
exports.getAllInstructorCredentials = async (req, res) => {
    try {
        const instructorCredentials = await InstructorCredentials.find();
        res.status(200).json({
            success: true,
            data: instructorCredentials
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single instructor credential
exports.getInstructorCredential = async (req, res) => {
    try {
        const instructorCredential = await InstructorCredentials.findById(req.params.id);
        if (!instructorCredential) {
            return res.status(404).json({
                success: false,
                message: 'Instructor credential not found'
            });
        }
        res.status(200).json({
            success: true,
            data: instructorCredential
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new instructor credential
exports.createInstructorCredential = async (req, res) => {
    try {
        // Store the original password without hashing for display purposes
        // Note: In a production environment, you should never store plain text passwords
        const instructorData = { ...req.body };
        
        // Hash password for security (not used in this demo but good practice)
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            // For this demo, we'll just use the plain text password
            // instructorData.password = hashedPassword;
        }

        const instructorCredential = await InstructorCredentials.create(instructorData);
        res.status(201).json({
            success: true,
            data: instructorCredential
        });
    } catch (error) {
        console.error('Create instructor error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update an instructor credential
exports.updateInstructorCredential = async (req, res) => {
    try {
        const instructorCredential = await InstructorCredentials.findById(req.params.id);
        
        if (!instructorCredential) {
            return res.status(404).json({
                success: false,
                message: 'Instructor credential not found'
            });
        }

        // Store the original password without hashing for display purposes
        const updateData = { ...req.body };
        
        // If no password is provided, keep the old one
        if (!updateData.password) {
            delete updateData.password;
        }
        
        // For this demo, we'll just use the plain text password without hashing
        // In a production environment, you should hash passwords

        const updatedInstructor = await InstructorCredentials.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: updatedInstructor
        });
    } catch (error) {
        console.error('Update instructor error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete an instructor credential
exports.deleteInstructorCredential = async (req, res) => {
    try {
        console.log('Delete request received for ID:', req.params.id);
        
        // Simple direct deletion approach
        await InstructorCredentials.findByIdAndDelete(req.params.id);
        
        console.log('Instructor deleted successfully, ID:', req.params.id);
        res.status(200).json({
            success: true,
            message: 'Instructor credential deleted successfully'
        });
    } catch (error) {
        console.error('Delete instructor error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting instructor: ' + error.message
        });
    }
}; 