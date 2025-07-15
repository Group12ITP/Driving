const Schedule = require('../Model/SheduleModel');

// Create a new schedule
exports.createSchedule = async (req, res) => {
    try {
        console.log("Create schedule request body:", req.body);
        
        const schedule = new Schedule(req.body);
        
        // Try to validate before saving
        const validationError = schedule.validateSync();
        if (validationError) {
            console.error("Validation error:", validationError);
            return res.status(400).json({
                success: false,
                message: Object.values(validationError.errors).map(e => e.message).join(', ')
            });
        }
        
        const newSchedule = await schedule.save();
        console.log("Schedule created:", newSchedule);
        
        res.status(201).json({
            success: true,
            data: newSchedule,
            message: 'Lesson has been scheduled successfully'
        });
    } catch (error) {
        console.error("Error creating schedule:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().sort({ date: 1, startTime: 1 });
        res.status(200).json({
            success: true,
            count: schedules.length,
            data: schedules
        });
    } catch (error) {
        console.error("Error getting all schedules:", error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get schedules by instructor ID
exports.getSchedulesByInstructor = async (req, res) => {
    try {
        const instructorId = req.params.instructorId;
        console.log("Getting schedules for instructor:", instructorId);
        
        const schedules = await Schedule.find({ instructorId }).sort({ date: 1, startTime: 1 });
        
        res.status(200).json({
            success: true,
            count: schedules.length,
            data: schedules
        });
    } catch (error) {
        console.error("Error getting instructor schedules:", error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get schedule by ID
exports.getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }
        res.status(200).json({
            success: true,
            data: schedule
        });
    } catch (error) {
        console.error("Error getting schedule by ID:", error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
    try {
        console.log("Update schedule request body:", req.body);
        
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        console.log("Schedule updated:", schedule);
        
        res.status(200).json({
            success: true,
            data: schedule,
            message: 'Schedule has been updated successfully'
        });
    } catch (error) {
        console.error("Error updating schedule:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);
        
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Schedule has been deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get schedules by date range
exports.getSchedulesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        console.log("Getting schedules for date range:", startDate, "to", endDate);
        
        const schedules = await Schedule.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: 1, startTime: 1 });

        res.status(200).json({
            success: true,
            count: schedules.length,
            data: schedules
        });
    } catch (error) {
        console.error("Error getting schedules by date range:", error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update schedule status
exports.updateScheduleStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        console.log("Updating schedule status to:", status);
        
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        res.status(200).json({
            success: true,
            data: schedule,
            message: `Schedule status has been updated to ${status}`
        });
    } catch (error) {
        console.error("Error updating schedule status:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
