const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const orderController = require("../controllers/orderController");


// ✅ Create a new order with full details
router.post("/orders", authMiddleware, orderController.createOrder);

// ✅ Verify payment after Razorpay success callback/webhook
router.post("/orders/verify", authMiddleware, orderController.verifyPayment);

// ✅ Get logged-in user orders
// router.get("/orders", authMiddleware, orderController.getUserOrders);

// ✅ Get single order details
router.get("/orders/:id", authMiddleware, orderController.getOrderById);

module.exports = router;
