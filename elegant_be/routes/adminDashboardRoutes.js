const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Dashboard stats API for charts/graphs
// req: headers: { Authorization: Bearer token }
// res: { success, data: { counts } }
router.get('/admin/dashboard', authMiddleware, adminDashboardController.getDashboardStats);

module.exports = router;
