const express = require('express');
const router = express.Router();
const { getServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { getCategories } = require('../controllers/categoryController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.get('/categories', getCategories);

router.route('/')
  .get(getServices)
  .post(protect, authorizeRole('ADMIN'), createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, authorizeRole('ADMIN'), updateService)
  .patch(protect, authorizeRole('ADMIN'), updateService)
  .delete(protect, authorizeRole('ADMIN'), deleteService);

module.exports = router;
