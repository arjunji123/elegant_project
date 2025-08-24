const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductsBySubCategory, getFilteredProducts, getNewestProducts, postWishlistAddOrRemove, getWishlist, checkWishlist, searchProducts } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const upload = require("../middlewares/productUpload");

router.get("/filters",authMiddleware, getFilteredProducts);

// Create Product
router.post('/product', upload.array("images", 5), createProduct);

// Get All Products
router.get('/getallProducts',authMiddleware, getProducts);

// Get Product By ID
router.get('/product/:id',authMiddleware, getProductById);

// Update Product
router.put('/product/:id', updateProduct);

// Delete Product
router.delete('/product/:id', deleteProduct);

// Get Products by Category/SubCategory
router.get('/product/category/:categoryId',authMiddleware, getProductsByCategory);
router.get('/product/subcategory/:subcategoryId',authMiddleware, getProductsBySubCategory);

router.get("/products/newest",authMiddleware, getNewestProducts);
router.get("/products/search", authMiddleware,searchProducts);

router.post("/add-wishlist",authMiddleware, postWishlistAddOrRemove);
router.get("/wishlist",authMiddleware, getWishlist);
router.get("/wishlist/check",authMiddleware, checkWishlist);

module.exports = router;
