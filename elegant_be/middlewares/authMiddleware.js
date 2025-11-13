// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid format' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// Admin middleware: checks if user is admin
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

module.exports = authMiddleware;
module.exports.admin = admin;
