
const db = require('../config/db');


exports.getFilteredProducts = async (req, res) => {
  const userId = req.user.id;

  try {
    let { category_id, subcategory_id, min_price, max_price, sort, limit, offset } = req.query;

    // default values agar frontend na bheje
    category_id = category_id || null;
    subcategory_id = subcategory_id || null;
    min_price = min_price || 0;
    max_price = max_price || 99999999;
    sort = sort || "";
 limit = parseInt(limit) || 10;   // default 10
    offset = parseInt(offset) || 0;  // default 0

    let query = `
      SELECT p.*, 
             c.name AS category_name, 
             s.name AS subcategory_name,
             CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END AS is_wishlist
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN wishlist w ON w.product_id = p.id AND w.user_id = ?
      WHERE 1=1
    `;
    let params = [userId];

 if (category_id && category_id !== "all" && category_id !== "newest") {
  if (Array.isArray(category_id)) {
    // Already array h to directly push kar do
    query += ` AND p.category_id IN (?)`;
    params.push(category_id);
  } else if (typeof category_id === "string" && category_id.includes(",")) {
    // Agar string comma-separated h to split kar ke array banao
    const catArray = category_id.split(",").map(id => id.trim());
    query += ` AND p.category_id IN (?)`;
    params.push(catArray);
  } else {
    // Single category id case
    query += ` AND p.category_id = ?`;
    params.push(category_id);
  }
}

     if (subcategory_id) {
      if (Array.isArray(subcategory_id)) {
        query += ` AND p.subcategory_id IN (?)`;
        params.push(subcategory_id);
      } else {
        query += ` AND p.subcategory_id = ?`;
        params.push(subcategory_id);
      }
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


    // add limit & offset
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);


    // Step 1: Get filtered products
    const [products] = await db.query(query, params);

    // Step 2: Get all images for these products
    const productIds = products.map(p => p.id);
    let imagesMap = {};
    if (productIds.length > 0) {
      const [images] = await db.query(`
        SELECT product_id, image_url
        FROM product_images
        WHERE product_id IN (?)
      `, [productIds]);

      images.forEach(img => {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });
    }

    // Step 3: Attach images array to products
    const finalProducts = products.map(product => ({
      ...product,
      images: imagesMap[product.id] || []
    }));

    res.status(200).json({
      success: true,
      total_products: finalProducts.length,
      limit,
      offset,
      filters: {
        category_id,
        subcategory_id,
        min_price,
        max_price,
        sort,
      },
      data: finalProducts,
    });

  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//////////////////////////////////////////////////////////////////

// Create Product
const cloudinary = require("../config/cloudinary");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, unit, category_id, subcategory_id } = req.body;

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

    // Step 2: Upload images to Cloudinary & save in DB
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      );

      const uploadedImages = await Promise.all(uploadPromises);

      const imageValues = uploadedImages.map(img => [productId, img.secure_url]);

      await db.query(
        `INSERT INTO product_images (product_id, image_url) VALUES ?`,
        [imageValues]
      );
    }

    // Step 3: Insert sizes (optional)
    if (req.body.sizes) {
      let sizes = JSON.parse(req.body.sizes); // because form-data me string aayegi
      if (sizes.length > 0) {
        const sizeValues = sizes.map(size => [productId, size]);
        await db.query(
          `INSERT INTO product_sizes (product_id, size) VALUES ?`,
          [sizeValues]
        );
      }
    }

    // Step 4: Insert colors (optional)
    if (req.body.colors) {
      let colors = JSON.parse(req.body.colors); // string ko JSON array me parse karo
      if (colors.length > 0) {
        const colorValues = colors.map(color => [productId, color.name, color.code]);
        await db.query(
          `INSERT INTO product_colors (product_id, color_name, color_code) VALUES ?`,
          [colorValues]
        );
      }
    }

    res.json({ success: true, message: "Product created successfully", productId });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get All Products
exports.getProducts = async (req, res) => {
  const userId = req.user.id;
  try {
        // frontend se limit & offset lenge
    let { limit, offset } = req.query;
    limit = parseInt(limit) || 10;   // default 10
    offset = parseInt(offset) || 0;  // default 0
    
    // Step 1: Get products with category, subcategory, wishlist
    const [products] = await db.query(`
      SELECT 
        p.*, 
        c.name AS category_name, 
        s.name AS subcategory_name,
        CASE 
          WHEN w.id IS NOT NULL THEN 1 
          ELSE 0 
        END AS wishlist_is
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN wishlist w ON w.product_id = p.id AND w.user_id = ?
         ORDER BY p.id ASC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);

    // Step 2: Get all product images in one query
    const productIds = products.map(p => p.id);
    let imagesMap = {};
    if (productIds.length > 0) {
      const [images] = await db.query(`
        SELECT product_id, image_url 
        FROM product_images 
        WHERE product_id IN (?)
      `, [productIds]);

      // Map images to product_id
      images.forEach(img => {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });
    }

    // Step 3: Attach images array to products
    const finalProducts = products.map(product => ({
      ...product,
      images: imagesMap[product.id] || []
    }));

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      limit,
      offset,
            count: finalProducts.length,

      data: finalProducts
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
    const userId = req.user.id;

    // Step 1: Get product basic info
    const [productRows] = await db.query(
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

    if (!productRows.length) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const product = productRows[0];

    // Step 2: Get product images
    const [imagesRows] = await db.query(
      `SELECT image_url, is_banner FROM product_images WHERE product_id = ?`,
      [id]
    );

    // Step 3: Get colors
    const [colorsRows] = await db.query(
      `SELECT color_name, color_code FROM product_colors WHERE product_id = ?`,
      [id]
    );

    // Step 4: Get sizes
    const [sizesRows] = await db.query(
      `SELECT size FROM product_sizes WHERE product_id = ?`,
      [id]
    );

    // Step 5: Wishlist check
    let wishlist_is = 0;
    if (userId) {
      const [wishlist] = await db.query(
        `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?`,
        [userId, id]
      );
      wishlist_is = wishlist.length > 0 ? 1 : 0;
    }

    // Step 6: Respond
    res.json({
      success: true,
      data: {
        ...product,
        images: imagesRows.map(img => img.image_url), // array of URLs
        colors: colorsRows,
        sizes: sizesRows.map(s => s.size),
        wishlist_is
      }
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
  const userId = req.user.id;
  const categoryId = req.params.categoryId;

    const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  try {
    // Step 1: Get products in category with wishlist info
    const [products] = await db.query(`
      SELECT 
        p.*, 
        CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END AS wishlist_is
      FROM products p
      LEFT JOIN wishlist w 
        ON p.id = w.product_id AND w.user_id = ?
      WHERE p.category_id = ?
  LIMIT ? OFFSET ?
    `, [userId, categoryId, limit, offset]);

    // Step 2: Get all images for these products
    const productIds = products.map(p => p.id);
    let imagesMap = {};
    if (productIds.length > 0) {
      const [images] = await db.query(`
        SELECT product_id, image_url
        FROM product_images
        WHERE product_id IN (?)
      `, [productIds]);

      // Map images to product_id
      images.forEach(img => {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });
    }

    // Step 3: Attach images array to products
    const finalProducts = products.map(product => ({
      ...product,
      images: imagesMap[product.id] || []
    }));

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
       limit,
      offset,
      data: finalProducts
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// Get Products by SubCategory
exports.getProductsBySubCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const subcategoryId = req.params.subcategoryId;
 const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    // Step 1: Get products with wishlist info
    const [products] = await db.query(`
      SELECT p.*, 
        CASE WHEN w.product_id IS NOT NULL THEN 1 ELSE 0 END AS wishlist_is
      FROM products p
      LEFT JOIN wishlist w 
        ON p.id = w.product_id AND w.user_id = ?
      WHERE p.subcategory_id = ?
 LIMIT ? OFFSET ?
    `, [userId, subcategoryId, limit, offset]);

    // Step 2: Get all images for these products
    const productIds = products.map(p => p.id);
    let imagesMap = {};
    if (productIds.length > 0) {
      const [images] = await db.query(`
        SELECT product_id, image_url
        FROM product_images
        WHERE product_id IN (?)
      `, [productIds]);

      // Map images to product_id
      images.forEach(img => {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });
    }

    // Step 3: Attach images array to products
    const finalProducts = products.map(product => ({
      ...product,
      images: imagesMap[product.id] || []
    }));

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      limit,
      offset,
      data: finalProducts
    });

  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getNewestProducts = async (req, res) => {
  try {
           const userId = req.user.id;
 let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
  let query = `
      SELECT p.*, 
        c.name AS category_name, 
        s.name AS subcategory_name,
        CASE WHEN w.product_id IS NOT NULL THEN 1 ELSE 0 END AS wishlist_is
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN wishlist w ON p.id = w.product_id AND w.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(query, [userId, limit, offset]);

   res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
       limit,
      offset,
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
     let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
    // Step 1: Get wishlist products
    const [products] = await db.query(
      `SELECT p.id, p.name, p.price, p.category_id
       FROM wishlist w
       INNER JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?
        ORDER BY w.created_at DESC
        LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    // Step 2: Get all images for wishlist products
    const productIds = products.map(p => p.id);
    let imagesMap = {};
    if (productIds.length > 0) {
      const [images] = await db.query(
        `SELECT product_id, image_url, is_banner 
         FROM product_images 
         WHERE product_id IN (?)`,
        [productIds]
      );

      images.forEach(img => {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push({
          url: img.image_url,
          is_banner: img.is_banner
        });
      });
    }

    // Step 3: Attach images array to products
    const finalProducts = products.map(p => ({
      ...p,
      images: imagesMap[p.id] || []
    }));

    res.json({ success: true, limit,
      offset,
      count: finalProducts.length, products: finalProducts });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


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
    const userId = req.user.id;
    const { keyword } = req.query;
 let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required"
      });
    }

    const searchTerm = `%${keyword.toLowerCase()}%`;

    // Step 1: Search products with stronger LIKE
    const [products] = await db.query(`
      SELECT 
        p.*, 
        c.name AS category_name, 
        s.name AS subcategory_name,
        CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END AS wishlist_is,
         (
          (CASE WHEN LOWER(p.name) LIKE ? THEN 3 ELSE 0 END) +
          (CASE WHEN LOWER(p.description) LIKE ? THEN 2 ELSE 0 END) +
          (CASE WHEN LOWER(c.name) LIKE ? THEN 1 ELSE 0 END) +
          (CASE WHEN LOWER(s.name) LIKE ? THEN 1 ELSE 0 END)
        ) AS relevance
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN wishlist w ON p.id = w.product_id AND w.user_id = ?
   WHERE LOWER(p.name) LIKE ? 
         OR LOWER(p.description) LIKE ? 
         OR LOWER(c.name) LIKE ? 
         OR LOWER(s.name) LIKE ?
      ORDER BY relevance DESC, p.name ASC
            LIMIT ? OFFSET ?
    `, [
      searchTerm, searchTerm, searchTerm, searchTerm,
      userId || null,
      searchTerm, searchTerm, searchTerm, searchTerm, limit, offset
    ]);

    // Step 2: Get all images for searched products
    const productIds = products.map(p => p.id);
    let imagesMap = {};
    if (productIds.length > 0) {
      const [images] = await db.query(`
        SELECT product_id, image_url
        FROM product_images
        WHERE product_id IN (?)
      `, [productIds]);

      images.forEach(img => {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });
    }

    // Step 3: Attach images array to products
    const finalProducts = products.map(p => ({
      ...p,
      images: imagesMap[p.id] || []
    }));

    res.status(200).json({
      success: true,
      message: finalProducts.length > 0 ? "Products found" : "No products found",
       limit,
      offset,
      count: finalProducts.length,
      data: finalProducts
    });

  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



////////////////////////////////////

exports.getOfferProducts = async (req, res) => {
  const userId = req.user.id;
   let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
  try {
    // Step 1: Get products with category, subcategory, wishlist (only where offer = 50)
    const [products] = await db.query(`
      SELECT 
        p.*, 
        c.name AS category_name, 
        s.name AS subcategory_name,
        CASE 
          WHEN w.id IS NOT NULL THEN 1 
          ELSE 0 
        END AS wishlist_is
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN wishlist w ON w.product_id = p.id AND w.user_id = ?
      WHERE p.offer = 50
            ORDER BY p.created_at DESC
  LIMIT ? OFFSET ?
    `, [userId, limit, offset]);
    // Step 2: Get all product images in one query
    const productIds = products.map(p => p.id);
    let imagesMap = {};
    if (productIds.length > 0) {
      const [images] = await db.query(`
        SELECT product_id, image_url 
        FROM product_images 
        WHERE product_id IN (?)
      `, [productIds]);

      // Map images to product_id
      images.forEach(img => {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });
    }

    // Step 3: Attach images array to products
    const finalProducts = products.map(product => ({
      ...product,
      images: imagesMap[product.id] || []
    }));

    res.status(200).json({
      success: true,
      message: 'Offer products (50%) fetched successfully',
          limit,
      offset,
      count: finalProducts.length,
      data: finalProducts
    });

  } catch (error) {
    console.error('Error fetching offer products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
