const express = require("express");
const cors = require("cors");
const attendanceRoutes = require('./Route/attendanceRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes - only include attendance routes for testing
app.use('/api/attendance', attendanceRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'Test route is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

// Starting the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Test server is running on port ${PORT}`);
}); 