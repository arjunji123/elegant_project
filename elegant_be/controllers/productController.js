
const db = require('../config/db');


exports.getFilteredProducts = async (req, res) => {
  try {
    let { category_id, subcategory_id, min_price, max_price, sort } = req.query;

    // default values agar frontend na bheje
    category_id = category_id || null;
    subcategory_id = subcategory_id || null;
    min_price = min_price || 0;
    max_price = max_price || 99999999;
    sort = sort || "";

    let query = `
      SELECT p.*, 
             c.name AS category_name, 
             s.name AS subcategory_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      WHERE 1=1
    `;
        let params = [];

     if (category_id && category_id !== "all" && category_id !== "newest") {
      query += " AND p.category_id = ?";
      params.push(category_id);
    }

if (subcategory_id) {
      query += " AND p.subcategory_id = ?";
      params.push(subcategory_id);
    }

    query += " AND p.price BETWEEN ? AND ?";
    params.push(min_price, max_price);

    // sorting
  if (category_id === "newest" || sort === "newest") {
      query += " ORDER BY p.created_at DESC"; // newest first
    } else if (sort === "price_low_high") {
      query += " ORDER BY p.price ASC";
    } else if (sort === "price_high_low") {
      query += " ORDER BY p.price DESC";
    } else if (sort === "oldest") {
      query += " ORDER BY p.created_at ASC";
    } else {
      query += " ORDER BY p.id ASC"; // default case
    }

    const [rows] = await db.query(query, params);

    res.status(200).json({
      success: true,
      total_products: rows.length,
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
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, unit, category_id, subcategory_id, images, sizes, colors} = req.body;

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

    // Step 3: Insert sizes
    if (sizes && sizes.length > 0) {
      const sizeValues = sizes.map(size => [productId, size]);
      await db.query(
        `INSERT INTO product_sizes (product_id, size) VALUES ?`,
        [sizeValues]
      );
    }

    // Step 4: Insert colors
    if (colors && colors.length > 0) {
      const colorValues = colors.map(color => [productId, color.name, color.code]);
      await db.query(
        `INSERT INTO product_colors (product_id, color_name, color_code) VALUES ?`,
        [colorValues]
      );
    }
    res.json({ success: true, message: "Product created successfully", productId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name, s.name AS subcategory_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
    `);
  res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db.query(
      `SELECT 
         p.id, 
         p.name, 
         p.description, 
         p.unit, 
         p.price, 
         p.created_at,
         p.category_id,
         c.name AS category_name,
         p.subcategory_id,
         sc.name AS subcategory_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       WHERE p.id = ?`, 
      [id]
    );

    if (!product.length) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const [images] = await db.query(
      `SELECT image_url, is_banner 
       FROM product_images 
       WHERE product_id = ?`, 
      [id]
    );

      const [colors] = await db.query(
      `SELECT color_name, color_code
       FROM product_colors 
       WHERE product_id = ?`, 
      [id]
    );
       // Sizes
    const [sizes] = await db.query(
      `SELECT size 
       FROM product_sizes 
       WHERE product_id = ?`, 
      [id]
    );

  
    res.json({
      success: true,
      data: {
        ...product[0],
        images,
          colors,
         sizes: sizes.map(s => s.size)      }
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update Product
exports.updateProduct = async (req, res) => {
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
exports.deleteProduct = async (req, res) => {
  try {
    await db.query(`DELETE FROM products WHERE id=?`, [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Products by Category
exports.getProductsByCategory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM products WHERE category_id = ?`,
      [req.params.categoryId]
    );
   res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Products by SubCategory
exports.getProductsBySubCategory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM products WHERE subcategory_id = ?`,
      [req.params.subcategoryId]
    );
   res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getNewestProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name, s.name AS subcategory_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      ORDER BY p.created_at DESC 
    `);

   res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};






//////////////////////////////////////////////////////



exports.postWishlistAddOrRemove = async (req, res) => {
        const userId = req.user.id;

 const { product_id } = req.body;

  try {
    // check if already in wishlist
    const [exists] = await db.query(
      `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?`,
      [userId, product_id]
    );

    if (exists.length > 0) {
      // remove
      await db.query(
        `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`,
        [userId, product_id]
      );
      return res.json({ success: true, message: "Removed from wishlist" });
    } else {
      // add
      await db.query(
        `INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)`,
        [userId, product_id]
      );
      return res.json({ success: true, message: "Added to wishlist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

exports.getWishlist = async (req, res) => {
        const userId = req.user.id;

  try {
  const [rows] = await db.query(
  `SELECT 
      p.id, 
      p.name, 
      p.price, 
      pi.image_url AS image
   FROM wishlist w
   INNER JOIN products p ON w.product_id = p.id
   LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_banner = 1
   WHERE w.user_id = ?`,
  [userId]
);

    res.json({ success: true, products: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}


exports.checkWishlist = async (req, res) => {
          const userId = req.user.id;

 const { product_id } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?`,
      [userId, product_id]
    );

    res.json({ inWishlist: rows.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }}


  //////////////////////////////////////////////


  // Search Products
exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required"
      });
    }

    const searchTerm = `%${keyword}%`;

    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name, s.name AS subcategory_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.name LIKE ? 
         OR p.description LIKE ? 
         OR c.name LIKE ? 
         OR s.name LIKE ?
    `, [searchTerm, searchTerm, searchTerm, searchTerm]);

    res.status(200).json({
      success: true,
      message: rows.length > 0 ? "Products found" : "No products found",
      data: rows
    });

  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
