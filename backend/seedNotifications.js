const mongoose = require('mongoose');
const User = require('./models/User');
const Notification = require('./models/Notification');
require('dotenv').config();

const seedNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get users
    const admin = await User.findOne({ role: 'admin' });
    const customers = await User.find({ role: 'customer' }).limit(5);
    const drivers = await User.find({ role: 'driver' }).limit(5);

    // Clear existing notifications
    await Notification.deleteMany({});

    const notifications = [];

    // Admin notifications
    if (admin) {
      notifications.push(
        {
          userId: admin._id,
          type: 'info',
          title: 'New Driver Registration',
          message: 'John Doe has registered as a new driver and is pending verification.',
          priority: 'medium',
          actionRequired: false,
          details: { driverId: 'D123', driverName: 'John Doe' }
        },
        {
          userId: admin._id,
          type: 'warning',
          title: 'High Cancellation Rate',
          message: 'Driver ID: D123 has a cancellation rate of 25% in the last 7 days.',
          priority: 'high',
          actionRequired: true,
          details: { driverId: 'D123', cancellationRate: 25 }
        },
        {
          userId: admin._id,
          type: 'success',
          title: 'Revenue Milestone',
          message: 'Platform has reached ₹1,00,000 in total revenue this month.',
          priority: 'low',
          isRead: true,
          details: { revenue: 100000, period: 'month' }
        },
        {
          userId: admin._id,
          type: 'error',
          title: 'Payment Gateway Issue',
          message: 'Multiple payment failures reported. Please check payment gateway status.',
          priority: 'critical',
          actionRequired: true,
          details: { failureCount: 15, gateway: 'Razorpay' }
        }
      );
    }

    // Customer notifications
    customers.forEach(customer => {
      notifications.push(
        {
          userId: customer._id,
          type: 'ride_update',
          title: 'Ride Completed',
          message: 'Your ride to Airport has been completed. Rate your driver!',
          priority: 'medium',
          actionRequired: true,
          details: {
            rideId: 'R001',
            driver: 'Rajesh Kumar',
            fare: '₹650',
            destination: 'IGI Airport'
          }
        },
        {
          userId: customer._id,
          type: 'promotion',
          title: 'Weekend Special Offer',
          message: 'Get 20% off on all rides this weekend! Use code WEEKEND20',
          priority: 'medium',
          details: {
            offerCode: 'WEEKEND20',
            discount: '20%',
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            minRides: 1
          }
        },
        {
          userId: customer._id,
          type: 'security',
          title: 'Login from New Device',
          message: 'We detected a login from a new device. Was this you?',
          priority: 'high',
          actionRequired: true,
          isRead: Math.random() > 0.5,
          details: {
            device: 'iPhone 13',
            location: 'Delhi, India',
            ipAddress: '192.168.1.1'
          }
        }
      );
    });

    // Driver notifications
    drivers.forEach(driver => {
      notifications.push(
        {
          userId: driver._id,
          type: 'ride_update',
          title: 'New Ride Request',
          message: 'You have a new ride request from Connaught Place to Airport.',
          priority: 'high',
          actionRequired: true,
          details: {
            rideId: 'R002',
            pickup: 'Connaught Place',
            destination: 'IGI Airport',
            fare: '₹580',
            distance: '25 km'
          }
        },
        {
          userId: driver._id,
          type: 'system',
          title: 'Document Verification Required',
          message: 'Your driving license is expiring soon. Please update your documents.',
          priority: 'medium',
          actionRequired: true,
          details: {
            document: 'Driving License',
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        },
        {
          userId: driver._id,
          type: 'promotion',
          title: 'Bonus Earnings',
          message: 'Complete 10 rides today and earn ₹500 bonus!',
          priority: 'medium',
          isRead: Math.random() > 0.5,
          details: {
            targetRides: 10,
            currentRides: Math.floor(Math.random() * 8),
            bonus: 500
          }
        }
      );
    });

    // Insert notifications
    await Notification.insertMany(notifications);
    console.log(`✅ Seeded ${notifications.length} notifications`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding notifications:', error);
    process.exit(1);
  }
};

seedNotifications();