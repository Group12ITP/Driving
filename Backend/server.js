const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const userRoute = require("./Route/UserRoutes");
const insRoutes = require('./Route/InsRoutes');
const studentRoute = require("./Route/StudentRoutes");

const instructorRoute = require("./Route/InstructorRoutes");
const feedbackRoute = require("./Route/feedbackRoutes");

const paymentRoute = require("./Route/PaymentRoutes");
const messageRoute = require("./Route/MessageRoutes");
const appointmentRoutes = require('./Route/AddAppointmentsRouter');
const progressRoutes = require('./Route/ProgressRoutes');
const attendanceRoutes = require('./Route/attendanceRoutes');
const instructorCredentialsRoutes = require('./Route/InstructorCredentialsRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use(userRoute);
app.use(studentRoute);

app.use(instructorRoute);
app.use(feedbackRoute);

app.use(paymentRoute);
app.use(messageRoute);
app.use(insRoutes);
app.use('/api/appointments', appointmentRoutes); // Changed route path to avoid conflicts
app.use('/api/progress', progressRoutes); // Added progress routes
app.use('/api/attendance', attendanceRoutes); // Added attendance routes
app.use(instructorCredentialsRoutes); // Added instructor credentials routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 