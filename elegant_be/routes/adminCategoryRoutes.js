const express = require('express');
const router = express.Router();
const adminCategoryController = require('../controllers/adminCategoryController');
const authMiddleware = require('../middlewares/authMiddleware');

// List all categories
router.get('/admin/categories', authMiddleware, adminCategoryController.listCategories);
// Get category detail
router.get('/admin/categories/:id', authMiddleware, adminCategoryController.getCategoryDetail);
// Update category
router.put('/admin/categories/:id', authMiddleware, adminCategoryController.updateCategory);
// Delete category
router.delete('/admin/categories/:id', authMiddleware, adminCategoryController.deleteCategory);

module.exports = router;
