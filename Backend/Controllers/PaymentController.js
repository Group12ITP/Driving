const Payment = require("../Model/PaymentModel");
const { v4: uuidv4 } = require('uuid');

// Get all payments
const getAllPayments = async (req, res, next) => {
    let payments;

    try {
        payments = await Payment.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }

    if (!payments || payments.length === 0) {
        return res.status(404).json({ message: "No payments found" });
    }

    return res.status(200).json({ payments });
};

// Add a new payment
const addPayment = async (req, res, next) => {
    const {
        paymentId,
        studentId,
        studentName,
        email,
        amount,
        currency,
        dueDate,
        paymentMethod,
        status,
        courseId,
        courseName,
        paymentDescription,
        transactionId,
        receiptNumber,
        paymentPeriod,
        discountApplied,
        taxAmount,
        totalAmount,
        createdBy
    } = req.body;

    // Generate a unique payment ID only if one is not provided
    const finalPaymentId = paymentId || `PAY-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Generate receipt number if not provided
    const finalReceiptNumber = receiptNumber || `RCPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let payment;

    try {
        payment = new Payment({
            paymentId: finalPaymentId,
            studentId,
            studentName,
            email,
            amount,
            currency: currency || 'USD',
            paymentDate: new Date(),
            dueDate,
            paymentMethod,
            status: status || 'Pending',
            courseId,
            courseName,
            paymentDescription,
            transactionId,
            receiptNumber: finalReceiptNumber,
            paymentPeriod,
            discountApplied: discountApplied || 0,
            taxAmount: taxAmount || 0,
            totalAmount,
            createdBy
        });

        await payment.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to add payment", error: err.message });
    }

    if (!payment) {
        return res.status(404).json({ message: "Unable to add payment" });
    }
    
    return res.status(201).json({ payment });
};

// Get payment by ID
const getPaymentById = async (req, res, next) => {
    const id = req.params.id;

    let payment;

    try {
        payment = await Payment.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }

    if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
    }
    
    return res.status(200).json({ payment });
};

// Update payment
const updatePayment = async (req, res, next) => {
    const id = req.params.id;
    const updatedData = req.body;

    let payment;

    try {
        payment = await Payment.findByIdAndUpdate(
            id,
            { ...updatedData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to update payment", error: err.message });
    }

    if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
    }
    
    return res.status(200).json({ payment });
};

// Delete payment
const deletePayment = async (req, res, next) => {
    const id = req.params.id;

    let payment;

    try {
        payment = await Payment.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }

    if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
    }
    
    return res.status(200).json({ message: "Payment successfully deleted", payment });
};

// Get payments by student ID
const getPaymentsByStudentId = async (req, res, next) => {
    const studentId = req.params.studentId;

    let payments;

    try {
        payments = await Payment.find({ studentId: studentId });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }

    if (!payments || payments.length === 0) {
        return res.status(404).json({ message: "No payments found for this student" });
    }
    
    return res.status(200).json({ payments });
};

// Get payments by status
const getPaymentsByStatus = async (req, res, next) => {
    const status = req.params.status;

    let payments;

    try {
        payments = await Payment.find({ status });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }

    if (!payments || payments.length === 0) {
        return res.status(404).json({ message: `No payments with status '${status}' found` });
    }
    
    return res.status(200).json({ payments });
};

// Export all controller functions
exports.getAllPayments = getAllPayments;
exports.addPayment = addPayment;
exports.getPaymentById = getPaymentById;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;
exports.getPaymentsByStudentId = getPaymentsByStudentId;
exports.getPaymentsByStatus = getPaymentsByStatus; 