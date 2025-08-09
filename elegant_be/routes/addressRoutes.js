const express = require('express');
const router = express.Router();
const { addAddress, getAddresses, updateAddress, deleteAddress } = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/address', authMiddleware, addAddress);
router.get('/addresses', authMiddleware, getAddresses);
router.put('/address/:id', authMiddleware, updateAddress);
router.delete('/address/:id', authMiddleware, deleteAddress);

module.exports = router;
