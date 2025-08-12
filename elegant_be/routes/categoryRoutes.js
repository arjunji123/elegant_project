const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryWithProducts,
    addProduct
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:id/products', getCategoryWithProducts);
router.post("/products", addProduct);

router.get('/:id/products', getCategoryWithProducts);

module.exports = router;
