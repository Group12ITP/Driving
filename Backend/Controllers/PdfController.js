const PdfModel = require('../Model/PdfModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
}).single('pdfFile');

// Upload PDF
const uploadPdf = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ 
                success: false, 
                message: err.message 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        try {
            const { courseName, instructorName, instructorId, description } = req.body;
            
            if (!courseName || !instructorName || !instructorId) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const newPdf = new PdfModel({
                courseName,
                instructorName,
                instructorId,
                fileName: req.file.originalname,
                fileData: req.file.buffer,
                fileType: req.file.mimetype,
                description: description || ''
            });

            await newPdf.save();
            
            res.status(201).json({
                success: true,
                message: 'PDF uploaded successfully',
                pdf: {
                    id: newPdf._id,
                    courseName: newPdf.courseName,
                    instructorName: newPdf.instructorName,
                    fileName: newPdf.fileName,
                    uploadDate: newPdf.uploadDate
                }
            });
        } catch (error) {
            console.error('Error in uploadPdf:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to upload PDF',
                error: error.message
            });
        }
    });
};

// Get all PDFs
const getAllPdfs = async (req, res) => {
    try {
        const pdfs = await PdfModel.find({}, {
            fileData: 0 // Exclude the actual file data
        });
        
        res.status(200).json({
            success: true,
            count: pdfs.length,
            pdfs
        });
    } catch (error) {
        console.error('Error in getAllPdfs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve PDFs',
            error: error.message
        });
    }
};

// Get PDFs by instructor ID
const getPdfsByInstructor = async (req, res) => {
    try {
        const { instructorId } = req.params;
        
        const pdfs = await PdfModel.find({ instructorId }, {
            fileData: 0 // Exclude the actual file data
        });
        
        res.status(200).json({
            success: true,
            count: pdfs.length,
            pdfs
        });
    } catch (error) {
        console.error('Error in getPdfsByInstructor:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve PDFs by instructor',
            error: error.message
        });
    }
};

// Get PDFs by course name
const getPdfsByCourse = async (req, res) => {
    try {
        const { courseName } = req.params;
        
        const pdfs = await PdfModel.find({ courseName }, {
            fileData: 0 // Exclude the actual file data
        });
        
        res.status(200).json({
            success: true,
            count: pdfs.length,
            pdfs
        });
    } catch (error) {
        console.error('Error in getPdfsByCourse:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve PDFs by course',
            error: error.message
        });
    }
};

// Download PDF
const downloadPdf = async (req, res) => {
    try {
        const { id } = req.params;
        
        const pdf = await PdfModel.findById(id);
        
        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: 'PDF not found'
            });
        }
        
        res.set({
            'Content-Type': pdf.fileType,
            'Content-Disposition': `attachment; filename="${pdf.fileName}"`,
        });
        
        res.send(pdf.fileData);
    } catch (error) {
        console.error('Error in downloadPdf:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to download PDF',
            error: error.message
        });
    }
};

// Delete PDF
const deletePdf = async (req, res) => {
    try {
        const { id } = req.params;
        
        const pdf = await PdfModel.findByIdAndDelete(id);
        
        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: 'PDF not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'PDF deleted successfully'
        });
    } catch (error) {
        console.error('Error in deletePdf:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete PDF',
            error: error.message
        });
    }
};

module.exports = {
    uploadPdf,
    getAllPdfs,
    getPdfsByInstructor,
    getPdfsByCourse,
    downloadPdf,
    deletePdf
};
