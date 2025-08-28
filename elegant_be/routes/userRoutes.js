
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadProfilePic");


router.get('/user', authMiddleware,userController.getUserById);
router.put('/user',authMiddleware, upload.single("profile_pic"), userController.updateUserById);

module.exports = router;
