const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');

// Create order - optional authentication for guest checkout
router.post('/', optionalAuth, createOrder);

// Get order by ID - optional auth (public for guests, private for users)
router.get('/:id', optionalAuth, getOrderById);

// Protected routes
router.get('/my-orders', protect, getMyOrders);

module.exports = router;
