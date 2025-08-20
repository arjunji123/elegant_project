const express = require('express');
const router = express.Router();
const {
   
    getCategoryWithProducts,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    categoryWithSubCategory,
} = require('../controllers/categoryController');

router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/categories-with-subcategories',categoryWithSubCategory);

module.exports = router;
