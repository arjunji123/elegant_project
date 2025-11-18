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
 * Update Category (Form Data Support)
 * @api {PUT} /api/admin/categories/:id
 * Form Data Fields:
 * - name: string
 * - description: string
 * - subcategory_ids: JSON string [2, 3, 5]
 * - icon: file (optional)
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Extract form data
    const name = req.body.name || '';
    const description = req.body.description || '';
    
    // Get uploaded icon URL (if file uploaded)
    let iconUrl = null;
    if (req.file) {
      iconUrl = req.file.path; // Cloudinary URL
    }
    
    // Parse subcategory_ids if provided
    let subcategory_ids = [];
    if (req.body.subcategory_ids) {
      try {
        subcategory_ids = JSON.parse(req.body.subcategory_ids);
      } catch (e) {
        console.log('Subcategory IDs parsing error:', e.message);
      }
    }
    
    console.log('Update category request:', { id, name, description, iconUrl, subcategory_ids });
    
    // Update category (only update icon if new file uploaded)
    if (iconUrl) {
      await db.query('UPDATE categories SET name=?, icon=?, description=? WHERE id=?', [name, iconUrl, description, id]);
    } else {
      await db.query('UPDATE categories SET name=?, description=? WHERE id=?', [name, description, id]);
    }
    
    // Assign subcategories if provided
    if (Array.isArray(subcategory_ids) && subcategory_ids.length > 0) {
      // Unassign all subcategories from this category first
      await db.query('UPDATE subcategories SET category_id=NULL WHERE category_id=?', [id]);
      // Assign only the selected subcategories to this category
      for (const subId of subcategory_ids) {
        await db.query('UPDATE subcategories SET category_id=? WHERE id=?', [id, subId]);
      }
    }
    
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (err) {
    console.error('Update category error:', err);
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
