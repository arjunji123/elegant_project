const express = require('express');
const router = express.Router();
const adminSubcategoryController = require('../controllers/adminSubcategoryController');
const authMiddleware = require('../middlewares/authMiddleware');

// List all subcategories
router.get('/admin/subcategories', authMiddleware, adminSubcategoryController.listSubcategories);
// Get subcategory detail
router.get('/admin/subcategories/:id', authMiddleware, adminSubcategoryController.getSubcategoryDetail);
// Update subcategory
router.put('/admin/subcategories/:id', authMiddleware, adminSubcategoryController.updateSubcategory);
// Delete subcategory
router.delete('/admin/subcategories/:id', authMiddleware, adminSubcategoryController.deleteSubcategory);

module.exports = router;
