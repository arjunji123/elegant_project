const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const { admin, default: authMiddleware } = require('../middlewares/authMiddleware');

// List all orders
router.get('/admin/orders', authMiddleware, admin, adminOrderController.listOrders);

// Get order detail by ID
router.get('/admin/orders/:id', authMiddleware, admin, adminOrderController.getOrderDetail);

// Update order status
router.put('/admin/orders/:id/status', authMiddleware, admin, adminOrderController.updateOrderStatus);

module.exports = router;
