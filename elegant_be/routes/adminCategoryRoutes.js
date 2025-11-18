const express = require('express');
const router = express.Router();
const adminCategoryController = require('../controllers/adminCategoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');
const uploadCategoryIcon = require('../middlewares/uploadCategoryIcon');

// List all categories
router.get('/admin/categories', authMiddleware, admin, adminCategoryController.listCategories);
// Get category detail
router.get('/admin/categories/:id', authMiddleware, admin, adminCategoryController.getCategoryDetail);
// Update category (with form data and icon upload)
router.put('/admin/categories/:id', authMiddleware, admin, uploadCategoryIcon.single('icon'), adminCategoryController.updateCategory);
// Delete category
router.delete('/admin/categories/:id', authMiddleware, admin, adminCategoryController.deleteCategory);

module.exports = router;
