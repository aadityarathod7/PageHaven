const express = require('express');
const router = express.Router();
const { getUserOrders, getAllOrders, createOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getUserOrders)
    .post(protect, createOrder);

router.route('/admin')
    .get(protect, admin, getAllOrders);

module.exports = router; 