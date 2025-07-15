const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        unique: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate a unique transaction ID before saving
paymentSchema.pre('save', function(next) {
    if (!this.transactionId) {
        this.transactionId = 'TXN' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    next();
});

// Add indexes for better query performance
paymentSchema.index({ studentId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentDate: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 