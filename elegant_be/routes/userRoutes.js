
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/upload");

module.exports = router;

router.get('/user/:id', authMiddleware,userController.getUserById);
router.put('/user/:id',authMiddleware, upload.single("profile_pic"), userController.updateUserById);

module.exports = router;
