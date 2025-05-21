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

    // Get updated unread count
    const unreadCount = await Notification.countDocuments({
        user: req.user._id,
        read: false,
    });

    // Emit updated count to user
    req.app.get('io').to(req.user._id.toString()).emit('unreadCount', unreadCount);

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

    // Emit zero unread count to user
    req.app.get('io').to(req.user._id.toString()).emit('unreadCount', 0);

    res.json({ message: 'All notifications marked as read' });
});

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
    const { userId, title, message, type, link } = req.body;

    try {
        const notification = await Notification.create({
            user: userId,
            title,
            message,
            type: type || 'info',
            link,
        });

        // Get updated notifications and unread count
        const notifications = await Notification.find({ user: userId })
            .sort('-createdAt')
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            user: userId,
            read: false,
        });

        // Get Socket.IO instance
        const io = req.app.get('io');
        if (!io) {
            console.error('Socket.IO instance not found');
            throw new Error('Socket.IO instance not found');
        }

        // Log the emission attempt
        console.log(`Attempting to emit notification to user ${userId}`);

        // Emit new notification to specific user
        io.to(userId).emit('newNotification', notification);
        io.to(userId).emit('notifications', notifications);
        io.to(userId).emit('unreadCount', unreadCount);

        console.log(`Successfully emitted notification to user ${userId}`);

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error in createNotification:', error);
        throw error;
    }
});

// @desc    Clear all notifications
// @route   DELETE /api/notifications
// @access  Private
const clearNotifications = asyncHandler(async (req, res) => {
    try {
        // Perform deletion and get result
        const result = await Notification.deleteMany({ user: req.user._id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No notifications found to delete' });
        }

        // Get Socket.IO instance
        const io = req.app.get('io');
        if (!io) {
            console.error('Socket.IO instance not found in clearNotifications');
            throw new Error('Socket.IO instance not found');
        }

        // Log the emission attempt
        console.log(`Attempting to emit clear notifications for user ${req.user._id}`);

        // Emit empty notifications and zero count
        io.to(req.user._id.toString()).emit('notifications', []);
        io.to(req.user._id.toString()).emit('unreadCount', 0);

        console.log(`Successfully cleared notifications for user ${req.user._id}`);

        res.json({
            message: 'All notifications cleared',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error in clearNotifications:', error);
        throw error;
    }
});

module.exports = {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    clearNotifications,
}; 