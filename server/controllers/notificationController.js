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

// Helper function to emit notification events
const emitNotificationEvents = async (io, userId, notification = null) => {
    try {
        // Get room size to verify connection
        const roomSize = io.sockets.adapter.rooms.get(userId)?.size || 0;
        console.log(`Emitting to user ${userId}. Active connections in room: ${roomSize}`);

        if (roomSize === 0) {
            console.log(`No active connections for user ${userId}`);
            return false;
        }

        // Get latest notifications and count
        const notifications = await Notification.find({ user: userId })
            .sort('-createdAt')
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            user: userId,
            read: false,
        });

        // Emit events with acknowledgment
        const emitWithAck = (event, data) => {
            return new Promise((resolve) => {
                io.to(userId).emit(event, data, (error) => {
                    if (error) {
                        console.error(`Error emitting ${event}:`, error);
                        resolve(false);
                    } else {
                        console.log(`Successfully emitted ${event} to user ${userId}`);
                        resolve(true);
                    }
                });
            });
        };

        // Emit all events
        const emitPromises = [
            emitWithAck('notifications', notifications),
            emitWithAck('unreadCount', unreadCount)
        ];

        if (notification) {
            emitPromises.push(emitWithAck('newNotification', notification));
        }

        await Promise.all(emitPromises);
        console.log(`Successfully emitted all events to user ${userId}`);
        return true;
    } catch (error) {
        console.error(`Error emitting notification events for user ${userId}:`, error);
        return false;
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id,
            },
            { read: true },
            { new: true }
        );

        if (!notification) {
            res.status(404);
            throw new Error('Notification not found');
        }

        // Get Socket.IO instance and emit updates
        const io = req.app.get('io');
        if (io) {
            const emitted = await emitNotificationEvents(io, req.user._id.toString());
            console.log(`Notification events emission status: ${emitted}`);
        }

        res.json(notification);
    } catch (error) {
        console.error('Error in markAsRead:', error);
        throw error;
    }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { user: req.user._id, read: false },
            { read: true }
        );

        // Get Socket.IO instance and emit updates
        const io = req.app.get('io');
        if (io) {
            const emitted = await emitNotificationEvents(io, req.user._id.toString());
            console.log(`Notification events emission status: ${emitted}`);
        }

        res.json({
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error in markAllAsRead:', error);
        throw error;
    }
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

        // Get Socket.IO instance
        const io = req.app.get('io');
        if (!io) {
            console.error('Socket.IO instance not found');
            throw new Error('Socket.IO instance not found');
        }

        // Emit notification events
        await emitNotificationEvents(io, userId, notification);

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

        // Emit empty state
        await emitNotificationEvents(io, req.user._id.toString());

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