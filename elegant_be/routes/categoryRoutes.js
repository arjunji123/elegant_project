const express = require('express');
const router = express.Router();
const {
   
    getCategoryWithProducts,
    updateCategory,
    deleteCategory,
    categoryWithSubCategory,
    createCategory,
    getCategories
} = require('../controllers/categoryController');
const uploadCategoryIcon = require('../middlewares/uploadCategoryIcon');

router.post("/categories", uploadCategoryIcon.single("icon"), createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/categories-with-subcategories',categoryWithSubCategory);

module.exports = router;
