const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Book = require('../models/bookModel');

console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    console.log('Creating Razorpay order with amount:', amount);

    if (!amount) {
        res.status(400);
        throw new Error('Please provide an amount');
    }

    try {
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'order_' + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created:', order.id);

        res.json({
            orderId: order.id,
        });
    } catch (error) {
        console.error('Razorpay error:', error);
        res.status(500);
        throw new Error('Error creating order');
    }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    console.log('Payment verification request received:', req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    console.log('Signature verification:');
    console.log('Expected:', expectedSignature);
    console.log('Received:', razorpay_signature);

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        console.log('Payment verified successfully');
        res.json({
            success: true,
            message: 'Payment verified successfully'
        });
    } else {
        console.error('Payment verification failed');
        res.status(400);
        throw new Error('Payment verification failed');
    }
});

module.exports = {
    createOrder,
    verifyPayment
}; 