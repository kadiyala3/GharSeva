const express = require('express');
const router = express.Router();
const { getDashboardStats, verifyProvider, getUsers, updateUserStatus, getComplaints, updateComplaintStatus } = require('../controllers/adminController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorizeRole('ADMIN'), getDashboardStats);
router.get('/users', protect, authorizeRole('ADMIN'), getUsers);
router.put('/users/:id/status', protect, authorizeRole('ADMIN'), updateUserStatus);
router.patch('/users/:id/status', protect, authorizeRole('ADMIN'), updateUserStatus);
router.put('/providers/:id/verify', protect, authorizeRole('ADMIN'), verifyProvider);
router.patch('/providers/:id/verify', protect, authorizeRole('ADMIN'), verifyProvider);
router.get('/complaints', protect, authorizeRole('ADMIN'), getComplaints);
router.put('/complaints/:id', protect, authorizeRole('ADMIN'), updateComplaintStatus);
router.patch('/complaints/:id', protect, authorizeRole('ADMIN'), updateComplaintStatus);

module.exports = router;
