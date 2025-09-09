
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


// Get Cart Items API
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // Step 1: Get all cart items with product info
    const [cartItems] = await db.query(
      `SELECT 
          c.id AS cart_id,
          c.product_id,
          c.quantity,
          c.color,
          c.size,
          p.name,
          p.price,
          p.description
       FROM cart c
       INNER JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Step 2: Collect product IDs
    const productIds = cartItems.map(item => item.product_id);

    // Step 3: Get all images for these products
    const [images] = await db.query(
      `SELECT product_id, image_url 
       FROM product_images 
       WHERE product_id IN (?)`,
      [productIds]
    );

    // Step 4: Map images by product_id
    let imagesMap = {};
    images.forEach(img => {
      if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
      imagesMap[img.product_id].push(img.image_url);
    });

    // Step 5: Attach images inside product object
    const finalCart = cartItems.map(item => ({
      cart_id: item.cart_id,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      product: {
        id: item.product_id,
        name: item.name,
        price: item.price,
        description: item.description,
        images: imagesMap[item.product_id] || []
      }
    }));

    res.json({ success: true, data: finalCart });

  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
