const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');

// List all orders
router.get('/admin/orders', adminOrderController.listOrders);

// Get order detail by ID
router.get('/admin/orders/:id', adminOrderController.getOrderDetail);

// Update order status
router.put('/admin/orders/:id/status', adminOrderController.updateOrderStatus);

module.exports = router;
