const db = require("../config/db");
const { body, validationResult, query, param } = require('express-validator');

/**
 * @api {get} /admin/users List all users (search/filter with pagination)
 * @apiQuery {String} search (optional)
 * @apiQuery {String} is_verified (optional)
 * @apiQuery {Number} page (default: 1)
 * @apiQuery {Number} limit (default: 10)
 * @apiSuccess {Array} users
 * @apiSuccess {Object} pagination
 */
exports.listUsers = async (req, res) => {
  const { search = '', is_verified, page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  
  let sql = 'SELECT id, name, email, phone, profile_pic, is_verified, created_at FROM users WHERE 1=1';
  let countSql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
  let params = [];
  
  if (search) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    countSql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (is_verified !== undefined) {
    sql += ' AND is_verified = ?';
    countSql += ' AND is_verified = ?';
    params.push(is_verified === 'true' ? 1 : 0);
  }
  
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  
  try {
    // Get total count
    const [countResult] = await db.query(countSql, params);
    const total = countResult[0].total;
    
    // Get paginated data
    const [rows] = await db.query(sql, [...params, limitNum, offset]);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Users listed', 
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
    return res.status(500).json({ success: false, message: 'Internal server error' });
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
