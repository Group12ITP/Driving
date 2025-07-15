const mongoose = require('mongoose');  // Require mongoose first
const Schema = mongoose.Schema;  // Then define Schema

const AddcourseSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    duration: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Addcourse", AddcourseSchema); // Model name should be singular and capitalized