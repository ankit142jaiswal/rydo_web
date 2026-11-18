const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get notifications for authenticated user
router.get('/', authenticateToken, notificationController.getNotifications);

// Get notification settings
router.get('/settings', authenticateToken, notificationController.getSettings);

// Update notification settings
router.put('/settings', authenticateToken, notificationController.updateSettings);

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, notificationController.markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', authenticateToken, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', authenticateToken, notificationController.deleteNotification);

// Create notification (system use)
router.post('/', authenticateToken, notificationController.createNotification);

// Send promotional notification
router.post('/promotion', authenticateToken, notificationController.sendPromotion);

module.exports = router;