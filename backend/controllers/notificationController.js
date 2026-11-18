const Notification = require('../models/Notification');
const User = require('../models/User');

const notificationController = {
  // Get notifications for a user
  getNotifications: async (req, res) => {
    try {
      const { type, isRead, priority, dateFrom, dateTo, search, page = 1, limit = 20 } = req.query;
      const userId = req.user.id;

      let query = { userId };
      if (type) query.type = type;
      if (isRead !== undefined) query.isRead = isRead === 'true';
      if (priority) query.priority = priority;
      
      // Date range filtering
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
      }
      
      // Search filtering
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ userId, isRead: false });

      res.json({
        success: true,
        notifications,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get notification settings
  getSettings: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('notificationSettings');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        settings: user.notificationSettings || {
          rideUpdates: true,
          promotions: true,
          systemUpdates: true,
          security: true,
          earnings: true
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update notification settings
  updateSettings: async (req, res) => {
    try {
      const { rideUpdates, promotions, systemUpdates, security, earnings } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { 
          notificationSettings: {
            rideUpdates: rideUpdates !== undefined ? rideUpdates : true,
            promotions: promotions !== undefined ? promotions : true,
            systemUpdates: systemUpdates !== undefined ? systemUpdates : true,
            security: security !== undefined ? security : true,
            earnings: earnings !== undefined ? earnings : true
          },
          updatedAt: Date.now()
        },
        { new: true }
      ).select('notificationSettings');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification settings updated successfully',
        settings: user.notificationSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true, updatedAt: Date.now() },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification marked as read',
        notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user.id;

      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, updatedAt: Date.now() }
      );

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete notification
  deleteNotification: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create notification (for system use)
  createNotification: async (req, res) => {
    try {
      const { userId, type, title, message, priority, actionRequired, details } = req.body;

      const notification = new Notification({
        userId,
        type,
        title,
        message,
        priority: priority || 'medium',
        actionRequired: actionRequired || false,
        details: details || {}
      });

      await notification.save();

      res.json({
        success: true,
        message: 'Notification created successfully',
        notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Send promotional notification to all customers
  sendPromotion: async (req, res) => {
    try {
      const { title, message, offerCode, discount, validUntil } = req.body;
      const notificationService = require('../services/notificationService');
      
      const count = await notificationService.sendPromotion(
        title, 
        message, 
        offerCode, 
        discount, 
        validUntil
      );

      res.json({
        success: true,
        message: `Promotional notification sent to ${count} customers`,
        count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = notificationController;