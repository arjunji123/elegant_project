const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductsBySubCategory, getFilteredProducts } = require('../controllers/productController');
const router = express.Router();

router.get("/filters", getFilteredProducts);

// Create Product
router.post('/', createProduct);

// Get All Products
router.get('/', getProducts);

// Get Product By ID
router.get('/:id', getProductById);

// Update Product
router.put('/:id', updateProduct);

// Delete Product
router.delete('/:id', deleteProduct);

// Get Products by Category/SubCategory
router.get('/category/:categoryId', getProductsByCategory);
router.get('/subcategory/:subcategoryId', getProductsBySubCategory);


module.exports = router;
