const db = require('../config/db');
const admin = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT is_admin FROM users WHERE id=?', [req.user.id]);
    if (!rows.length || rows[0].is_admin !== 1) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = admin;