
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadProfilePic = require('../middlewares/uploadProfilePic');

module.exports = router;

router.get('/user/:id', authMiddleware,userController.getUserById);
router.put('/user/:id',authMiddleware, uploadProfilePic.single("profile_pic"), userController.updateUserById);

module.exports = router;
