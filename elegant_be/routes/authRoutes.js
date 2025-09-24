const express = require('express');
const router = express.Router();
const { register, login, verifyOtp, resendMobileOtp, forgotPassword, verifyForgotOtp, resetPassword, verifyMobileOtp} = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendMobileOtp);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-otp', verifyForgotOtp);
router.post('/reset-password', resetPassword);
router.post('/verify-mobile-otp',verifyMobileOtp);

module.exports = router;
