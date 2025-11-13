const express = require('express');
const router = express.Router();
const adminSubcategoryController = require('../controllers/adminSubcategoryController');
const { admin, default: authMiddleware } = require('../middlewares/authMiddleware');

// List all subcategories
router.get('/admin/subcategories', authMiddleware, admin, adminSubcategoryController.listSubcategories);
// Get subcategory detail
router.get('/admin/subcategories/:id', authMiddleware, admin, adminSubcategoryController.getSubcategoryDetail);
// Update subcategory
router.put('/admin/subcategories/:id', authMiddleware, admin, adminSubcategoryController.updateSubcategory);
// Delete subcategory
router.delete('/admin/subcategories/:id', authMiddleware, admin, adminSubcategoryController.deleteSubcategory);

module.exports = router;
