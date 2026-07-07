const InAppNotification = require('../models/InAppNotification');

// Get all notifications for logged-in user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await InAppNotification.find({ recipientId: userId })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await InAppNotification.countDocuments({ recipientId: userId, isRead: false });
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Mark a specific notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await InAppNotification.findOneAndUpdate(
            { _id: id, recipientId: userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Mark all notifications for user as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await InAppNotification.updateMany(
            { recipientId: userId, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};
