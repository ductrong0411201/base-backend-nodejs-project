const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/UserController');
const auth = require('../src/middlewares/authorizeMiddleware');

// Create a new user
router.post('/register', userController.create);

// User login
router.post('/login', userController.login);

// // User logout
router.post('/logout', auth, userController.logout);

// // Get user info
router.get('/me', auth, userController.getUserInfo);

module.exports = router;
