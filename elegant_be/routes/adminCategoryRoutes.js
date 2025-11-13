const express = require('express');
const router = express.Router();
const adminCategoryController = require('../controllers/adminCategoryController');
const { admin, default: authMiddleware } = require('../middlewares/authMiddleware');

// List all categories
router.get('/admin/categories', authMiddleware, admin, adminCategoryController.listCategories);
// Get category detail
router.get('/admin/categories/:id', authMiddleware, admin, adminCategoryController.getCategoryDetail);
// Update category
router.put('/admin/categories/:id', authMiddleware, admin, adminCategoryController.updateCategory);
// Delete category
router.delete('/admin/categories/:id', authMiddleware, admin, adminCategoryController.deleteCategory);

module.exports = router;
