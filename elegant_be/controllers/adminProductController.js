const db = require('../config/db');

// List all products (with category and subcategory info and pagination)
exports.listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    // Get total count
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM products');
    
    // Get paginated products
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?', [limitNum, offset]);
    
    const [categories] = await db.query('SELECT * FROM categories');
    const [subcategories] = await db.query('SELECT * FROM subcategories');
    
    // Get all product ids
    let productIds = [];
    if (products && products.length > 0) {
      productIds = products.map(p => p.id);
    }
    
    // Get all images for these products
    let imagesMap = {};
    let colorsMap = {};
    let sizesMap = {};
    
    if (productIds.length > 0) {
      const [images] = await db.query('SELECT product_id, image_url FROM product_images WHERE product_id IN (?)', [productIds]);
      images.forEach(img => {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.image_url);
      });
      
      // Fetch all colors for these products
      const [colors] = await db.query('SELECT product_id, color_name, color_code FROM product_colors WHERE product_id IN (?)', [productIds]);
      colors.forEach(c => {
        if (!colorsMap[c.product_id]) colorsMap[c.product_id] = [];
        colorsMap[c.product_id].push({ color_name: c.color_name, color_code: c.color_code });
      });
      
      const [sizes] = await db.query('SELECT product_id, size FROM product_sizes WHERE product_id IN (?)', [productIds]);
      sizes.forEach(s => {
        if (!sizesMap[s.product_id]) sizesMap[s.product_id] = [];
        sizesMap[s.product_id].push(s.size);
      });
    }
    
    const data = products.map(prod => ({
      ...prod,
      colors: colorsMap[prod.id] || [],
      sizes: sizesMap[prod.id] || [],
      images: imagesMap[prod.id] || [],
      category: categories.find(cat => cat.id === prod.category_id) || null,
      subcategory: subcategories.find(sub => sub.id === prod.subcategory_id) || null
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
}

// Get product detail by id (with category and subcategory info)
exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM products WHERE id=?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Product not found' });
    const product = rows[0];
    // Fetch images
    const [images] = await db.query('SELECT image_url FROM product_images WHERE product_id=?', [id]);
    product.images = images.map(img => img.image_url);
    const [catRows] = await db.query('SELECT * FROM categories WHERE id=?', [product.category_id]);
    const [subRows] = await db.query('SELECT * FROM subcategories WHERE id=?', [product.subcategory_id]);
    // Fetch colors
    const [colors] = await db.query('SELECT color_name, color_code FROM product_colors WHERE product_id=?', [id]);
    // Fetch sizes
    const [sizes] = await db.query('SELECT size FROM product_sizes WHERE product_id=?', [id]);
    product.colors = colors;
    product.sizes = sizes.map(s => s.size);
    product.category = catRows[0] || null;
    product.subcategory = subRows[0] || null;
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Create Product
 * @api {POST} /api/admin/products
 * Example req.body:
 * {
 *   "name": "Rayban Sunglasses",
 *   "category_id": 1,
 *   "subcategory_id": 2,
 *   "color": "Black",
 *   "size": "Medium",
 *   "price": 1999,
 *   "description": "Stylish sunglasses",
 *   "image": "image_url.png"
 * }
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, subcategory_id, color, size, price, description, image } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (name, category_id, subcategory_id, color, size, price, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category_id, subcategory_id, color, size, price, description, image]
    );
    res.json({ success: true, id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Update Product (Form Data Support)
 * @api {PUT} /api/admin/products/:id
 * Form Data Fields:
 * - name: string
 * - category_id: number
 * - subcategory_id: number  
 * - price: number
 * - description: string
 * - colors: JSON string [{"color_name":"Red","color_code":"#FF0000"}]
 * - sizes: JSON string ["S","M","L"]
 * - images: multiple files
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Extract form data
    const name = req.body.name || '';
    const category_id = req.body.category_id || null;
    const subcategory_id = req.body.subcategory_id || null;
    const price = req.body.price || 0;
    const description = req.body.description || '';
    
    // Parse JSON strings for colors and sizes
    let finalColors = [];
    let finalSizes = [];
    
    if (req.body.colors) {
      try {
        finalColors = JSON.parse(req.body.colors);
      } catch (e) {
        console.log('Colors parsing error:', e.message);
      }
    }
    
    if (req.body.sizes) {
      try {
        finalSizes = JSON.parse(req.body.sizes);
      } catch (e) {
        console.log('Sizes parsing error:', e.message);
      }
    }
    
    // Get uploaded images URLs
    let finalImages = [];
    if (req.files && req.files.length > 0) {
      finalImages = req.files.map(file => file.path); // Cloudinary URLs
    }
    
    console.log('Update request for product:', id);
    console.log('Form data received:', { name, category_id, subcategory_id, price, description });
    console.log('Colors:', finalColors);
    console.log('Sizes:', finalSizes);
    console.log('Images:', finalImages);
    
    // Update basic product info
    await db.query(
      'UPDATE products SET name=?, category_id=?, subcategory_id=?, price=?, description=? WHERE id=?',
      [name, category_id, subcategory_id, price, description, id]
    );
    
    // Update images if uploaded
    if (finalImages.length > 0) {
      await db.query('DELETE FROM product_images WHERE product_id=?', [id]);
      for (const imgUrl of finalImages) {
        await db.query('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)', [id, imgUrl]);
      }
    }
    
    // Update colors if provided
    if (finalColors.length > 0) {
      await db.query('DELETE FROM product_colors WHERE product_id=?', [id]);
      for (const c of finalColors) {
        await db.query('INSERT INTO product_colors (product_id, color_name, color_code) VALUES (?, ?, ?)', [id, c.color_name, c.color_code]);
      }
    }
    
    // Update sizes if provided
    if (finalSizes.length > 0) {
      await db.query('DELETE FROM product_sizes WHERE product_id=?', [id]);
      for (const s of finalSizes) {
        await db.query('INSERT INTO product_sizes (product_id, size) VALUES (?, ?)', [id, s]);
      }
    }
    
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
