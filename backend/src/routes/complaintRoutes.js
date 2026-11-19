const express = require('express');
const router = express.Router();
const { createComplaint, getMyComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createComplaint);

router.route('/my')
  .get(protect, getMyComplaints);

module.exports = router;
