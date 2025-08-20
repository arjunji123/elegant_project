import db from "../config/db.js";

// /products?category_id=1&subcategory_id=2&min_price=100&max_price=500&sort=newest
// controllers/productController.js




export const getFilteredProducts = async (req, res) => {
  try {
    let { category_id, subcategory_id, min_price, max_price, sort } = req.query;

    // default values agar frontend na bheje
    category_id = category_id || null;
    subcategory_id = subcategory_id || null;
    min_price = min_price || 0;
    max_price = max_price || 99999999;
    sort = sort || "price_low_high";

    let query = "SELECT * FROM products WHERE 1=1";
    let params = [];

    if (category_id) {
      query += " AND category_id = ?";
      params.push(category_id);
    }

    if (subcategory_id) {
      query += " AND subcategory_id = ?";
      params.push(subcategory_id);
    }

    query += " AND price BETWEEN ? AND ?";
    params.push(min_price, max_price);

    // sorting
    if (sort === "price_low_high") {
      query += " ORDER BY price ASC";
    } else if (sort === "price_high_low") {
      query += " ORDER BY price DESC";
    } else if (sort === "latest") {
      query += " ORDER BY created_at DESC";
    }

    const [rows] = await db.query(query, params);

    res.json({
      success: true,
      filters: {
        category_id,
        subcategory_id,
        min_price,
        max_price,
        sort,
      },
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};









//////////////////////////////////////////////////////////////////

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, unit, category_id, subcategory_id, images } = req.body;

    // Step 1: Insert product
    const [productResult] = await db.query(
      `INSERT INTO products (name, description, price, unit, category_id, subcategory_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, unit, category_id, subcategory_id]
    );

    const productId = productResult.insertId;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product not created" });
    }

    // Step 2: Insert images (if provided)
    if (images && images.length > 0) {
      const imageValues = images.map(img => [productId, img]); // [ [productId, 'url1'], [productId, 'url2'] ]

      await db.query(
        `INSERT INTO product_images (product_id, image_url) VALUES ?`,
        [imageValues]
      );
    }

    res.json({ success: true, message: "Product created successfully", productId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get All Products
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name, s.name AS subcategory_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Product by ID
export const getProductById =  async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db.query(
      `SELECT p.id, p.name, p.description, p.unit, p.price, p.created_at
       FROM products p
       WHERE p.id = ?`, [id]
    );

    if (!product.length) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const [images] = await db.query(
      `SELECT image_url, is_banner FROM product_images WHERE product_id = ?`, [id]
    );

    res.json({
      success: true,
      data: {
        ...product[0],
        images
      }
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, unit, category_id, subcategory_id, image } = req.body;
    await db.query(
      `UPDATE products SET name=?, description=?, price=?, unit=?, category_id=?, subcategory_id=?, image=? WHERE id=?`,
      [name, description, price, unit, category_id, subcategory_id, image, req.params.id]
    );
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await db.query(`DELETE FROM products WHERE id=?`, [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM products WHERE category_id = ?`,
      [req.params.categoryId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Products by SubCategory
export const getProductsBySubCategory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM products WHERE subcategory_id = ?`,
      [req.params.subcategoryId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
