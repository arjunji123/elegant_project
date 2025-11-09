const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadProfilePic");
const { body, param, query, validationResult } = require('express-validator');

// List all users (search/filter)
// req: query: { search, is_verified }
// res: { success, data: [users] }
router.get('/admin/users', authMiddleware, [
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
router.get('/admin/users/:id', authMiddleware, [
  param('id').isInt()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.viewUserById);

// Edit user by id
// req: params: { id }, body: { name, email, phone }, file: profile_pic
// res: { success, message }
router.put('/admin/users/:id', authMiddleware, upload.single("profile_pic"), [
  param('id').isInt(),
  body('name').optional().isString(),
  body('email').optional().isEmail(),
  body('phone').optional().isString()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.editUserById);

// Delete user by id
// req: params: { id }
// res: { success, message }
router.delete('/admin/users/:id', authMiddleware, [
  param('id').isInt()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, adminUserController.deleteUserById);

module.exports = router;
