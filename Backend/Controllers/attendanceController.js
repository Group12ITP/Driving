const Attendance = require("../Model/attendanceModel");
const Appointment = require("../Model/AddAppointmentsModel");

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find();
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance by student ID
exports.getAttendanceByStudentId = async (req, res) => {
    try {
        const attendance = await Attendance.find({ studentId: req.params.studentId });
        if (!attendance || attendance.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this student" });
        }
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance by instructor ID
exports.getAttendanceByInstructorId = async (req, res) => {
    try {
        const attendance = await Attendance.find({ instructorId: req.params.instructorId });
        if (!attendance || attendance.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this instructor" });
        }
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance by date range
exports.getAttendanceByDateRange = async (req, res) => {
    try {
        const startDate = new Date(req.params.startDate);
        const endDate = new Date(req.params.endDate);
        
        const attendance = await Attendance.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });
        
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new attendance record
exports.createAttendance = async (req, res) => {
    try {
        const newAttendance = new Attendance(req.body);
        const savedAttendance = await newAttendance.save();
        res.status(201).json(savedAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
    try {
        const updatedAttendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        res.status(200).json(updatedAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
    try {
        const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
        if (!deletedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        res.status(200).json({ message: "Attendance record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create attendance records from appointments
exports.createAttendanceFromAppointments = async (req, res) => {
    try {
        // Get instructor info from request body if provided
        const { instructorObjectId, instructorFormattedId, instructorName, filterByInstructor } = req.body;
        
        // Build query for appointments
        let query = { status: 'confirmed' };
        
        // If filtering by instructor is requested and instructor identifiers are provided
        if (filterByInstructor) {
            console.log('Filtering appointments by instructor:');
            console.log('- ObjectId:', instructorObjectId || 'not provided');
            console.log('- Formatted ID:', instructorFormattedId || 'not provided');
            console.log('- Instructor Name:', instructorName || 'not provided');
            
            // Create a list of conditions to match instructor
            const orConditions = [];
            
            // Add each filter condition if provided
            if (instructorObjectId) {
                orConditions.push({ instructorId: instructorObjectId });
            }
            
            if (instructorFormattedId) {
                orConditions.push({ formattedInstructorId: instructorFormattedId });
            }
            
            if (instructorName) {
                // Case-insensitive match for instructor name
                orConditions.push({ 
                    instructorName: { $regex: new RegExp(instructorName, 'i') }
                });
            }
            
            // If we have any conditions, add them to the query
            if (orConditions.length > 0) {
                query.$or = orConditions;
            }
        }
        
        // Get all matching confirmed appointments
        const appointments = await Appointment.find(query);
        
        if (!appointments || appointments.length === 0) {
            return res.status(200).json({
                message: "No confirmed appointments found to create attendance records from."
            });
        }
        
        console.log(`Found ${appointments.length} confirmed appointments for processing`);
        
        let created = 0;
        let alreadyExists = 0;
        let errors = 0;
        
        for (let appointment of appointments) {
            try {
                // Create a date object from the appointment date for comparison
                const appointmentDate = new Date(appointment.date);
                
                // Check if attendance record already exists for this student on this date
                const existingAttendance = await Attendance.findOne({
                    studentId: appointment.studentId,
                    date: { 
                        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
                        $lte: new Date(new Date(appointmentDate).setHours(23, 59, 59, 999))
                    }
                });
                
                if (!existingAttendance) {
                    // Prioritize formattedInstructorId for the instructorId field in Attendance
                    const instructorIdToUse = appointment.formattedInstructorId || 
                                             (appointment.instructorId ? String(appointment.instructorId) : '');
                    
                    // Create new attendance record with default 'Present' status
                    const newAttendance = new Attendance({
                        studentId: String(appointment.studentId),
                        studentName: appointment.studentName,
                        instructorId: instructorIdToUse, // Use formatted ID or string version of ObjectId
                        formattedInstructorId: appointment.formattedInstructorId || '', 
                        date: appointment.date,
                        status: 'Present', // Default status
                        notes: 'Automatically created from appointment'
                    });
                    
                    await newAttendance.save();
                    created++;
                } else {
                    alreadyExists++;
                }
            } catch (appointmentError) {
                console.error('Error processing appointment:', appointmentError);
                console.error('Appointment data:', JSON.stringify(appointment, null, 2));
                errors++;
            }
        }
        
        res.status(200).json({
            message: `Attendance records initialized. Created ${created} new records. ${alreadyExists} records already existed. ${errors} appointments had errors and were skipped.`
        });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ message: error.message });
    }
};