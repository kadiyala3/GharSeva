const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getProviderBookings, updateBookingStatus, getAllBookings, getBookingById, deleteBooking } = require('../controllers/bookingController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRole('ADMIN'), getAllBookings);
router.post('/', protect, authorizeRole('CUSTOMER'), createBooking);
router.get('/my', protect, authorizeRole('CUSTOMER'), getMyBookings);
router.get('/provider', protect, authorizeRole('PROVIDER'), getProviderBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, authorizeRole('PROVIDER', 'ADMIN'), updateBookingStatus);
router.patch('/:id/status', protect, authorizeRole('PROVIDER', 'ADMIN'), updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
