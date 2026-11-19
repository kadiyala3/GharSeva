const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getConversations);

router.route('/:id/messages')
  .get(protect, getMessages)
  .post(protect, sendMessage);

module.exports = router;
