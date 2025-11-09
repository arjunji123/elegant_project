const db = require('../config/db');

/**
 * List All Orders (Admin)
 * @api {GET} /api/admin/orders
 * @apiQuery {Number} page (default: 1)
 * @apiQuery {Number} limit (default: 10)
 * Response:
 * {
 *   "success": true,
 *   "data": [...],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 10,
 *     "total": 100,
 *     "totalPages": 10
 *   }
 * }
 */
exports.listOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    // Get total count
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM orders');
    
    // Get paginated orders
    const [orders] = await db.query(`
      SELECT 
        o.id,
        o.user_id,
        u.name AS user_name,
        u.email AS user_email,
        o.subtotal,
        o.coupon_id,
        o.coupon_discount,
        o.delivery_fee,
        o.total_amount,
        o.status,
        o.payment_status,
        o.razorpay_order_id,
        o.razorpay_payment_id,
        o.address_snapshot,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [limitNum, offset]);

    // Get items count for each order
    const orderIds = orders.map(o => o.id);
    let itemsCountMap = {};
    
    if (orderIds.length > 0) {
      const [itemsCounts] = await db.query(`
        SELECT order_id, COUNT(*) as items_count
        FROM order_items
        WHERE order_id IN (?)
        GROUP BY order_id
      `, [orderIds]);
      
      itemsCounts.forEach(item => {
        itemsCountMap[item.order_id] = item.items_count;
      });
    }

    // Format response
    const data = orders.map(order => ({
      ...order,
      address: order.address_snapshot ? JSON.parse(order.address_snapshot) : null,
      items_count: itemsCountMap[order.id] || 0
    }));

    // Remove address_snapshot from response
    data.forEach(order => delete order.address_snapshot);

    res.json({ 
      success: true, 
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('List Orders Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get Order Detail by ID (Admin)
 * @api {GET} /api/admin/orders/:id
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "user_id": 5,
 *     "user_name": "John Doe",
 *     "user_email": "john@example.com",
 *     "subtotal": 2000,
 *     "coupon_discount": 100,
 *     "delivery_fee": 20,
 *     "total_amount": 1920,
 *     "status": "pending",
 *     "payment_status": "success",
 *     "razorpay_order_id": "order_xyz123",
 *     "razorpay_payment_id": "pay_abc456",
 *     "created_at": "2025-01-01T10:00:00.000Z",
 *     "address": { "street": "123 Main St", "city": "Mumbai" },
 *     "items": [
 *       {
 *         "id": 1,
 *         "product_id": 10,
 *         "product_name": "Formal T-Shirt",
 *         "image_url": "https://example.com/image.jpg",
 *         "quantity": 2,
 *         "price": 999,
 *         "size": "M",
 *         "color": "Black"
 *       }
 *     ]
 *   }
 * }
 */
exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch order details with user info
    const [orders] = await db.query(`
      SELECT 
        o.id,
        o.user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        o.subtotal,
        o.coupon_id,
        o.coupon_discount,
        o.delivery_fee,
        o.total_amount,
        o.status,
        o.payment_status,
        o.razorpay_order_id,
        o.razorpay_payment_id,
        o.razorpay_signature,
        o.address_snapshot,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE o.id = ?
    `, [id]);

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    // Fetch order items with product details
    const [items] = await db.query(`
      SELECT 
        oi.id,
        oi.product_id,
        p.name AS product_name,
        oi.image_url,
        oi.quantity,
        oi.price,
        oi.size,
        oi.color
      FROM order_items oi
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
    `, [id]);

    // Parse address snapshot
    order.address = order.address_snapshot ? JSON.parse(order.address_snapshot) : null;
    delete order.address_snapshot;

    // Add items to order
    order.items = items;

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Get Order Detail Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Update Order Status (Admin)
 * @api {PUT} /api/admin/orders/:id/status
 * Request Body:
 * {
 *   "status": "processing" // pending, processing, shipped, delivered, cancelled
 * }
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Check if order exists
    const [orders] = await db.query('SELECT id FROM orders WHERE id = ?', [id]);
    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update status
    await db.query('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
