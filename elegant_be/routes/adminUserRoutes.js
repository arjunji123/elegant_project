const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadProfilePic");
const { body, param, query, validationResult } = require('express-validator');

// List all users (search/filter)
// req: query: { search, is_verified, is_admin, page, limit }
// res: { success, data: [users], pagination }
const  admin  = require('../middlewares/adminMiddleware');

router.get('/admin/users', authMiddleware, admin, [
  query('search').optional().isString(),
  query('is_verified').optional().isString(),
  query('is_admin').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.listUsers);

// Create new user manually (Admin only)
// req: body: { name, email, phone, password, is_verified?, is_admin? }
// res: { success, message, data: user }
router.post('/admin/users/create', authMiddleware, admin, [
  body('name').notEmpty().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').notEmpty().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('is_verified').optional().isBoolean().withMessage('is_verified must be boolean'),
  body('is_admin').optional().isBoolean().withMessage('is_admin must be boolean')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
}, adminUserController.createUser);

// View user by id
// req: params: { id }
// res: { success, data: user }
router.get('/admin/users/:id', authMiddleware, admin, [
  param('id').isInt()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.viewUserById);

// Edit user by id
// req: params: { id }, body: { name, email, phone }, file: profile_pic
// res: { success, message }
router.put('/admin/users/:id', authMiddleware, admin, upload.single("profile_pic"), [
  param('id').isInt(),
  body('name').optional().isString(),
  body('email').optional().isEmail(),
  body('phone').optional().isString()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.editUserById);


// Update user is_verified status (admin only)
// req: params: { id }, body: { is_verified }
// res: { success, message, user_id, is_verified }
router.put('/admin/users/:id/status', authMiddleware, admin, [
  param('id').isInt(),
  body('is_verified').isBoolean()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.updateUserStatus);

// Delete user by id
// req: params: { id }
// res: { success, message }
router.delete('/admin/users/:id', authMiddleware, admin, [
  param('id').isInt()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.deleteUserById);

module.exports = router;
