const express = require('express');
const User = require('../models/User');
const Ride = require('../models/Ride');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rydo_secret');
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') throw new Error();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Admin authentication required' });
  }
};

// Get admin dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const onlineDrivers = await User.countDocuments({ 
      role: 'driver', 
      'driverDetails.isOnline': true 
    });
    
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const todayRides = await Ride.countDocuments({ createdAt: { $gte: today } });
    const monthRides = await Ride.countDocuments({ createdAt: { $gte: thisMonth } });
    
    // Get revenue
    const completedRidesWithRevenue = await Ride.find({ 
      status: 'completed',
      'payment.status': 'completed'
    });
    
    const totalRevenue = completedRidesWithRevenue.reduce((sum, ride) => sum + ride.fare.total, 0);
    const totalCommission = completedRidesWithRevenue.reduce((sum, ride) => sum + ride.fare.commission, 0);
    
    const todayRevenue = completedRidesWithRevenue
      .filter(ride => ride.createdAt >= today)
      .reduce((sum, ride) => sum + ride.fare.total, 0);
    
    const monthRevenue = completedRidesWithRevenue
      .filter(ride => ride.createdAt >= thisMonth)
      .reduce((sum, ride) => sum + ride.fare.total, 0);
    
    // Service type breakdown
    const serviceStats = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$serviceType', count: { $sum: 1 }, revenue: { $sum: '$fare.total' } } }
    ]);
    
    // Recent rides
    const recentRides = await Ride.find()
      .populate('customer', 'name phone')
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      dashboard: {
        users: {
          total: totalUsers,
          customers: totalCustomers,
          drivers: totalDrivers,
          onlineDrivers
        },
        rides: {
          total: totalRides,
          completed: completedRides,
          today: todayRides,
          month: monthRides,
          completionRate: totalRides > 0 ? ((completedRides / totalRides) * 100).toFixed(1) : 0
        },
        revenue: {
          total: Math.round(totalRevenue),
          commission: Math.round(totalCommission),
          today: Math.round(todayRevenue),
          month: Math.round(monthRevenue)
        },
        serviceStats,
        recentRides
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users with pagination
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all rides with pagination
router.get('/rides', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, serviceType } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    
    const rides = await Ride.find(query)
      .populate('customer', 'name phone')
      .populate('driver', 'name phone driverDetails.vehicleNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Ride.countDocuments(query);
    
    res.json({
      success: true,
      rides,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user status
router.put('/users/:userId/status', authenticateAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update ride status
router.put('/rides/:rideId/status', authenticateAdmin, async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    ride.status = status;
    ride.timeline[status] = new Date();
    
    if (status === 'cancelled' && cancellationReason) {
      ride.cancellationReason = cancellationReason;
    }

    if (status === 'completed') {
      await User.findByIdAndUpdate(ride.driver, {
        $inc: {
          'driverDetails.totalRides': 1,
          'driverDetails.earnings': ride.fare.driverEarning
        }
      });

      await User.findByIdAndUpdate(ride.customer, {
        $inc: { 'customerDetails.totalRides': 1 }
      });

      ride.payment.status = 'completed';
    }

    await ride.save();
    
    res.json({
      success: true,
      message: 'Ride status updated successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get analytics data
router.get('/analytics', authenticateAdmin, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    // Daily ride counts
    const dailyRides = await Ride.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$fare.total' },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Service type distribution
    const serviceDistribution = await Ride.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          revenue: { $sum: '$fare.total' }
        }
      }
    ]);
    
    // Top drivers
    const topDrivers = await Ride.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate },
          status: 'completed',
          driver: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$driver',
          rides: { $sum: 1 },
          earnings: { $sum: '$fare.driverEarning' }
        }
      },
      { $sort: { rides: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'driver'
        }
      },
      { $unwind: '$driver' },
      {
        $project: {
          name: '$driver.name',
          phone: '$driver.phone',
          rides: 1,
          earnings: 1
        }
      }
    ]);
    
    res.json({
      success: true,
      analytics: {
        period,
        dailyRides,
        serviceDistribution,
        topDrivers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify driver documents
router.put('/drivers/:driverId/verify', authenticateAdmin, async (req, res) => {
  try {
    const { isVerified } = req.body;
    
    const driver = await User.findOneAndUpdate(
      { _id: req.params.driverId, role: 'driver' },
      { isVerified },
      { new: true }
    ).select('-password');
    
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    res.json({
      success: true,
      message: `Driver ${isVerified ? 'verified' : 'unverified'} successfully`,
      driver
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get system settings
router.get('/settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = {
      commissionRate: 0.2,
      minimumFare: 25,
      services: {
        'bike-taxi': { enabled: true, baseFare: 25, perKmRate: 8 },
        'courier': { enabled: true, baseFare: 20, perKmRate: 6 },
        'auto': { enabled: false, baseFare: 40, perKmRate: 12 },
        'mini-truck': { enabled: false, baseFare: 100, perKmRate: 20 },
        'truck': { enabled: false, baseFare: 200, perKmRate: 35 }
      }
    };
    
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get admin profile
router.get('/profile', authenticateAdmin, async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.json({ success: true, profile: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update admin profile
router.put('/profile', authenticateAdmin, async (req, res) => {
  try {
    const { name, phone, email, department } = req.body;
    
    const admin = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, email, department, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: admin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update driver details
router.put('/drivers/:driverId', authenticateAdmin, async (req, res) => {
  try {
    const { status, verificationStatus, phone, email } = req.body;
    
    const driver = await User.findOneAndUpdate(
      { _id: req.params.driverId, role: 'driver' },
      { 
        status,
        phone,
        email,
        'driverDetails.verificationStatus': verificationStatus,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.json({
      success: true,
      message: 'Driver updated successfully',
      driver
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update driver status
router.put('/drivers/:driverId/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const driver = await User.findOneAndUpdate(
      { _id: req.params.driverId, role: 'driver' },
      { status, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.json({
      success: true,
      message: 'Driver status updated successfully',
      driver
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Contact driver
router.post('/drivers/contact', authenticateAdmin, async (req, res) => {
  try {
    const { driverId, message } = req.body;
    
    // Log contact attempt
    console.log(`Admin ${req.user._id} contacted driver ${driverId}: ${message}`);
    
    // Here you could send SMS, email, or push notification
    // For now, just return success
    res.json({
      success: true,
      message: 'Driver contacted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get advanced filters
router.get('/drivers/advanced-filters', authenticateAdmin, async (req, res) => {
  try {
    const filters = {
      locations: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'],
      vehicleTypes: ['bike', 'auto', 'car'],
      experienceLevels: ['new', 'experienced', 'expert'],
      ratings: [1, 2, 3, 4, 5]
    };
    
    res.json({
      success: true,
      filters
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Log admin activity
router.post('/activity-log', authenticateAdmin, async (req, res) => {
  try {
    const { action, page, section, tab } = req.body;
    
    // Log activity (in production, you might want to store this in a separate collection)
    console.log(`Admin ${req.user._id} performed action: ${action} in section: ${section}`, {
      page,
      tab,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message: 'Activity logged successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;