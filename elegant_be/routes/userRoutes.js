
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/user/:id', authMiddleware,userController.getUserById);
router.put('/user/:id',authMiddleware, userController.updateUserById);

module.exports = router;
