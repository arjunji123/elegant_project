const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createOrder, verifyPayment, getOrderById } = require('../controllers/orderController');


// ✅ Create a new order with full details
router.post("/orders", authMiddleware,createOrder);

// ✅ Verify payment after Razorpay success callback/webhook
router.post("/orders/verify", authMiddleware, verifyPayment);

// ✅ Get logged-in user orders
// router.get("/orders", authMiddleware, orderController.getUserOrders);

// ✅ Get single order details
router.get("/orders/:id", authMiddleware, getOrderById);

module.exports = router;
