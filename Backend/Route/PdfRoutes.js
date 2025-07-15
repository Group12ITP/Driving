const express = require('express');
const router = express.Router();
const {
    uploadPdf,
    getAllPdfs,
    getPdfsByInstructor,
    getPdfsByCourse,
    downloadPdf,
    deletePdf
} = require('../Controllers/PdfController');

// Route to upload a PDF
router.post('/upload', uploadPdf);

// Route to get all PDFs (without file data)
router.get('/', getAllPdfs);

// Route to get PDFs by instructor ID
router.get('/instructor/:instructorId', getPdfsByInstructor);

// Route to get PDFs by course name
router.get('/course/:courseName', getPdfsByCourse);

// Route to download a specific PDF
router.get('/download/:id', downloadPdf);

// Route to delete a specific PDF
router.delete('/:id', deletePdf);

module.exports = router;
