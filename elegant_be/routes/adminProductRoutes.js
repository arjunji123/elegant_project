const express = require('express');
const router = express.Router();
const adminProductController = require('../controllers/adminProductController');
const authMiddleware = require('../middlewares/authMiddleware');

// List all products
router.get('/admin/products', authMiddleware, adminProductController.listProducts);
// Get product detail
router.get('/admin/products/:id', authMiddleware, adminProductController.getProductDetail);
// Create product
router.post('/admin/products', authMiddleware, adminProductController.createProduct);
// Update product
router.put('/admin/products/:id', authMiddleware, adminProductController.updateProduct);
// Delete product
router.delete('/admin/products/:id', authMiddleware, adminProductController.deleteProduct);

module.exports = router;
