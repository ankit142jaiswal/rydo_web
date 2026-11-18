const mongoose = require('mongoose');
const User = require('./models/User');
const Ride = require('./models/Ride');
const Notification = require('./models/Notification');
const Transaction = require('./models/Transaction');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Ride.deleteMany({});
  await Notification.deleteMany({});
  await Transaction.deleteMany({});
  console.log('✅ Database cleared');
};

const seedUsers = async () => {
  console.log('👤 Seeding users...');

  // Admin users
  const admins = [
    {
      name: 'Admin User',
      email: 'admin@rydo.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      isActive: true,
      wallet: 0
    },
    {
      name: 'Super Admin',
      email: 'superadmin@rydo.com',
      phone: '9999999998',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      isActive: true,
      wallet: 0
    }
  ];

  // Customer users
  const customers = [
    {
      name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      phone: '9876543210',
      password: 'customer123',
      role: 'customer',
      isVerified: true,
      isActive: true,
      wallet: 1500,
      customerDetails: {
        addresses: [
          { type: 'home', address: '123, MG Road, Bangalore', coordinates: [77.5946, 12.9716] },
          { type: 'work', address: 'Whitefield IT Park, Bangalore', coordinates: [77.7480, 12.9698] }
        ],
        totalRides: 25,
        rating: 4.8
      }
    },
    {
      name: 'Priya Patel',
      email: 'priya@gmail.com',
      phone: '9876543211',
      password: 'customer123',
      role: 'customer',
      isVerified: true,
      isActive: true,
      wallet: 2500,
      customerDetails: {
        addresses: [
          { type: 'home', address: '45, Koramangala, Bangalore', coordinates: [77.6245, 12.9352] },
          { type: 'work', address: 'HSR Layout, Bangalore', coordinates: [77.6501, 12.9121] }
        ],
        totalRides: 42,
        rating: 4.9
      }
    },
    {
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '9876543212',
      password: 'customer123',
      role: 'customer',
      isVerified: true,
      isActive: true,
      wallet: 800,
      customerDetails: {
        addresses: [
          { type: 'home', address: '78, Indiranagar, Bangalore', coordinates: [77.6408, 12.9784] }
        ],
        totalRides: 15,
        rating: 4.6
      }
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha@gmail.com',
      phone: '9876543213',
      password: 'customer123',
      role: 'customer',
      isVerified: true,
      isActive: true,
      wallet: 3200,
      customerDetails: {
        addresses: [
          { type: 'home', address: '12, JP Nagar, Bangalore', coordinates: [77.5856, 12.9063] },
          { type: 'work', address: 'Electronic City, Bangalore', coordinates: [77.6700, 12.8458] }
        ],
        totalRides: 67,
        rating: 4.7
      }
    },
    {
      name: 'Vikram Singh',
      email: 'vikram@gmail.com',
      phone: '9876543214',
      password: 'customer123',
      role: 'customer',
      isVerified: true,
      isActive: true,
      wallet: 500,
      customerDetails: {
        addresses: [
          { type: 'home', address: '56, Marathahalli, Bangalore', coordinates: [77.7011, 12.9591] }
        ],
        totalRides: 8,
        rating: 4.5
      }
    }
  ];

  // Driver users
  const drivers = [
    {
      name: 'Raj Kumar',
      email: 'raj.driver@gmail.com',
      phone: '8765432109',
      password: 'driver123',
      role: 'driver',
      isVerified: true,
      isActive: true,
      wallet: 0,
      driverDetails: {
        licenseNumber: 'KA0120190012345',
        vehicleType: 'bike',
        vehicleNumber: 'KA01AB1234',
        vehicleModel: 'Honda Activa 6G',
        isOnline: true,
        rating: 4.7,
        totalRides: 156,
        earnings: 45600,
        documents: {
          license: 'license_raj.jpg',
          rc: 'rc_raj.jpg',
          insurance: 'insurance_raj.jpg',
          photo: 'photo_raj.jpg'
        },
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716]
        }
      }
    },
    {
      name: 'Suresh Babu',
      email: 'suresh.driver@gmail.com',
      phone: '8765432108',
      password: 'driver123',
      role: 'driver',
      isVerified: true,
      isActive: true,
      wallet: 0,
      driverDetails: {
        licenseNumber: 'KA0220180054321',
        vehicleType: 'auto',
        vehicleNumber: 'KA02CD5678',
        vehicleModel: 'Bajaj RE Auto',
        isOnline: true,
        rating: 4.5,
        totalRides: 230,
        earnings: 78900,
        documents: {
          license: 'license_suresh.jpg',
          rc: 'rc_suresh.jpg',
          insurance: 'insurance_suresh.jpg',
          photo: 'photo_suresh.jpg'
        },
        location: {
          type: 'Point',
          coordinates: [77.6245, 12.9352]
        }
      }
    },
    {
      name: 'Mahesh Yadav',
      email: 'mahesh.driver@gmail.com',
      phone: '8765432107',
      password: 'driver123',
      role: 'driver',
      isVerified: true,
      isActive: true,
      wallet: 0,
      driverDetails: {
        licenseNumber: 'KA0320170098765',
        vehicleType: 'bike',
        vehicleNumber: 'KA03EF9012',
        vehicleModel: 'TVS Apache RTR 160',
        isOnline: false,
        rating: 4.8,
        totalRides: 312,
        earnings: 92400,
        documents: {
          license: 'license_mahesh.jpg',
          rc: 'rc_mahesh.jpg',
          insurance: 'insurance_mahesh.jpg',
          photo: 'photo_mahesh.jpg'
        },
        location: {
          type: 'Point',
          coordinates: [77.6408, 12.9784]
        }
      }
    },
    {
      name: 'Deepak Verma',
      email: 'deepak.driver@gmail.com',
      phone: '8765432106',
      password: 'driver123',
      role: 'driver',
      isVerified: true,
      isActive: true,
      wallet: 0,
      driverDetails: {
        licenseNumber: 'KA0420160045678',
        vehicleType: 'mini-truck',
        vehicleNumber: 'KA04GH3456',
        vehicleModel: 'Tata Ace',
        isOnline: true,
        rating: 4.6,
        totalRides: 89,
        earnings: 125600,
        documents: {
          license: 'license_deepak.jpg',
          rc: 'rc_deepak.jpg',
          insurance: 'insurance_deepak.jpg',
          photo: 'photo_deepak.jpg'
        },
        location: {
          type: 'Point',
          coordinates: [77.5856, 12.9063]
        }
      }
    },
    {
      name: 'Ankit Chauhan',
      email: 'ankit.driver@gmail.com',
      phone: '8765432105',
      password: 'driver123',
      role: 'driver',
      isVerified: false,
      isActive: true,
      wallet: 0,
      driverDetails: {
        licenseNumber: 'KA0520200087654',
        vehicleType: 'bike',
        vehicleNumber: 'KA05IJ7890',
        vehicleModel: 'Bajaj Pulsar 150',
        isOnline: false,
        rating: 4.3,
        totalRides: 45,
        earnings: 12800,
        documents: {
          license: 'license_ankit.jpg',
          rc: 'rc_ankit.jpg',
          insurance: 'insurance_ankit.jpg',
          photo: 'photo_ankit.jpg'
        },
        location: {
          type: 'Point',
          coordinates: [77.7011, 12.9591]
        }
      }
    }
  ];

  const createdAdmins = await User.create(admins);
  const createdCustomers = await User.create(customers);
  const createdDrivers = await User.create(drivers);

  console.log(`  ✅ Created ${createdAdmins.length} admins`);
  console.log(`  ✅ Created ${createdCustomers.length} customers`);
  console.log(`  ✅ Created ${createdDrivers.length} drivers`);

  return { admins: createdAdmins, customers: createdCustomers, drivers: createdDrivers };
};

const seedRides = async (customers, drivers) => {
  console.log('🚗 Seeding rides...');

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const rides = [
    // Completed rides (past)
    {
      customer: customers[0]._id,
      driver: drivers[0]._id,
      serviceType: 'bike-taxi',
      pickup: { address: '123, MG Road, Bangalore', coordinates: [77.5946, 12.9716] },
      destination: { address: 'Whitefield IT Park, Bangalore', coordinates: [77.7480, 12.9698] },
      status: 'completed',
      distance: 15.2,
      fare: { baseFare: 25, distanceFare: 122, total: 147, commission: 29, driverEarning: 118 },
      payment: { method: 'online', status: 'completed', transactionId: 'TXN_001' },
      timeline: {
        requested: new Date(now - 86400000 * 5),
        accepted: new Date(now - 86400000 * 5 + 120000),
        started: new Date(now - 86400000 * 5 + 600000),
        completed: new Date(now - 86400000 * 5 + 2400000)
      },
      rating: { customerRating: 5, driverRating: 4, customerFeedback: 'Great ride!', driverFeedback: 'Polite customer' },
      createdAt: new Date(now - 86400000 * 5)
    },
    {
      customer: customers[1]._id,
      driver: drivers[1]._id,
      serviceType: 'auto',
      pickup: { address: '45, Koramangala, Bangalore', coordinates: [77.6245, 12.9352] },
      destination: { address: 'HSR Layout, Bangalore', coordinates: [77.6501, 12.9121] },
      status: 'completed',
      distance: 4.5,
      fare: { baseFare: 40, distanceFare: 54, total: 94, commission: 19, driverEarning: 75 },
      payment: { method: 'wallet', status: 'completed', transactionId: 'WALLET_001' },
      timeline: {
        requested: new Date(now - 86400000 * 4),
        accepted: new Date(now - 86400000 * 4 + 90000),
        started: new Date(now - 86400000 * 4 + 300000),
        completed: new Date(now - 86400000 * 4 + 1200000)
      },
      rating: { customerRating: 4, driverRating: 5 },
      createdAt: new Date(now - 86400000 * 4)
    },
    {
      customer: customers[2]._id,
      driver: drivers[2]._id,
      serviceType: 'bike-taxi',
      pickup: { address: '78, Indiranagar, Bangalore', coordinates: [77.6408, 12.9784] },
      destination: { address: 'MG Road Metro Station', coordinates: [77.6066, 12.9757] },
      status: 'completed',
      distance: 3.8,
      fare: { baseFare: 25, distanceFare: 30, total: 55, commission: 11, driverEarning: 44 },
      payment: { method: 'cash', status: 'completed', transactionId: 'CASH_001' },
      timeline: {
        requested: new Date(now - 86400000 * 3),
        accepted: new Date(now - 86400000 * 3 + 60000),
        started: new Date(now - 86400000 * 3 + 180000),
        completed: new Date(now - 86400000 * 3 + 900000)
      },
      rating: { customerRating: 5, driverRating: 5, customerFeedback: 'Smooth ride, quick service!' },
      createdAt: new Date(now - 86400000 * 3)
    },
    {
      customer: customers[3]._id,
      driver: drivers[3]._id,
      serviceType: 'mini-truck',
      pickup: { address: '12, JP Nagar, Bangalore', coordinates: [77.5856, 12.9063] },
      destination: { address: 'Electronic City, Bangalore', coordinates: [77.6700, 12.8458] },
      status: 'completed',
      distance: 12.3,
      fare: { baseFare: 100, distanceFare: 246, total: 346, commission: 69, driverEarning: 277 },
      payment: { method: 'online', status: 'completed', transactionId: 'TXN_002' },
      timeline: {
        requested: new Date(now - 86400000 * 2),
        accepted: new Date(now - 86400000 * 2 + 180000),
        started: new Date(now - 86400000 * 2 + 600000),
        completed: new Date(now - 86400000 * 2 + 3600000)
      },
      rating: { customerRating: 4, driverRating: 4 },
      createdAt: new Date(now - 86400000 * 2)
    },
    {
      customer: customers[0]._id,
      driver: drivers[2]._id,
      serviceType: 'bike-taxi',
      pickup: { address: 'Whitefield IT Park', coordinates: [77.7480, 12.9698] },
      destination: { address: '123, MG Road, Bangalore', coordinates: [77.5946, 12.9716] },
      status: 'completed',
      distance: 15.0,
      fare: { baseFare: 25, distanceFare: 120, total: 145, commission: 29, driverEarning: 116 },
      payment: { method: 'online', status: 'completed', transactionId: 'TXN_003' },
      timeline: {
        requested: new Date(now - 86400000 * 1),
        accepted: new Date(now - 86400000 * 1 + 90000),
        started: new Date(now - 86400000 * 1 + 300000),
        completed: new Date(now - 86400000 * 1 + 2700000)
      },
      rating: { customerRating: 5, driverRating: 5, customerFeedback: 'Always reliable!' },
      createdAt: new Date(now - 86400000 * 1)
    },
    // Today's completed rides
    {
      customer: customers[1]._id,
      driver: drivers[0]._id,
      serviceType: 'bike-taxi',
      pickup: { address: 'HSR Layout, Bangalore', coordinates: [77.6501, 12.9121] },
      destination: { address: 'Koramangala 4th Block', coordinates: [77.6168, 12.9352] },
      status: 'completed',
      distance: 5.2,
      fare: { baseFare: 25, distanceFare: 42, total: 67, commission: 13, driverEarning: 54 },
      payment: { method: 'wallet', status: 'completed', transactionId: 'WALLET_002' },
      timeline: {
        requested: new Date(today.getTime() + 28800000),
        accepted: new Date(today.getTime() + 28860000),
        started: new Date(today.getTime() + 29100000),
        completed: new Date(today.getTime() + 30600000)
      },
      rating: { customerRating: 5, driverRating: 5 },
      createdAt: new Date(today.getTime() + 28800000)
    },
    {
      customer: customers[4]._id,
      driver: drivers[1]._id,
      serviceType: 'auto',
      pickup: { address: 'Marathahalli Bridge', coordinates: [77.7011, 12.9591] },
      destination: { address: 'Silk Board Junction', coordinates: [77.6224, 12.9177] },
      status: 'completed',
      distance: 9.8,
      fare: { baseFare: 40, distanceFare: 118, total: 158, commission: 32, driverEarning: 126 },
      payment: { method: 'cash', status: 'completed', transactionId: 'CASH_002' },
      timeline: {
        requested: new Date(today.getTime() + 32400000),
        accepted: new Date(today.getTime() + 32520000),
        started: new Date(today.getTime() + 32700000),
        completed: new Date(today.getTime() + 34800000)
      },
      rating: { customerRating: 4, driverRating: 5 },
      createdAt: new Date(today.getTime() + 32400000)
    },
    // Active rides (in progress)
    {
      customer: customers[2]._id,
      driver: drivers[0]._id,
      serviceType: 'bike-taxi',
      pickup: { address: 'Indiranagar 12th Main', coordinates: [77.6408, 12.9784] },
      destination: { address: 'Ulsoor Lake', coordinates: [77.6200, 12.9820] },
      status: 'started',
      distance: 2.5,
      fare: { baseFare: 25, distanceFare: 20, total: 45, commission: 9, driverEarning: 36 },
      payment: { method: 'online', status: 'pending' },
      timeline: {
        requested: new Date(now - 600000),
        accepted: new Date(now - 540000),
        started: new Date(now - 300000)
      },
      createdAt: new Date(now - 600000)
    },
    {
      customer: customers[3]._id,
      driver: drivers[3]._id,
      serviceType: 'mini-truck',
      pickup: { address: 'JP Nagar 6th Phase', coordinates: [77.5856, 12.9063] },
      destination: { address: 'Bannerghatta Road', coordinates: [77.5979, 12.8887] },
      status: 'accepted',
      distance: 3.2,
      fare: { baseFare: 100, distanceFare: 64, total: 164, commission: 33, driverEarning: 131 },
      payment: { method: 'wallet', status: 'pending' },
      timeline: {
        requested: new Date(now - 180000),
        accepted: new Date(now - 120000)
      },
      createdAt: new Date(now - 180000)
    },
    // Requested rides (waiting for driver)
    {
      customer: customers[4]._id,
      serviceType: 'bike-taxi',
      pickup: { address: 'Marathahalli, Bangalore', coordinates: [77.7011, 12.9591] },
      destination: { address: 'Whitefield, Bangalore', coordinates: [77.7480, 12.9698] },
      status: 'requested',
      distance: 5.0,
      fare: { baseFare: 25, distanceFare: 40, total: 65, commission: 13, driverEarning: 52 },
      payment: { method: 'cash', status: 'pending' },
      timeline: {
        requested: new Date(now - 60000)
      },
      createdAt: new Date(now - 60000)
    },
    // Cancelled ride
    {
      customer: customers[0]._id,
      driver: drivers[4]._id,
      serviceType: 'bike-taxi',
      pickup: { address: 'MG Road, Bangalore', coordinates: [77.6066, 12.9757] },
      destination: { address: 'Koramangala', coordinates: [77.6245, 12.9352] },
      status: 'cancelled',
      distance: 4.0,
      fare: { baseFare: 25, distanceFare: 32, total: 57, commission: 11, driverEarning: 46 },
      payment: { method: 'online', status: 'pending' },
      cancellationReason: 'Driver took too long to arrive',
      timeline: {
        requested: new Date(now - 86400000 * 6),
        accepted: new Date(now - 86400000 * 6 + 120000),
        cancelled: new Date(now - 86400000 * 6 + 900000)
      },
      createdAt: new Date(now - 86400000 * 6)
    },
    // More completed rides for analytics
    {
      customer: customers[1]._id,
      driver: drivers[2]._id,
      serviceType: 'bike-taxi',
      pickup: { address: 'BTM Layout, Bangalore', coordinates: [77.6101, 12.9166] },
      destination: { address: 'Silk Board', coordinates: [77.6224, 12.9177] },
      status: 'completed',
      distance: 2.0,
      fare: { baseFare: 25, distanceFare: 16, total: 41, commission: 8, driverEarning: 33 },
      payment: { method: 'cash', status: 'completed', transactionId: 'CASH_003' },
      timeline: {
        requested: new Date(now - 86400000 * 7),
        accepted: new Date(now - 86400000 * 7 + 60000),
        started: new Date(now - 86400000 * 7 + 180000),
        completed: new Date(now - 86400000 * 7 + 600000)
      },
      rating: { customerRating: 4, driverRating: 4 },
      createdAt: new Date(now - 86400000 * 7)
    },
    {
      customer: customers[3]._id,
      driver: drivers[1]._id,
      serviceType: 'auto',
      pickup: { address: 'Electronic City Phase 1', coordinates: [77.6700, 12.8458] },
      destination: { address: 'Bommanahalli', coordinates: [77.6184, 12.9029] },
      status: 'completed',
      distance: 8.5,
      fare: { baseFare: 40, distanceFare: 102, total: 142, commission: 28, driverEarning: 114 },
      payment: { method: 'online', status: 'completed', transactionId: 'TXN_004' },
      timeline: {
        requested: new Date(now - 86400000 * 8),
        accepted: new Date(now - 86400000 * 8 + 120000),
        started: new Date(now - 86400000 * 8 + 420000),
        completed: new Date(now - 86400000 * 8 + 2400000)
      },
      rating: { customerRating: 5, driverRating: 5 },
      createdAt: new Date(now - 86400000 * 8)
    },
    {
      customer: customers[2]._id,
      driver: drivers[0]._id,
      serviceType: 'courier',
      pickup: { address: 'Indiranagar, Bangalore', coordinates: [77.6408, 12.9784] },
      destination: { address: 'Jayanagar, Bangalore', coordinates: [77.5826, 12.9308] },
      status: 'completed',
      distance: 7.0,
      fare: { baseFare: 20, distanceFare: 42, total: 62, commission: 12, driverEarning: 50 },
      payment: { method: 'online', status: 'completed', transactionId: 'TXN_005' },
      timeline: {
        requested: new Date(now - 86400000 * 9),
        accepted: new Date(now - 86400000 * 9 + 60000),
        started: new Date(now - 86400000 * 9 + 240000),
        completed: new Date(now - 86400000 * 9 + 1800000)
      },
      rating: { customerRating: 5, driverRating: 4 },
      createdAt: new Date(now - 86400000 * 9)
    },
    {
      customer: customers[4]._id,
      driver: drivers[2]._id,
      serviceType: 'bike-taxi',
      pickup: { address: 'Marathahalli', coordinates: [77.7011, 12.9591] },
      destination: { address: 'KR Puram', coordinates: [77.6960, 13.0048] },
      status: 'completed',
      distance: 6.0,
      fare: { baseFare: 25, distanceFare: 48, total: 73, commission: 15, driverEarning: 58 },
      payment: { method: 'wallet', status: 'completed', transactionId: 'WALLET_003' },
      timeline: {
        requested: new Date(now - 86400000 * 10),
        accepted: new Date(now - 86400000 * 10 + 90000),
        started: new Date(now - 86400000 * 10 + 300000),
        completed: new Date(now - 86400000 * 10 + 1500000)
      },
      rating: { customerRating: 4, driverRating: 5 },
      createdAt: new Date(now - 86400000 * 10)
    }
  ];

  const createdRides = await Ride.create(rides);
  console.log(`  ✅ Created ${createdRides.length} rides`);
  return createdRides;
};

const seedNotifications = async (customers, drivers, admins) => {
  console.log('🔔 Seeding notifications...');

  const now = new Date();
  const notifications = [
    // Customer notifications
    {
      userId: customers[0]._id,
      type: 'ride_update',
      title: 'Ride Completed',
      message: 'Your ride from MG Road to Whitefield has been completed. Total fare: ₹147',
      isRead: true,
      priority: 'medium',
      createdAt: new Date(now - 86400000 * 5)
    },
    {
      userId: customers[0]._id,
      type: 'promotion',
      title: '20% Off This Weekend!',
      message: 'Use code WEEKEND20 to get 20% off on your next ride. Valid till Sunday!',
      isRead: false,
      priority: 'low',
      createdAt: new Date(now - 86400000 * 1)
    },
    {
      userId: customers[0]._id,
      type: 'system',
      title: 'Welcome to RYDO!',
      message: 'Thank you for joining RYDO. Book your first ride and get ₹50 cashback!',
      isRead: true,
      priority: 'medium',
      createdAt: new Date(now - 86400000 * 30)
    },
    {
      userId: customers[1]._id,
      type: 'ride_update',
      title: 'Driver Assigned',
      message: 'Suresh Babu is on the way to pick you up. ETA: 5 minutes.',
      isRead: true,
      priority: 'high',
      createdAt: new Date(now - 86400000 * 4)
    },
    {
      userId: customers[1]._id,
      type: 'promotion',
      title: 'Refer & Earn ₹100',
      message: 'Share your referral code with friends and earn ₹100 for each successful signup!',
      isRead: false,
      priority: 'low',
      createdAt: new Date(now - 86400000 * 2)
    },
    {
      userId: customers[2]._id,
      type: 'security',
      title: 'New Login Detected',
      message: 'A new login was detected from Chrome on Windows. If this wasn\'t you, please change your password.',
      isRead: false,
      priority: 'high',
      actionRequired: true,
      createdAt: new Date(now - 3600000)
    },
    {
      userId: customers[3]._id,
      type: 'ride_update',
      title: 'Ride Cancelled',
      message: 'Your ride request has been cancelled. No charges applied.',
      isRead: true,
      priority: 'medium',
      createdAt: new Date(now - 86400000 * 6)
    },
    {
      userId: customers[4]._id,
      type: 'system',
      title: 'Profile Updated',
      message: 'Your profile information has been updated successfully.',
      isRead: true,
      priority: 'low',
      createdAt: new Date(now - 86400000 * 3)
    },
    // Driver notifications
    {
      userId: drivers[0]._id,
      type: 'ride_update',
      title: 'New Ride Request',
      message: 'New bike-taxi request from Indiranagar. Distance: 2.5 km. Fare: ₹45',
      isRead: false,
      priority: 'high',
      actionRequired: true,
      createdAt: new Date(now - 600000)
    },
    {
      userId: drivers[0]._id,
      type: 'system',
      title: 'Weekly Earnings Summary',
      message: 'You earned ₹3,450 this week from 28 rides. Great work!',
      isRead: true,
      priority: 'medium',
      createdAt: new Date(now - 86400000 * 1)
    },
    {
      userId: drivers[1]._id,
      type: 'promotion',
      title: 'Peak Hours Bonus',
      message: 'Earn 1.5x during peak hours (8-10 AM, 5-8 PM). Go online now!',
      isRead: false,
      priority: 'medium',
      createdAt: new Date(now - 7200000)
    },
    {
      userId: drivers[2]._id,
      type: 'system',
      title: 'Documents Verified',
      message: 'Your driving license and vehicle RC have been verified successfully.',
      isRead: true,
      priority: 'medium',
      createdAt: new Date(now - 86400000 * 10)
    },
    {
      userId: drivers[3]._id,
      type: 'ride_update',
      title: 'Customer Waiting',
      message: 'Customer Sneha Reddy is waiting at JP Nagar 6th Phase. Please arrive soon.',
      isRead: false,
      priority: 'high',
      createdAt: new Date(now - 120000)
    },
    // Admin notifications
    {
      userId: admins[0]._id,
      type: 'system',
      title: 'New Driver Registration',
      message: 'Ankit Chauhan has registered as a new driver. Documents pending verification.',
      isRead: false,
      priority: 'medium',
      actionRequired: true,
      createdAt: new Date(now - 3600000)
    },
    {
      userId: admins[0]._id,
      type: 'system',
      title: 'Daily Report Available',
      message: 'Today\'s report: 15 rides completed, Revenue ₹2,340, 3 new signups.',
      isRead: false,
      priority: 'low',
      createdAt: new Date(now - 7200000)
    },
    {
      userId: admins[0]._id,
      type: 'warning',
      title: 'High Cancellation Rate',
      message: 'Cancellation rate is at 15% today. Consider reviewing driver allocation.',
      isRead: false,
      priority: 'high',
      actionRequired: true,
      createdAt: new Date(now - 10800000)
    }
  ];

  const createdNotifications = await Notification.create(notifications);
  console.log(`  ✅ Created ${createdNotifications.length} notifications`);
  return createdNotifications;
};

const seedTransactions = async (customers) => {
  console.log('💰 Seeding transactions...');

  const now = new Date();
  const transactions = [
    // Customer 0 (Rahul) transactions
    {
      user: customers[0]._id,
      type: 'credit',
      category: 'wallet_topup',
      amount: 1000,
      balance: 1000,
      description: 'Wallet top-up via UPI',
      payment: { method: 'online', gateway: 'razorpay', status: 'success' },
      createdAt: new Date(now - 86400000 * 20)
    },
    {
      user: customers[0]._id,
      type: 'debit',
      category: 'ride_payment',
      amount: 147,
      balance: 853,
      description: 'Ride payment - MG Road to Whitefield',
      payment: { method: 'wallet', status: 'success' },
      createdAt: new Date(now - 86400000 * 5)
    },
    {
      user: customers[0]._id,
      type: 'credit',
      category: 'wallet_topup',
      amount: 500,
      balance: 1353,
      description: 'Wallet top-up via Card',
      payment: { method: 'online', gateway: 'razorpay', status: 'success' },
      createdAt: new Date(now - 86400000 * 3)
    },
    {
      user: customers[0]._id,
      type: 'credit',
      category: 'bonus',
      amount: 50,
      balance: 1403,
      description: 'Referral bonus - Friend joined RYDO',
      payment: { method: 'wallet', status: 'success' },
      createdAt: new Date(now - 86400000 * 2)
    },
    {
      user: customers[0]._id,
      type: 'credit',
      category: 'refund',
      amount: 97,
      balance: 1500,
      description: 'Refund for cancelled ride',
      payment: { method: 'wallet', status: 'success' },
      createdAt: new Date(now - 86400000 * 1)
    },
    // Customer 1 (Priya) transactions
    {
      user: customers[1]._id,
      type: 'credit',
      category: 'wallet_topup',
      amount: 2000,
      balance: 2000,
      description: 'Wallet top-up via UPI',
      payment: { method: 'online', gateway: 'razorpay', status: 'success' },
      createdAt: new Date(now - 86400000 * 15)
    },
    {
      user: customers[1]._id,
      type: 'debit',
      category: 'ride_payment',
      amount: 94,
      balance: 1906,
      description: 'Ride payment - Koramangala to HSR Layout',
      payment: { method: 'wallet', status: 'success' },
      createdAt: new Date(now - 86400000 * 4)
    },
    {
      user: customers[1]._id,
      type: 'credit',
      category: 'wallet_topup',
      amount: 1000,
      balance: 2906,
      description: 'Wallet top-up via Net Banking',
      payment: { method: 'online', gateway: 'razorpay', status: 'success' },
      createdAt: new Date(now - 86400000 * 2)
    },
    {
      user: customers[1]._id,
      type: 'debit',
      category: 'ride_payment',
      amount: 67,
      balance: 2839,
      description: 'Ride payment - HSR to Koramangala',
      payment: { method: 'wallet', status: 'success' },
      createdAt: new Date(now - 86400000 * 0.5)
    },
    // Customer 3 (Sneha) transactions
    {
      user: customers[3]._id,
      type: 'credit',
      category: 'wallet_topup',
      amount: 5000,
      balance: 5000,
      description: 'Wallet top-up via UPI',
      payment: { method: 'online', gateway: 'razorpay', status: 'success' },
      createdAt: new Date(now - 86400000 * 25)
    },
    {
      user: customers[3]._id,
      type: 'debit',
      category: 'ride_payment',
      amount: 346,
      balance: 4654,
      description: 'Ride payment - JP Nagar to Electronic City',
      payment: { method: 'wallet', status: 'success' },
      createdAt: new Date(now - 86400000 * 2)
    },
    {
      user: customers[3]._id,
      type: 'credit',
      category: 'bonus',
      amount: 100,
      balance: 4754,
      description: 'Loyalty bonus - Gold member reward',
      payment: { method: 'wallet', status: 'success' },
      createdAt: new Date(now - 86400000 * 1)
    }
  ];

  const createdTransactions = await Transaction.create(transactions);
  console.log(`  ✅ Created ${createdTransactions.length} transactions`);
  return createdTransactions;
};

const seedDatabase = async () => {
  console.log('\n🌱 Starting RYDO Database Seed...\n');
  
  await connectDB();
  await clearDatabase();

  const { admins, customers, drivers } = await seedUsers();
  await seedRides(customers, drivers);
  await seedNotifications(customers, drivers, admins);
  await seedTransactions(customers);

  console.log('\n' + '='.repeat(50));
  console.log('✅ Database seeded successfully!');
  console.log('='.repeat(50));
  console.log('\n📋 Login Credentials:');
  console.log('─'.repeat(40));
  console.log('Admin:    admin@rydo.com / admin123');
  console.log('Customer: rahul@gmail.com / customer123');
  console.log('Customer: priya@gmail.com / customer123');
  console.log('Customer: amit@gmail.com / customer123');
  console.log('Customer: sneha@gmail.com / customer123');
  console.log('Customer: vikram@gmail.com / customer123');
  console.log('Driver:   raj.driver@gmail.com / driver123');
  console.log('Driver:   suresh.driver@gmail.com / driver123');
  console.log('Driver:   mahesh.driver@gmail.com / driver123');
  console.log('Driver:   deepak.driver@gmail.com / driver123');
  console.log('Driver:   ankit.driver@gmail.com / driver123');
  console.log('─'.repeat(40));
  console.log('\n');

  await mongoose.connection.close();
  process.exit(0);
};

seedDatabase().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
