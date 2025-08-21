const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductsBySubCategory, getFilteredProducts } = require('../controllers/productController');
const router = express.Router();

router.get("/filters", getFilteredProducts);

// Create Product
router.post('/product', createProduct);

// Get All Products
router.get('/getallProducts', getProducts);

// Get Product By ID
router.get('/product/:id', getProductById);

// Update Product
router.put('/product/:id', updateProduct);

// Delete Product
router.delete('/product/:id', deleteProduct);

// Get Products by Category/SubCategory
router.get('/prodcut/category/:categoryId', getProductsByCategory);
router.get('/product/subcategory/:subcategoryId', getProductsBySubCategory);


module.exports = router;
