const express = require('express');
const { createSubcategory, getSubcategories, updateSubcategory, deleteSubcategory } = require('../controllers/subcategoryController');
const router = express.Router();

// Subcategories
router.post('/subcategories', createSubcategory);
router.get('/categories/:categoryId/subcategories', getSubcategories);
router.put('/subcategories/:id', updateSubcategory);
router.delete('/subcategories/:id', deleteSubcategory);

module.exports = router;
