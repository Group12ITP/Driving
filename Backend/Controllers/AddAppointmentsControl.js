const Appointment = require('../Model/AddAppointmentsModel');
const BikeInstructor = require('../Model/BikeInstructorModel');
const BikeCarInstructor = require('../Model/BikeCarInstructorModel');
const HeavyVehicleInstructor = require('../Model/HeavyVehicleInstructor');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Format instructor ID based on course type
const formatInstructorId = async (instructorId, courseName) => {
    try {
        // Check if courseName contains specific keywords
        const courseNameLower = courseName.toLowerCase();
        
        if (courseNameLower.includes('bike') && !courseNameLower.includes('car')) {
            // Try to find the instructor in the BikeInstructor collection
            const instructor = await BikeInstructor.findById(instructorId);
            if (instructor && instructor.instructorId) {
                return instructor.instructorId;
            }
            // If not found, use default formatting
            return `BO${instructorId.toString().substr(-3).padStart(3, '0')}`;
        } 
        else if (courseNameLower.includes('bike') && courseNameLower.includes('car')) {
            // Try to find the instructor in the BikeCarInstructor collection
            const instructor = await BikeCarInstructor.findById(instructorId);
            if (instructor && instructor.instructorId) {
                return instructor.instructorId;
            }
            // If not found, use default formatting
            return `BC${instructorId.toString().substr(-3).padStart(3, '0')}`;
        } 
        else if (courseNameLower.includes('heavy')) {
            // Try to find the instructor in the HeavyVehicleInstructor collection
            const instructor = await HeavyVehicleInstructor.findById(instructorId);
            if (instructor && instructor.instructorId) {
                return instructor.instructorId;
            }
            // If not found, use default formatting
            return `HV${instructorId.toString().substr(-3).padStart(3, '0')}`;
        }
        
        // Default case: return the original ID
        return instructorId;
    } catch (error) {
        console.error('Error formatting instructor ID:', error);
        return instructorId; // Return original ID in case of error
    }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { studentId, studentName, instructorId, instructorName, courseName, date, time } = req.body;

        const existingAppointment = await Appointment.findOne({
            instructorId,
            date,
            time
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Format the instructor ID based on course type
        const formattedInstructorId = await formatInstructorId(instructorId, courseName);

        const appointment = await Appointment.create({
            studentId,
            studentName,
            instructorId,
            formattedInstructorId, // Store the formatted ID
            instructorName,
            courseName,
            date,
            time
        });

        res.status(201).json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all appointments for a student
exports.getStudentAppointments = async (req, res) => {
    try {
        const { studentId } = req.params;
        const appointments = await Appointment.find({ studentId });
        res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching student appointments:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all appointments for an instructor
exports.getInstructorAppointments = async (req, res) => {
    try {
        const { instructorId } = req.params;
        const appointments = await Appointment.find({ instructorId });
        res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching instructor appointments:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get available time slots for a specific date
exports.getAvailableTimeSlots = async (req, res) => {
    try {
        const { instructorId, date } = req.params;

        const bookedAppointments = await Appointment.find({
            instructorId,
            date
        });

        const allTimeSlots = [
            '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00'
        ];

        const bookedTimes = bookedAppointments.map(apt => apt.time);
        const availableTimeSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));

        res.status(200).json({
            success: true,
            availableTimeSlots,
            bookedTimeSlots: bookedTimes
        });
    } catch (error) {
        console.error('Error fetching available time slots:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, status } = req.body;

        // Check if the new time slot is available (if date and time are being updated)
        if (date && time) {
            const existingAppointment = await Appointment.findOne({
                instructorId: req.body.instructorId || (await Appointment.findById(id)).instructorId,
                date,
                time,
                _id: { $ne: id } // Exclude the current appointment
            });

            if (existingAppointment) {
                return res.status(400).json({
                    success: false,
                    message: 'This time slot is already booked'
                });
            }
        }

        // If updating format-dependent fields, update the formatted ID
        let formattedInstructorId;
        if (req.body.instructorId && req.body.courseName) {
            formattedInstructorId = await formatInstructorId(req.body.instructorId, req.body.courseName);
            req.body.formattedInstructorId = formattedInstructorId;
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await Appointment.findByIdAndDelete(id);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};