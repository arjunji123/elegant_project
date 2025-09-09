const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/cart/add", authMiddleware, cartController.addToCart);
router.get("/cart", authMiddleware, cartController.getCart);
router.patch("/cart/update", authMiddleware, cartController.updateCartQuantity);
router.delete("/cart/:cartId", authMiddleware, cartController.deleteCartItem);

module.exports = router;
