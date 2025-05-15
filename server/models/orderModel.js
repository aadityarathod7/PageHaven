const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book'
        },
        paymentId: {
            type: String,
            required: true
        },
        orderId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'completed'
        },
        paymentMethod: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 