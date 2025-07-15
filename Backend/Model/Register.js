const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    name: String,
    gmail: { type: String, unique: true },
    password: String,
    age: Number,
    gender: String,
    address: String,
    phoneNumber: String,
    studentId: { type: String, required: false }
});

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;