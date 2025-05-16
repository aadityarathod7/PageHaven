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

        // Create or update progress to mark book as purchased
        let progress = await Progress.findOne({
            user: req.user._id,
            book: bookId
        });

        if (progress) {
            progress.isPurchased = true;
            await progress.save();
        } else {
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
        throw error;
    }
});

// @desc    Get user's purchased books
// @route   GET /api/orders/purchased-books
// @access  Private
const getPurchasedBooks = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('book')
        .sort('-createdAt');

    // Extract unique books from orders
    const purchasedBooks = [...new Map(
        orders.map(order => [order.book._id.toString(), order.book])
    ).values()];

    res.json(purchasedBooks);
});

// @desc    Check if a book is purchased by user
// @route   GET /api/orders/check-purchase/:bookId
// @access  Private
const checkBookPurchase = asyncHandler(async (req, res) => {
    const progress = await Progress.findOne({
        user: req.user._id,
        book: req.params.bookId,
        isPurchased: true
    });

    const isPurchased = !!progress;

    // Also check orders directly as a fallback
    if (!isPurchased) {
        const order = await Order.findOne({
            user: req.user._id,
            book: req.params.bookId
        });
        if (order) {
            // If we found an order but no progress, create the progress
            await Progress.create({
                user: req.user._id,
                book: req.params.bookId,
                isPurchased: true,
                currentChapter: 0,
                currentPosition: 0,
                isFavorite: false
            });
            res.json({ isPurchased: true });
            return;
        }
    }

    res.json({ isPurchased });
});

module.exports = {
    getUserOrders,
    getAllOrders,
    createOrder,
    getPurchasedBooks,
    checkBookPurchase
}; 