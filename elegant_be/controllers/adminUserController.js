const db = require("../config/db");
const bcrypt = require('bcryptjs');

// Update user is_verified status (admin only)
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { is_verified } = req.body;
  try {
    await db.query('UPDATE users SET is_verified=? WHERE id=?', [is_verified ? 1 : 0, id]);
    res.json({ success: true, message: 'User status updated', user_id: id, is_verified });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const { body, validationResult, query, param } = require('express-validator');

/**
 * @api {get} /admin/users List all users (search/filter with pagination)
 * @apiQuery {String} search (optional) - Search by name, email, or phone
 * @apiQuery {String} is_verified (optional) - Filter by verification status: 'true', 'false', or 'all'
 * @apiQuery {String} is_admin (optional) - Filter by admin status: 'true', 'false', or 'all'
 * @apiQuery {Number} page (default: 1)
 * @apiQuery {Number} limit (default: 10)
 * @apiSuccess {Array} users
 * @apiSuccess {Object} pagination
 */
exports.listUsers = async (req, res) => {
  try {
    const { search = '', is_verified, is_admin, page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;
    
    let sql = 'SELECT id, name, email, phone, profile_pic, is_verified, is_admin, created_at FROM users WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    let params = [];
    let countParams = [];
    
    // Search filter
    if (search && search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      countSql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Verification status filter
    if (is_verified !== undefined && is_verified !== 'all') {
      const verifiedValue = is_verified === 'true' || is_verified === '1' ? 1 : 0;
      sql += ' AND is_verified = ?';
      countSql += ' AND is_verified = ?';
      params.push(verifiedValue);
      countParams.push(verifiedValue);
    }
    
    // Admin status filter
    if (is_admin !== undefined && is_admin !== 'all') {
      const adminValue = is_admin === 'true' || is_admin === '1' ? 1 : 0;
      sql += ' AND is_admin = ?';
      countSql += ' AND is_admin = ?';
      params.push(adminValue);
      countParams.push(adminValue);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    
    // Get total count
    const [countResult] = await db.query(countSql, countParams);
    const total = countResult[0].total;
    
    // Get paginated data
    const [rows] = await db.query(sql, [...params, limitNum, offset]);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Users listed successfully', 
      data: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

/**
 * @api {get} /admin/users/:id View user by ID
 * @apiParam {Number} id
 * @apiSuccess {Object} user
 */
exports.viewUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, profile_pic, is_verified, created_at FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('View user error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * @api {put} /admin/users/:id Edit user by ID
 * @apiParam {Number} id
 * @apiParam {String} name
 * @apiParam {String} email
 * @apiParam {String} phone
 * @apiParam {File} profile_pic (optional)
 * @apiSuccess {Object} updated user fields
 */
exports.editUserById = async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone } = req.body;
  const profile_pic = req.file ? req.file.path : null;
  try {
    let query = 'UPDATE users SET name = ?, email = ?, phone = ?, updated_at = NOW()';
    let params = [name, email, phone];
    if (profile_pic) {
      query += ', profile_pic = ?';
      params.push(profile_pic);
    }
    query += ' WHERE id = ?';
    params.push(userId);
    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found or no changes made' });
    return res.status(200).json({ success: true, message: 'User updated', user_id: userId });
  } catch (err) {
    console.error('Edit user error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * @api {delete} /admin/users/:id Delete user by ID
 * @apiParam {Number} id
 * @apiSuccess {String} message
 */
exports.deleteUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    // Delete related records in all tables referencing user_id
    await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM orders WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM addresses WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM user_otps WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM auth_tokens WHERE user_id = ?', [userId]);
    // Add more tables as needed
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

/**
 * @api {post} /admin/users/create Create new user manually (Admin)
 * @apiBody {String} name - User's full name (required)
 * @apiBody {String} email - Valid email address (required, unique)
 * @apiBody {String} phone - 10-digit phone number (required, unique)
 * @apiBody {String} password - Minimum 6 characters (required)
 * @apiBody {Boolean} is_verified - Verification status (optional, default: true)
 * @apiBody {Boolean} is_admin - Admin status (optional, default: false)
 * @apiSuccess {Object} Created user data
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, is_verified = true, is_admin = false } = req.body;

    // Validation checks
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone must be 10 digits' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const [emailCheck] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Check if phone already exists
    const [phoneCheck] = await db.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (phoneCheck.length > 0) {
      return res.status(400).json({ success: false, message: 'Phone number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users (name, email, phone, password, is_verified, is_admin, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [name, email, phone, hashedPassword, is_verified ? 1 : 0, is_admin ? 1 : 0]
    );

    const userId = result.insertId;

    // Fetch created user (without password)
    const [[newUser]] = await db.query(
      'SELECT id, name, email, phone, is_verified, is_admin, created_at FROM users WHERE id = ?',
      [userId]
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });

  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};
