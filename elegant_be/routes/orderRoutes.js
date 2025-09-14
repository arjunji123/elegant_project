const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createOrder, verifyPayment, getOrders } = require('../controllers/orderController');


// ✅ Create a new order with full details
router.post("/orders", authMiddleware,createOrder);

// ✅ Verify payment after Razorpay success callback/webhook
router.post("/orders/verify", authMiddleware, verifyPayment);

// ✅ Get single order details
router.get("/orders/:id", authMiddleware, getOrders);

module.exports = router;
