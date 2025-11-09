const db = require('../config/db');

// List all subcategories (with category info and pagination)
exports.listSubcategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    // Get total count
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM subcategories');
    
    // Get paginated subcategories
    const [subcategories] = await db.query('SELECT * FROM subcategories ORDER BY created_at DESC LIMIT ? OFFSET ?', [limitNum, offset]);
    
    // Get all categories
    const [categories] = await db.query('SELECT * FROM categories');
    
    // Attach category info to each subcategory
    const data = subcategories.map(sub => ({
      ...sub,
      category: categories.find(cat => cat.id === sub.category_id) || null
    }));
    
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
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get subcategory detail by id (with assigned category)
exports.getSubcategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM subcategories WHERE id=?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    const subcategory = rows[0];
    if (subcategory.category_id) {
      const [catRows] = await db.query('SELECT * FROM categories WHERE id=?', [subcategory.category_id]);
      subcategory.category = catRows[0] || null;
    }
    res.json({ success: true, data: subcategory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Update Subcategory
 * @api {PUT} /api/admin/subcategories/:id
 * Example req.body:
 * {
 *   "name": "Smartphones",
 *   "description": "Mobile phones",
 *   "category_id": 1
 * }
 */
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id } = req.body;
    await db.query('UPDATE subcategories SET name=?, description=?, category_id=? WHERE id=?', [name, description, category_id, id]);
    res.json({ success: true, message: 'Subcategory updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Unassign products from this subcategory
    await db.query('UPDATE products SET subcategory_id=NULL WHERE subcategory_id=?', [id]);
    // Delete cart items for products in this subcategory
    await db.query('DELETE cart FROM cart INNER JOIN products ON cart.product_id = products.id WHERE products.subcategory_id=?', [id]);
    // Now delete the subcategory
    await db.query('DELETE FROM subcategories WHERE id=?', [id]);
    res.json({ success: true, message: 'Subcategory deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
