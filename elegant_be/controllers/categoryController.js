const db = require('../config/db');

// ✅ Get all categories
exports.getCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Category not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Create category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const [result] = await db.query(
            "INSERT INTO categories (name, description) VALUES (?, ?)",
            [name, description]
        );
        res.status(201).json({ id: result.insertId, name, description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const [result] = await db.query(
            "UPDATE categories SET name = ?, description = ? WHERE id = ?",
            [name, description, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get category with products
exports.getCategoryWithProducts = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Category check
        const [[category]] = await db.query(
            "SELECT id, name, description FROM categories WHERE id = ?",
            [categoryId]
        );
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Fetch products with images
     const [products] = await db.query(
    `SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.currency, 
        p.created_at,

        COALESCE(
            CONCAT('[', GROUP_CONCAT(DISTINCT JSON_QUOTE(pi.image_url)), ']'),
            '[]'
        ) AS images,

        COALESCE(
            CONCAT('[', GROUP_CONCAT(DISTINCT JSON_QUOTE(pa.attribute_value)), ']'),
            '[]'
        ) AS attributes,

        COALESCE(ROUND(AVG(pr.rating), 1), 0) AS average_rating

     FROM products p
     LEFT JOIN product_images pi ON p.id = pi.product_id
     LEFT JOIN product_attributes pa ON p.id = pa.product_id
     LEFT JOIN product_reviews pr ON p.id = pr.product_id
     WHERE p.category_id = ?
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [categoryId]
);

// SQL se jo string arrays aaye, unhe parse karke actual JS array banao
products.forEach(product => {
    try {
        product.images = JSON.parse(product.images || '[]');
        product.attributes = JSON.parse(product.attributes || '[]');
    } catch (err) {
        product.images = [];
        product.attributes = [];
    }
});

res.json({
    success: true,
    message: "Category with products fetched successfully",
    data: {
        category,
        products
    }
});


        return res.status(200).json({
            success: true,
            message: "Category with products fetched successfully",
            data: {
                category,
                products
            }
        });

    } catch (error) {
        console.error("Get Category With Products Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.addProduct = async (req, res) => {
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
        const { category_id, name, description, price, currency, images, attributes } = req.body;

        if (!category_id || !name || !price || !currency) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        // 1. Insert product
        const [productResult] = await conn.query(
            `INSERT INTO products (category_id, name, description, price, currency, created_at) 
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [category_id, name, description || "", price, currency]
        );

        const productId = productResult.insertId;

        // 2. Insert images
        if (Array.isArray(images) && images.length > 0) {
            const imageValues = images.map((url, index) => [productId, url, index + 1]);
            await conn.query(
                "INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?",
                [imageValues]
            );
        }

        // 3. Insert attributes
        if (Array.isArray(attributes) && attributes.length > 0) {
            const attributeValues = attributes.map(attr => [productId, attr.attribute_name, attr.attribute_value]);
            await conn.query(
                "INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES ?",
                [attributeValues]
            );
        }

        await conn.commit();

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product_id: productId
        });

    } catch (error) {
        await conn.rollback();
        console.error("Add Product Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    } finally {
        conn.release();
    }
};
