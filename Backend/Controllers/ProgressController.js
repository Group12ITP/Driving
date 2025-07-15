const ProgressModel = require("../Model/ProgressModel");
const Appointment = require("../Model/AddAppointmentsModel");

// Get all progress records
exports.getAllProgress = async (req, res) => {
    try {
        const progress = await ProgressModel.find();
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get progress by ID
exports.getProgressById = async (req, res) => {
    try {
        const progress = await ProgressModel.findById(req.params.id);
        if (!progress) {
            return res.status(404).json({ message: "Progress record not found" });
        }
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get progress by student ID
exports.getProgressByStudentId = async (req, res) => {
    try {
        const progress = await ProgressModel.find({ studentId: req.params.studentId });
        if (!progress || progress.length === 0) {
            return res.status(404).json({ message: "No progress records found for this student" });
        }
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get progress by instructor ID
exports.getProgressByInstructorId = async (req, res) => {
    try {
        const progress = await ProgressModel.find({ instructorId: req.params.instructorId });
        if (!progress || progress.length === 0) {
            return res.status(404).json({ message: "No progress records found for this instructor" });
        }
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new progress record
exports.createProgress = async (req, res) => {
    try {
        // Ensure studentName is included
        if (!req.body.studentName) {
            return res.status(400).json({ message: "Student name is required" });
        }

        const newProgress = new ProgressModel(req.body);
        const savedProgress = await newProgress.save();
        res.status(201).json(savedProgress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update progress
exports.updateProgress = async (req, res) => {
    try {
        // Allow updating studentProgress and notes
        const updateData = {};
        if (req.body.studentProgress) {
            updateData.studentProgress = req.body.studentProgress;
        }
        if (req.body.notes !== undefined) {
            updateData.notes = req.body.notes;
        }

        const updatedProgress = await ProgressModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedProgress) {
            return res.status(404).json({ message: "Progress record not found" });
        }
        res.status(200).json(updatedProgress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete progress
exports.deleteProgress = async (req, res) => {
    try {
        const deletedProgress = await ProgressModel.findByIdAndDelete(req.params.id);
        if (!deletedProgress) {
            return res.status(404).json({ message: "Progress record not found" });
        }
        res.status(200).json({ message: "Progress record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create progress records from appointments
exports.createProgressFromAppointments = async (req, res) => {
    try {
        // Get all confirmed appointments that don't have progress records yet
        const appointments = await Appointment.find({ status: 'confirmed' });
        
        let created = 0;
        let alreadyExists = 0;
        
        for (let appointment of appointments) {
            // Format instructor ID based on course type
            let formattedInstructorId;
            if (appointment.formattedInstructorId) {
                formattedInstructorId = appointment.formattedInstructorId;
            } else {
                const courseNameLower = appointment.courseName ? appointment.courseName.toLowerCase() : '';
                
                if (courseNameLower.includes('bike') && !courseNameLower.includes('car')) {
                    formattedInstructorId = `BO${appointment.instructorId.toString().padStart(3, '0')}`;
                } else if (courseNameLower.includes('bike') && courseNameLower.includes('car')) {
                    formattedInstructorId = `BC${appointment.instructorId.toString().padStart(3, '0')}`;
                } else if (courseNameLower.includes('heavy')) {
                    formattedInstructorId = `HV${appointment.instructorId.toString().padStart(3, '0')}`;
                } else {
                    formattedInstructorId = appointment.instructorId.toString();
                }
            }
            
            // Check if progress record already exists for this student and instructor
            const existingProgress = await ProgressModel.findOne({
                studentId: appointment.studentId,
                instructorId: formattedInstructorId
            });
            
            if (!existingProgress) {
                // Create new progress record
                const newProgress = new ProgressModel({
                    name: appointment.courseName,
                    studentId: appointment.studentId,
                    studentName: appointment.studentName,
                    instructorId: formattedInstructorId,
                    studentProgress: 'Not Started'
                });
                
                await newProgress.save();
                created++;
            } else {
                alreadyExists++;
            }
        }
        
        res.status(200).json({
            message: `Progress tracking initialized. Created ${created} new records. ${alreadyExists} records already existed.`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
