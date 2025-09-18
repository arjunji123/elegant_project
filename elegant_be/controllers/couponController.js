const db = require('../config/db');

/**
 * ✅ Admin - Create Coupon
 */
exports.createCoupon = async (req, res) => {
  const { title, description, discount_type, discount_value, condition_type, condition_value, start_date, end_date} = req.body;

  try {
    await db.query(
      `INSERT INTO coupons (title, description, discount_type, discount_value, condition_type, condition_value, start_date, end_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, discount_type, discount_value, condition_type, condition_value || null, start_date, end_date]
    );

    res.json({ success: true, message: 'Coupon created successfully' });
  } catch (error) {
    console.error('Create Coupon Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


/**
 * ✅ Admin - Get All Coupons
 */
exports.getAllCoupons = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM coupons WHERE is_active = 1`);
    res.json({ success: true, coupons: rows });
  } catch (error) {
    console.error('Get Coupons Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


/**
 * ✅ User - Get All Coupons with Status
 */
exports.getUserCoupons = async (req, res) => {
  const userId = req.user.id;

  try {
  const [coupons] = await db.query(`
      SELECT id, title, description, discount_type, discount_value,
             condition_type, condition_value,
             start_date
      FROM coupons
      WHERE is_active = 1
        AND start_date <= NOW()
        AND (end_date IS NULL OR end_date >= NOW())
    `);
        const [applied] = await db.query(
      `SELECT coupon_id, status FROM applied_coupons WHERE user_id = ?`,
      [userId]
    );

    // Map applied coupons to their status
    const appliedMap = {};
    applied.forEach(a => { appliedMap[a.coupon_id] = a.status; });

    const finalCoupons = coupons.map(c => ({
      ...c,
      user_status: appliedMap[c.id] || 'not_applied'
    }));

    res.json({ success: true, coupons: finalCoupons });
  } catch (error) {
    console.error('User Coupons Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


/**
 * ✅ User - Apply Coupon
 */
exports.applyCoupon = async (req, res) => {
  const userId = req.user.id;
  const { couponId } = req.body;

  try {
    // ✅ Check Coupon
  const [[coupon]] = await db.query(`
      SELECT *
      FROM coupons
      WHERE id = ?
        AND is_active = 1
        AND start_date <= NOW()
        AND (end_date IS NULL OR end_date >= NOW())
    `, [couponId]);
    
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon' });

    // ✅ Calculate Cart Subtotal
    const [[{ subtotal }]] = await db.query(`
      SELECT SUM(p.price * c.quantity) AS subtotal
      FROM cart c
      INNER JOIN products p ON p.id = c.product_id
      WHERE c.user_id = ?`,
      [userId]
    );

    if (!subtotal) return res.json({ success: false, message: 'Cart is empty' });

    // ✅ Check Conditions
    if (coupon.condition_type === 'first_order') {
      const [[{ orders_count }]] = await db.query(
        `SELECT COUNT(*) AS orders_count FROM orders WHERE user_id = ?`,
        [userId]
      );
      if (orders_count > 0)
        return res.json({ success: false, message: 'Coupon valid only for first order' });
    }

    if (coupon.condition_type === 'min_order' && subtotal < coupon.condition_value) {
      return res.json({ success: false, message: `Minimum order ₹${coupon.condition_value} required` });
    }

    // ✅ Calculate Discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
    } else {
      discountAmount = coupon.discount_value;
    }

    // ✅ Insert or Update Applied Coupon
    await db.query(
      `INSERT INTO applied_coupons (user_id, coupon_id, status)
       VALUES (?, ?, 'applied')
       ON DUPLICATE KEY UPDATE status='applied', applied_at=CURRENT_TIMESTAMP`,
      [userId, couponId]
    );

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      discount: discountAmount
    });
  } catch (error) {
    console.error('Apply Coupon Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


/**
 * ✅ User - Cart Summary (Subtotal, Discount, Delivery, Total)
 */
exports.getCartSummary = async (req, res) => {
  const userId = req.user.id;
  const DELIVERY_CHARGE = 20;

  try {
    // ✅ Subtotal
    const [[{ subtotal }]] = await db.query(`
      SELECT SUM(p.price * c.quantity) AS subtotal
      FROM cart c
      INNER JOIN products p ON p.id = c.product_id
      WHERE c.user_id = ?`,
      [userId]
    );

    const cartSubtotal = subtotal || 0;

    // ✅ Check if any coupon applied
    const [[applied]] = await db.query(`
      SELECT ac.coupon_id, c.discount_type, c.discount_value
      FROM applied_coupons ac
      INNER JOIN coupons c ON c.id = ac.coupon_id
      WHERE ac.user_id = ? AND ac.status = 'applied'
      ORDER BY ac.applied_at DESC LIMIT 1`,
      [userId]
    );

    let discount = 0;
    if (applied) {
      discount = applied.discount_type === 'percent'
        ? (cartSubtotal * applied.discount_value) / 100
        : applied.discount_value;
    }

    const total = Math.max(0, cartSubtotal - discount + DELIVERY_CHARGE);

    res.json({
      success: true,
      summary: {
        subtotal: cartSubtotal,
        coupon_discount: discount,
        delivery_charge: DELIVERY_CHARGE,
        total
      }
    });
  } catch (error) {
    console.error('Cart Summary Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};



/**
 * 🔍 Search Coupons by Any Keyword
 */
exports.searchCoupons = async (req, res) => {
  const { keyword } = req.query; // e.g. ?keyword=summer
  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({ success: false, message: "Keyword is required" });
  }

  try {
    const searchTerm = `%${keyword}%`; // partial match
    const [coupons] = await db.query(
      `SELECT id, title, description, discount_type, discount_value,
              condition_type, condition_value, start_date, end_date
       FROM coupons 
       WHERE 
         is_active = 1
         AND start_date <= NOW()
         AND (end_date IS NULL OR end_date >= NOW())
         AND (
           title LIKE ? OR
           description LIKE ? OR
           discount_type LIKE ? OR
           CAST(discount_value AS CHAR) LIKE ? OR
           CAST(condition_value AS CHAR) LIKE ?
         )
       ORDER BY start_date DESC`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    res.json({ success: true, coupons });
  } catch (error) {
    console.error("Search Coupons Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
