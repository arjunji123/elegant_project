const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductsBySubCategory, getFilteredProducts, getNewestProducts, postWishlistAddOrRemove, getWishlist, checkWishlist, searchProducts } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
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
router.get('/product/category/:categoryId', getProductsByCategory);
router.get('/product/subcategory/:subcategoryId', getProductsBySubCategory);

router.get("/products/newest", getNewestProducts);
router.get("/products/search", searchProducts);

router.post("/add-wishlist",authMiddleware, postWishlistAddOrRemove);
router.get("/wishlist",authMiddleware, getWishlist);
router.get("/wishlist/check",authMiddleware, checkWishlist);

module.exports = router;
