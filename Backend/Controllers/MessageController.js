const MessageModel = require("../Model/MessageModel");

// Get all messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find();
        return res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get a specific message by ID
exports.getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await MessageModel.findById(id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get all messages for a specific student
exports.getMessagesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        const messages = await MessageModel.find({ studentId }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Add a new message
exports.addMessage = async (req, res) => {
    try {
        const { message, studentId, name, email } = req.body;
        
        if (!message || !studentId || !name) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: message, studentId, and name"
            });
        }
        
        const newMessage = new MessageModel({
            message,
            studentId,
            name,
            email: email || ""
        });
        
        await newMessage.save();
        
        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Update a message (add response)
exports.respondToMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;
        
        if (!response) {
            return res.status(400).json({
                success: false,
                message: "Please provide a response"
            });
        }
        
        const message = await MessageModel.findById(id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }
        
        message.response = response;
        message.status = 'Answered';
        message.updatedAt = Date.now();
        
        await message.save();
        
        return res.status(200).json({
            success: true,
            message: "Response added successfully",
            data: message
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await MessageModel.findByIdAndDelete(id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get count of pending messages
exports.getPendingMessagesCount = async (req, res) => {
    try {
        const count = await MessageModel.countDocuments({ status: 'Pending' });
        
        return res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}; 