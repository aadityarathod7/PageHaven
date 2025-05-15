const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('book', 'title coverImage')
        .sort('-createdAt');

    res.json(orders);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('book', 'title coverImage price')
        .populate('user', 'name email')
        .sort('-createdAt');

    res.json(orders);
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { bookId, paymentId, orderId, amount, paymentMethod } = req.body;

    const order = await Order.create({
        user: req.user._id,
        book: bookId,
        paymentId,
        orderId,
        amount,
        paymentMethod
    });

    res.status(201).json(order);
});

module.exports = {
    getUserOrders,
    getAllOrders,
    createOrder
}; 