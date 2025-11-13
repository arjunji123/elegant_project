const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadProfilePic");
const { body, param, query, validationResult } = require('express-validator');

// List all users (search/filter)
// req: query: { search, is_verified }
// res: { success, data: [users] }
const { admin } = require('../middlewares/authMiddleware');

router.get('/admin/users', authMiddleware, admin, [
  query('search').optional().isString(),
  query('is_verified').optional().isBoolean()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.listUsers);

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
