const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, createOrder);

// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, verifyPayment);

module.exports = router; 