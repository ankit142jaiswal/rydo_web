const Notification = require('../models/Notification');
const User = require('../models/User');

const notificationService = {
  // Send notification to specific user
  sendToUser: async (userId, type, title, message, priority = 'medium', details = {}) => {
    try {
      await Notification.create({
        userId,
        type,
        title,
        message,
        priority,
        details
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  // Send promotional notifications
  sendPromotion: async (title, message, offerCode, discount, validUntil) => {
    try {
      const customers = await User.find({ 
        role: 'customer', 
        isActive: true,
        'notificationSettings.promotions': true 
      }).select('_id');
      
      const notifications = customers.map(customer => ({
        userId: customer._id,
        type: 'promotion',
        title,
        message,
        priority: 'medium',
        details: {
          offerCode,
          discount,
          validUntil
        }
      }));
      
      await Notification.insertMany(notifications);
      return notifications.length;
    } catch (error) {
      console.error('Error sending promotional notifications:', error);
      return 0;
    }
  }
};

module.exports = notificationService;