const db = require('../config/db');

// List all categories (with subcategories and pagination)
exports.listCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    // Get total count
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM categories');
    
    // Get paginated categories
    const [categories] = await db.query('SELECT * FROM categories ORDER BY created_at DESC LIMIT ? OFFSET ?', [limitNum, offset]);
    
    // Get all subcategories for these categories
    const categoryIds = categories.map(cat => cat.id);
    let subcategories = [];
    
    if (categoryIds.length > 0) {
      [subcategories] = await db.query('SELECT * FROM subcategories WHERE category_id IN (?)', [categoryIds]);
    }
    
    // Attach subcategories to each category
    const data = categories.map(cat => ({
      ...cat,
      subcategories: subcategories.filter(sub => sub.category_id === cat.id)
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

// Get category detail by id (with assigned subcategories)
exports.getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM categories WHERE id=?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Category not found' });
    const category = rows[0];
    const [subcategories] = await db.query('SELECT * FROM subcategories WHERE category_id=?', [id]);
    category.subcategories = subcategories;
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Update Category
 * @api {PUT} /api/admin/categories/:id
 * Example req.body:
 * {
 *   "name": "Electronics",
 *   "icon": "icon_url.png",
 *   "description": "All electronics",
 *   "subcategory_ids": [2, 3, 5]
 * }
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description, subcategory_ids } = req.body;
    await db.query('UPDATE categories SET name=?, icon=?, description=? WHERE id=?', [name, icon, description, id]);
    // Assign subcategories if provided
    if (Array.isArray(subcategory_ids)) {
      // Unassign all subcategories from this category first
      await db.query('UPDATE subcategories SET category_id=NULL WHERE category_id=?', [id]);
      // Assign only the selected subcategories to this category
      for (const subId of subcategory_ids) {
        await db.query('UPDATE subcategories SET category_id=? WHERE id=?', [id, subId]);
      }
    }
    res.json({ success: true, message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM categories WHERE id=?', [id]);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
