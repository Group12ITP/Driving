const express = require("express");
const router = express.Router();
const RegisterController = require("../Controllers/RegisterControl");

// Registration routes
router.post("/", RegisterController.registerUser);
router.get("/", RegisterController.getAllRegisteredUsers);
router.get("/:id", RegisterController.getRegisteredUserById);
router.put("/:id", RegisterController.updateRegisteredUser);
router.delete("/:id", RegisterController.deleteRegisteredUser);

module.exports = router; 