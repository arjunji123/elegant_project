const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/generateToken');

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email=? AND is_admin=1', [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid credentials or not admin' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user.id);
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};