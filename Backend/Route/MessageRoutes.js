const express = require("express");
const router = express.Router();
const MessageController = require("../Controllers/MessageController");

// Get all messages
router.get("/", MessageController.getAllMessages);

// Get a specific message by ID
router.get("/:id", MessageController.getMessageById);

// Get all messages for a specific student
router.get("/student/:studentId", MessageController.getMessagesByStudentId);

// Add a new message
router.post("/", MessageController.addMessage);

// Update a message (add response)
router.put("/respond/:id", MessageController.respondToMessage);

// Delete a message
router.delete("/:id", MessageController.deleteMessage);

// Get count of pending messages
router.get("/pending/count", MessageController.getPendingMessagesCount);

module.exports = router; 