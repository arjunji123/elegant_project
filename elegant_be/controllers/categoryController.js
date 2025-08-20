const db = require('../config/db');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name,icon, description } = req.body;
    const [result] = await db.query(
      "INSERT INTO categories (name,icon, description) VALUES (?,?, ?)",
      [name,icon, description]
    );
    res.json({ success: true, id: result.insertId, message: "Category created" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,icon, description } = req.body;
    await db.query(
      "UPDATE categories SET name=?, icon = ?, description=? WHERE id=?",
      [name,icon, description, id]
    );
    res.json({ success: true, message: "Category updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM categories WHERE id=?", [id]);
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

  
  
  exports.categoryWithSubCategory = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    const [subcategories] = await db.query('SELECT * FROM subcategories');

    // Nest subcategories inside categories
    const data = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      discription: cat.description,
      subcategories: subcategories.filter(sub => sub.category_id === cat.id)
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};