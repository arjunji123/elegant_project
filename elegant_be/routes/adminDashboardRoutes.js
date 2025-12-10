const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

// Dashboard stats API for charts/graphs
// req: headers: { Authorization: Bearer token }
// res: { success, data: { counts } }
router.get('/admin/dashboard', authMiddleware, admin, adminDashboardController.getDashboardStats);

// Earnings analytics for Chart.js (time-series data)
// req: query: { period: 'today' | 'week' | 'month' }
// res: { success, period, data: { labels, earnings, total, average } }
router.get('/admin/earnings-analytics', authMiddleware, admin, adminDashboardController.getEarningsAnalytics);

module.exports = router;
