const express = require('express');
const router = express.Router();
const { getProviders, getProviderById, updateProviderProfile, getProviderAvailability, saveProviderAvailability } = require('../controllers/providerController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', getProviders);
router.post('/availability', protect, authorizeRole('PROVIDER'), saveProviderAvailability);
router.get('/:id/availability', getProviderAvailability);
router.get('/:id', getProviderById);
router.put('/profile', protect, authorizeRole('PROVIDER'), updateProviderProfile);

module.exports = router;
