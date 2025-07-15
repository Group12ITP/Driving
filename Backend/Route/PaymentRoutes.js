const express = require("express");
const router = express.Router();
const PaymentController = require("../Controllers/PaymentController");

// Basic CRUD operations
router.get("/", PaymentController.getAllPayments);
router.post("/", PaymentController.addPayment);
router.get("/:id", PaymentController.getPaymentById);
router.put("/:id", PaymentController.updatePayment);
router.delete("/:id", PaymentController.deletePayment);

// Additional specialized routes
router.get("/student/:studentId", PaymentController.getPaymentsByStudentId);
router.get("/status/:status", PaymentController.getPaymentsByStatus);

module.exports = router; 