const express = require('express');
const router = express.Router();
const {
    getAllInstructorCredentials,
    getInstructorCredential,
    createInstructorCredential,
    updateInstructorCredential,
    deleteInstructorCredential
} = require('../Controllers/InstructorCredentialsController');

// Routes for instructor credentials
router.route('/')
    .get(getAllInstructorCredentials)
    .post(createInstructorCredential);

router.route('/:id')
    .get(getInstructorCredential)
    .put(updateInstructorCredential)
    .delete(deleteInstructorCredential);

module.exports = router; 