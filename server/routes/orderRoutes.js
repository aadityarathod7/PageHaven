const express = require('express');
const router = express.Router();
const { getUserOrders, getAllOrders, createOrder, getPurchasedBooks, checkBookPurchase } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getUserOrders)
    .post(protect, createOrder);

router.route('/admin')
    .get(protect, admin, getAllOrders);

router.route('/purchased-books')
    .get(protect, getPurchasedBooks);

router.route('/check-purchase/:bookId')
    .get(protect, checkBookPurchase);

module.exports = router; 