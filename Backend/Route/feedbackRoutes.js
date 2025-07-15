const express = require('express');
const router = express.Router();
const feedbackController = require('../Controllers/feedbackController');

router.get('/', feedbackController.getAllFeedback);


router.post('/', feedbackController.addFeedback);


router.put('/:id', feedbackController.updateFeedback);


router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;