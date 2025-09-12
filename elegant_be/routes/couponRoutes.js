const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const couponController = require('../controllers/couponController');

// ✅ Admin APIs
router.post('/coupons', couponController.createCoupon);            // Add new coupon
router.get('/coupons', couponController.getAllCoupons);            // Get all coupons

// ✅ User APIs
router.get('/user/coupons', authMiddleware, couponController.getUserCoupons);   // All coupons + applied status
router.post('/apply-coupon', authMiddleware, couponController.applyCoupon);     // Apply coupon to cart
router.get('/cart/summary', authMiddleware, couponController.getCartSummary);   // Get subtotal + discount + delivery + total

module.exports = router;
