const express = require('express');
const router = express.Router();
const { addAddress, getAddresses, updateAddress, deleteAddress, getAddressesByUserId } = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/addresses', authMiddleware, getAddressesByUserId);

router.post('/address', authMiddleware, addAddress);
router.get('/addresses', authMiddleware, getAddresses);
router.put('/address/:id', authMiddleware, updateAddress);
router.delete('/address/:id', authMiddleware, deleteAddress);

module.exports = router;
