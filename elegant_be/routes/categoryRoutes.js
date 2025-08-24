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
const upload = require("../config/multer");

router.post("/categories", upload.single("icon"), createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/categories-with-subcategories',categoryWithSubCategory);

module.exports = router;
