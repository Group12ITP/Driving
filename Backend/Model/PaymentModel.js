const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'PayPal', 'Other'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded', 'Partially Paid'],
        default: 'Pending'
    },
    courseId: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    paymentDescription: {
        type: String
    },
    transactionId: {
        type: String
    },
    receiptNumber: {
        type: String
    },
    paymentPeriod: {
        type: String,
    },
    discountApplied: {
        type: Number,
        default: 0
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    createdBy: {
        type: String
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "PaymentModel",
    paymentSchema
); 