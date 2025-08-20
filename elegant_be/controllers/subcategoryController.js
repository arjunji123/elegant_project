const db = require('../config/db');

// Create Subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { category_id, name, description } = req.body;
    const [result] = await db.query(
      "INSERT INTO subcategories (category_id, name, description) VALUES (?, ?, ?)",
      [category_id, name, description]
    );
    res.json({ success: true, id: result.insertId, message: "Subcategory created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Subcategories by Category
exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM subcategories WHERE category_id=?",
      [categoryId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await db.query(
      "UPDATE subcategories SET name=?, description=? WHERE id=?",
      [name, description, id]
    );
    res.json({ success: true, message: "Subcategory updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM subcategories WHERE id=?", [id]);
    res.json({ success: true, message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
