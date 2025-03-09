const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Register a new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Get user profile (protected route)
router.get('/profile', auth, userController.getProfile);

// Forgot password route
router.post('/forgot-password', userController.forgotPassword);

module.exports = router;