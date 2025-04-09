const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory, getCategoryById } = require('../controllers/categoryController');

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;