const mongoose = require('mongoose');
const notificationService = require('./services/notificationService');
require('dotenv').config();

const sendPromotion = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const count = await notificationService.sendPromotion(
      'Weekend Special Offer!',
      'Get 25% off on all rides this weekend! Use code WEEKEND25',
      'WEEKEND25',
      '25%',
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Valid for 7 days
    );

    console.log(`✅ Sent promotional notification to ${count} customers`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error sending promotion:', error);
    process.exit(1);
  }
};

sendPromotion();