const express = require('express');
const { authenticateUser } = require('../../middleware/authMiddleware');
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} = require('../../controllers/inAppNotification');

const router = express.Router();

router.get('/notifications', authenticateUser, getNotifications);
router.get('/notifications/unread-count', authenticateUser, getUnreadCount);
router.put('/notifications/mark-read/:id', authenticateUser, markAsRead);
router.put('/notifications/mark-all-read', authenticateUser, markAllAsRead);

module.exports = router;
