const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const updateUserSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users without notification settings
    const result = await User.updateMany(
      { notificationSettings: { $exists: false } },
      {
        $set: {
          notificationSettings: {
            rideUpdates: true,
            promotions: true,
            systemUpdates: true,
            security: true,
            earnings: true
          }
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with notification settings`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

updateUserSettings();