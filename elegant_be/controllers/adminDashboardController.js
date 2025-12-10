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

/**
 * @api {get} /admin/earnings-analytics Get earnings data for charts
 * @apiQuery {String} period - 'today' | 'week' | 'month'
 * @apiSuccess {Object} Chart data with labels and values
 * @apiDescription Returns time-series data for Chart.js
 * - today: hourly breakdown (24 hours)
 * - week: daily breakdown (7 days)
 * - month: daily breakdown (30 days)
 */
exports.getEarningsAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let query, labels = [], data = [];

    if (period === 'today') {
      // Hourly data for today (0-23 hours)
      query = `
        SELECT 
          HOUR(created_at) AS hour,
          IFNULL(SUM(total_amount), 0) AS earnings
        FROM orders
        WHERE DATE(created_at) = CURDATE()
          AND payment_status = 'completed'
        GROUP BY HOUR(created_at)
        ORDER BY hour
      `;
      const [rows] = await db.query(query);
      
      // Fill all 24 hours
      const hourMap = {};
      rows.forEach(row => hourMap[row.hour] = parseFloat(row.earnings));
      
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        data.push(hourMap[i] || 0);
      }

    } else if (period === 'week') {
      // Daily data for last 7 days
      query = `
        SELECT 
          DATE(created_at) AS date,
          DAYNAME(created_at) AS day_name,
          IFNULL(SUM(total_amount), 0) AS earnings
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
          AND payment_status = 'completed'
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
      const [rows] = await db.query(query);
      
      // Fill last 7 days
      const dateMap = {};
      rows.forEach(row => dateMap[row.date] = { earnings: parseFloat(row.earnings), day: row.day_name });
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        labels.push(dateMap[dateStr]?.day || dayName);
        data.push(dateMap[dateStr]?.earnings || 0);
      }

    } else if (period === 'month') {
      // Daily data for current month
      query = `
        SELECT 
          DAY(created_at) AS day,
          IFNULL(SUM(total_amount), 0) AS earnings
        FROM orders
        WHERE YEAR(created_at) = YEAR(CURDATE())
          AND MONTH(created_at) = MONTH(CURDATE())
          AND payment_status = 'completed'
        GROUP BY DAY(created_at)
        ORDER BY day
      `;
      const [rows] = await db.query(query);
      
      // Fill all days of current month
      const dayMap = {};
      rows.forEach(row => dayMap[row.day] = parseFloat(row.earnings));
      
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(`Day ${i}`);
        data.push(dayMap[i] || 0);
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid period. Use: today, week, or month' });
    }

    // Calculate totals
    const totalEarnings = data.reduce((sum, val) => sum + val, 0);
    const avgEarnings = data.length > 0 ? totalEarnings / data.length : 0;

    return res.status(200).json({
      success: true,
      period,
      data: {
        labels,
        earnings: data,
        total: parseFloat(totalEarnings.toFixed(2)),
        average: parseFloat(avgEarnings.toFixed(2))
      }
    });

  } catch (err) {
    console.error('Earnings analytics error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};
