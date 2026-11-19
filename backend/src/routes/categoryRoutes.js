const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, authorizeRole('ADMIN'), createCategory);

router.route('/:id')
  .put(protect, authorizeRole('ADMIN'), updateCategory)
  .patch(protect, authorizeRole('ADMIN'), updateCategory)
  .delete(protect, authorizeRole('ADMIN'), deleteCategory);

module.exports = router;
