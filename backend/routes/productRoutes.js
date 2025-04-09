const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct, getProductById } = require('../controllers/productController');

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
