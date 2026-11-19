const express = require('express');
const router = express.Router();
const { createPayment, getPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createPayment);

router.route('/:id')
  .get(protect, getPayment);

module.exports = router;
