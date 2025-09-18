// controllers/orders.js
const Razorpay = require("razorpay");

const crypto = require("crypto");

const db = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// exports.createOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { address_id, coupon_id } = req.body;

//     // 1️⃣ Subtotal
//     const [[{ subtotal }]] = await db.query(`
//       SELECT SUM(p.price * c.quantity) AS subtotal
//       FROM cart c
//       INNER JOIN products p ON p.id = c.product_id
//       WHERE c.user_id = ?`,
//       [userId]
//     );
//     if (!subtotal) return res.status(400).json({ success:false, message:"Cart is empty" });

//     // 2️⃣ Coupon
//     let couponDiscount = 0;
//     if (coupon_id) {
//       const [[coupon]] = await db.query(
//         `SELECT * FROM coupons WHERE id=? AND is_active=1`,
//         [coupon_id]
//       );
//       if (coupon) {
//         couponDiscount =
//           coupon.discount_type === 'percent'
//             ? (subtotal * coupon.discount_value) / 100
//             : coupon.discount_value;
//       }
//     }

//     const deliveryFee = 20;
//     const totalAmount = subtotal - couponDiscount + deliveryFee;

//     // 3️⃣ Create Razorpay Order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(totalAmount * 100), // paise
//       currency: "INR",
//       receipt: `order_rcpt_${Date.now()}`
//     });

//     // 4️⃣ Insert Order
//     const [orderResult] = await db.query(
//       `INSERT INTO orders
//          (user_id, subtotal, coupon_id, coupon_discount, delivery_fee,
//           total_amount, payment_status, razorpay_order_id, address_id)
//        VALUES (?,?,?,?,?,?,?,?,?)`,
//       [
//         userId,
//         subtotal,
//         coupon_id || null,
//         couponDiscount,
//         deliveryFee,
//         totalAmount,
//         "pending",
//         razorpayOrder.id,
//         address_id
//       ]
//     );

//     const orderId = orderResult.insertId;

//     // 5️⃣ Insert Order Items
//     const [cartItems] = await db.query(`
//       SELECT c.product_id,c.quantity,p.price,c.size,c.color,
//              (SELECT image_url FROM product_images WHERE product_id=p.id LIMIT 1) AS image_url
//       FROM cart c
//       INNER JOIN products p ON p.id=c.product_id
//       WHERE c.user_id=?`,
//       [userId]
//     );

//     const values = cartItems.map(item => [
//       orderId,
//       item.product_id,
//       item.quantity,
//       item.price,
//       item.size,
//       item.color,
//       item.image_url
//     ]);

//     if (values.length) {
//       await db.query(
//         `INSERT INTO order_items
//          (order_id, product_id, quantity, price, size, color, image_url)
//          VALUES ?`,
//         [values]
//       );
//     }

//     res.json({
//       success: true,
//       razorpayOrderId: razorpayOrder.id,
//       amount: totalAmount,
//       currency: "INR"
//     });
//   } catch (err) {
//     console.error("Create Order Error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };



exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address_id, coupon_id } = req.body;

    // 1️⃣ Subtotal
    const [[{ subtotal }]] = await db.query(`
      SELECT SUM(p.price * c.quantity) AS subtotal
      FROM cart c
      INNER JOIN products p ON p.id = c.product_id
      WHERE c.user_id = ?`,
      [userId]
    );
    if (!subtotal)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    // 2️⃣ Fetch Address Snapshot
    const [[address]] = await db.query(
      `SELECT * FROM addresses WHERE id=? AND user_id=?`,
      [address_id, userId]
    );
    if (!address)
      return res.status(400).json({ success: false, message: "Invalid address" });

    const addressSnapshot = JSON.stringify(address);

    // 3️⃣ Coupon Discount
    let couponDiscount = 0;
    if (coupon_id) {
      const [[coupon]] = await db.query(
        `SELECT * FROM coupons WHERE id=? AND is_active=1`,
        [coupon_id]
      );
      if (coupon) {
        couponDiscount =
          coupon.discount_type === "percent"
            ? (subtotal * coupon.discount_value) / 100
            : coupon.discount_value;
      }
    }

    const deliveryFee = 20;
    const totalAmount = subtotal - couponDiscount + deliveryFee;

    // 4️⃣ Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`
    });

    // 5️⃣ Insert Order
    const [orderResult] = await db.query(
      `INSERT INTO orders
       (user_id, subtotal, coupon_id, coupon_discount, delivery_fee,
        total_amount, payment_status, razorpay_order_id, address_snapshot)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        userId,
        subtotal,
        coupon_id || null,
        couponDiscount,
        deliveryFee,
        totalAmount,
        "pending",
        razorpayOrder.id,
        addressSnapshot
      ]
    );
    const orderId = orderResult.insertId;

    // 6️⃣ Insert Order Items
    const [cartItems] = await db.query(`
      SELECT c.product_id, c.quantity, p.price, c.size, c.color,
             (SELECT image_url FROM product_images WHERE product_id=p.id LIMIT 1) AS image_url
      FROM cart c
      INNER JOIN products p ON p.id=c.product_id
      WHERE c.user_id=?`,
      [userId]
    );

    const values = cartItems.map(item => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
      item.size,
      item.color,
      item.image_url
    ]);

    if (values.length) {
      await db.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price, size, color, image_url)
         VALUES ?`,
        [values]
      );
    }

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR"
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 🟢 Generate Signature Server Side
 const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Update Order
    await db.query(
      `UPDATE orders
       SET payment_status='success',
           razorpay_payment_id=?,
           razorpay_signature=?
                  WHERE razorpay_order_id=? AND user_id=?`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id, userId]
    );

    // Clear User Cart
    await db.query(`DELETE FROM cart WHERE user_id=?`, [userId]);

    res.json({ success:true, message:"Payment verified & order placed" });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ success:false, message:"Server Error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT id, total_amount, subtotal, coupon_discount,
              delivery_fee, status, payment_status,
              razorpay_order_id, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    for (let order of orders) {
      const [items] = await db.query(
        `SELECT product_id, quantity, price, size, color, image_url
         FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success:true, orders });
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ success:false, message:"Server Error" });
  }
};

/**
 * ✅ Get User Orders with Product Details
 */
exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    // ✅ Fetch all paid orders of the user
    const [orders] = await db.query(
      `SELECT 
          o.id AS order_id,
          o.subtotal,
          o.coupon_id,
          o.coupon_discount,
          o.delivery_fee,
          o.total_amount,
          o.payment_status,
          o.razorpay_order_id,
          o.address_snapshot,
          o.created_at
       FROM orders o
       WHERE o.user_id = ? AND o.payment_status = 'success'
       ORDER BY o.created_at DESC`,
      [userId]
    );

    if (!orders.length) {
      return res.json({ success: true, orders: [] });
    }

    // ✅ Get all order IDs
    const orderIds = orders.map(o => o.order_id);

    // ✅ Fetch order items with product name
    const [items] = await db.query(
      `SELECT 
          oi.order_id,
          oi.product_id,
          p.name AS product_name,
          oi.image_url,
          oi.size,
          oi.color,
          oi.quantity,
          oi.price
       FROM order_items oi
       INNER JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (?)
       ORDER BY oi.order_id DESC`,
      [orderIds]
    );

    // ✅ Map products to orders
    const orderMap = {};
    orders.forEach(order => {
      orderMap[order.order_id] = {
        ...order,
        address: JSON.parse(order.address_snapshot || "{}"), // parse snapshot
        products: []
      };
      delete orderMap[order.order_id].address_snapshot; // remove raw snapshot
    });

    items.forEach(item => {
      orderMap[item.order_id].products.push({
        product_id: item.product_id,
        name: item.product_name,
        image: item.image_url, // ✅ snapshot image
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      });
    });

    const finalOrders = Object.values(orderMap);

    res.json({ success: true, orders: finalOrders });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
