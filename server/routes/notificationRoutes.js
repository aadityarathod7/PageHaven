const express = require('express');
const router = express.Router();
const {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    clearNotifications,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get user notifications and create new notification
router.route('/')
    .get(protect, getUserNotifications)
    .post(protect, admin, createNotification)
    .delete(protect, clearNotifications);

// Get unread notification count
router.get('/unread-count', protect, getUnreadCount);

// Mark all notifications as read
router.put('/mark-all-read', protect, markAllAsRead);

// Mark single notification as read
router.put('/:id/read', protect, markAsRead);

module.exports = router; 