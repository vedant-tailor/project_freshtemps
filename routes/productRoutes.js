const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, admin } = require('../middleware/auth');

// Get all products (public)
router.get('/', productController.getAllProducts);

// Get a single product by ID (public)
router.get('/:id', productController.getProductById);

// Create a new product (protected, admin only)
router.post('/', auth, admin, productController.createProduct);

// Update a product (protected, admin only)
router.put('/:id', auth, admin, productController.updateProduct);

// Delete a product (protected, admin only)
router.delete('/:id', auth, admin, productController.deleteProduct);

// Upload a new product (protected, admin only)
router.post('/upload', auth, admin, productController.uploadProduct);

module.exports = router;