const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Progress = require('../models/progressModel');

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
    console.log('Creating order with data:', req.body);
    const { bookId, paymentId, orderId, amount, paymentMethod } = req.body;

    try {
        // Create the order
        const order = await Order.create({
            user: req.user._id,
            book: bookId,
            paymentId,
            orderId,
            amount,
            paymentMethod
        });
        console.log('Order created successfully:', order._id);

        // Create or update progress to mark book as purchased
        let progress = await Progress.findOne({
            user: req.user._id,
            book: bookId
        });

        if (progress) {
            console.log('Updating existing progress for book:', bookId);
            progress.isPurchased = true;
            await progress.save();
        } else {
            console.log('Creating new progress for book:', bookId);
            await Progress.create({
                user: req.user._id,
                book: bookId,
                isPurchased: true,
                currentChapter: 0,
                currentPosition: 0,
                isFavorite: false
            });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
});

module.exports = {
    getUserOrders,
    getAllOrders,
    createOrder
}; 