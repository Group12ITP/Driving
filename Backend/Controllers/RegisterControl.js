const Register = require("../Model/Register");
const mongoose = require("mongoose");

// Helper function to generate the next student ID
const generateNextStudentId = async () => {
    try {
        // Find the last registered user
        const lastUser = await Register.findOne().sort({ studentId: -1 });
        
        if (!lastUser || !lastUser.studentId) {
            return "DS0001"; // If no users exist, start with DS0001
        }
        
        // Extract the number part and increment it
        const lastNumber = parseInt(lastUser.studentId.replace("DS", ""));
        const nextNumber = lastNumber + 1;
        
        // Format the new ID with leading zeros
        return `DS${nextNumber.toString().padStart(4, "0")}`;
    } catch (error) {
        console.error("Error generating student ID:", error);
        throw error;
    }
};

// Get all registered users
const getAllRegisteredUsers = async (req, res) => {
    try {
        const users = await Register.find();
        console.log("Found users:", users);
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Error fetching users" });
    }
};

// Get user by ID
const getRegisteredUserById = async (req, res) => {
    try {
        const user = await Register.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user" });
    }
};

// Register new user
const registerUser = async (req, res) => {
    console.log("Registration attempt with data:", req.body);
    
    try {
        // Check if user with same email already exists
        const existingUser = await Register.findOne({ gmail: req.body.gmail });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Email already registered",
                error: "Email already exists"
            });
        }

        // Generate the next student ID
        const studentId = await generateNextStudentId();

        // Create new user with the generated studentId
        const newUser = new Register({
            ...req.body,
            studentId: studentId
        });
        console.log("New user object created:", newUser);

        // Save to database
        const savedUser = await newUser.save();
        console.log("User saved to database:", savedUser);

        // Return success response
        return res.status(201).json({
            message: "Registration successful",
            user: savedUser
        });
    } catch (error) {
        console.error("Registration error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Email already registered",
                error: "Email already exists"
            });
        }
        return res.status(500).json({ 
            message: "Registration failed", 
            error: error.message 
        });
    }
};

// Update user
const updateRegisteredUser = async (req, res) => {
    try {
        const user = await Register.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating user" });
    }
};

// Delete user
const deleteRegisteredUser = async (req, res) => {
    try {
        const user = await Register.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting user" });
    }
};

module.exports = {
    getAllRegisteredUsers,
    getRegisteredUserById,
    registerUser,
    updateRegisteredUser,
    deleteRegisteredUser
}; 