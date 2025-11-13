const express = require('express');
const router = express.Router();
const adminProductController = require('../controllers/adminProductController');
const authMiddleware = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

// List all products
router.get('/admin/products', authMiddleware, admin, adminProductController.listProducts);
// Get product detail
router.get('/admin/products/:id', authMiddleware, admin, adminProductController.getProductDetail);
// Create product
router.post('/admin/products', authMiddleware, admin, adminProductController.createProduct);
// Update product
router.put('/admin/products/:id', authMiddleware, admin, adminProductController.updateProduct);
// Delete product
router.delete('/admin/products/:id', authMiddleware, admin, adminProductController.deleteProduct);
module.exports = router;
