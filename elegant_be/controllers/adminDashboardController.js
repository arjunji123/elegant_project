const db = require("../config/db");

/**
 * @api {get} /admin/dashboard Dashboard stats for charts
 * @apiSuccess {Object} stats
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "success": true,
 *   "data": {
 *     "activeUsers": 123,
 *     "totalOrders": 456,
 *     "earningToday": 7890,
 *     "earningWeek": 12345,
 *     "earningMonth": 67890,
 *     "extra": { ... }
 *   }
 * }
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Total active users (is_verified = true)
    const [[{ activeUsers }]] = await db.query('SELECT COUNT(*) AS activeUsers FROM users WHERE is_verified = 1');
    // Total orders
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');
    // Total earning today
    const [[{ earningToday }]] = await db.query("SELECT IFNULL(SUM(total_amount),0) AS earningToday FROM orders WHERE DATE(created_at) = CURDATE()");
    // Total earning this week
    const [[{ earningWeek }]] = await db.query("SELECT IFNULL(SUM(total_amount),0) AS earningWeek FROM orders WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)");
    // Total earning this month
    const [[{ earningMonth }]] = await db.query("SELECT IFNULL(SUM(total_amount),0) AS earningMonth FROM orders WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())");
    // Extra: total products, total categories
    const [[{ totalProducts }]] = await db.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[{ totalCategories }]] = await db.query('SELECT COUNT(*) AS totalCategories FROM categories');
    // Send all stats for dashboard
    return res.status(200).json({
      success: true,
      data: {
        activeUsers,
        totalOrders,
        earningToday,
        earningWeek,
        earningMonth,
        totalProducts,
        totalCategories
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};
