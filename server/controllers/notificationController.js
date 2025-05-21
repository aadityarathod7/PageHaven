const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort('-createdAt')
        .limit(50);

    res.json(notifications);
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
        user: req.user._id,
        read: false,
    });

    res.json({ count });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, read: false },
        { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
});

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
    const { userId, title, message, type, link } = req.body;

    const notification = await Notification.create({
        user: userId,
        title,
        message,
        type: type || 'info',
        link,
    });

    res.status(201).json(notification);
});

// @desc    Clear all notifications
// @route   DELETE /api/notifications
// @access  Private
const clearNotifications = asyncHandler(async (req, res) => {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: 'All notifications cleared' });
});

module.exports = {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    clearNotifications,
}; 