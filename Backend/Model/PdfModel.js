const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PdfSchema = new Schema({
    courseName: {
        type: String,
        required: true,
    },
    instructorName: {
        type: String,
        required: true,
    },
    instructorId: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileData: {
        type: Buffer,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
    }
});

module.exports = mongoose.model("Pdf", PdfSchema);
