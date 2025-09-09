
const db = require('../config/db');


// Add to Cart
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, size, color } = req.body;

  try {
    // Default quantity = 1
    const quantity = 1;

    // Insert new row (no merging, even if same product but diff size/color)
    await db.query(
      `INSERT INTO cart (user_id, product_id, size, color, quantity) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, productId, size, color, quantity]
    );

    res.json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


// Get Cart
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const [cartItems] = await db.query(
      `SELECT c.id AS cart_id, c.product_id, c.size, c.color, c.quantity, 
              p.name, p.price
       FROM cart c
       INNER JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json({ success: true, cart: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Update Quantity
exports.updateCartQuantity = async (req, res) => {
  const userId = req.user.id;
  const { cartId, quantity } = req.body;

  try {
    await db.query(
      `UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?`,
      [quantity, cartId, userId]
    );

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Delete from Cart
exports.deleteCartItem = async (req, res) => {
  const userId = req.user.id;
  const { cartId } = req.params;

  try {
    await db.query(
      `DELETE FROM cart WHERE id = ? AND user_id = ?`,
      [cartId, userId]
    );

    res.json({ success: true, message: "Product removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
