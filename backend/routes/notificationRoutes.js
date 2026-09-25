const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllRead,
  getUnreadCount,
  deleteNotification,
} = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', auth, getUnreadCount);

// @route   PATCH /api/notifications/read-all
// @access  Private
router.patch('/read-all', auth, markAllRead);

// @route   GET /api/notifications
// @access  Private
router.get('/', auth, getNotifications);

// @route   PATCH /api/notifications/:id/read
// @access  Private
router.patch('/:id/read', auth, markAsRead);

// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', auth, deleteNotification);

module.exports = router;
