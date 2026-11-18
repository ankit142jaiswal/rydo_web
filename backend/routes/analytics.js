const express = require('express');
const User = require('../models/User');
const Ride = require('../models/Ride');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rydo_secret');
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication required' });
  }
};

// Get ride analytics
router.get('/rides', authenticate, async (req, res) => {
  try {
    const { period = '30d', groupBy = 'day' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = '%Y-%m-%d %H:00';
        break;
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-W%U';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }
    
    const query = { createdAt: { $gte: startDate } };
    
    // Filter by user role
    if (req.user.role === 'driver') {
      query.driver = req.user._id;
    } else if (req.user.role === 'customer') {
      query.customer = req.user._id;
    }
    
    const analytics = await Ride.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          totalRides: { $sum: 1 },
          completedRides: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelledRides: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          totalRevenue: { $sum: '$fare.total' },
          totalDistance: { $sum: '$distance' },
          avgFare: { $avg: '$fare.total' },
          avgDistance: { $avg: '$distance' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get service type analytics
router.get('/services', authenticate, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
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
        startDate.setDate(startDate.getDate() - 30);
    }
    
    const query = { createdAt: { $gte: startDate } };
    
    // Filter by user role
    if (req.user.role === 'driver') {
      query.driver = req.user._id;
    } else if (req.user.role === 'customer') {
      query.customer = req.user._id;
    }
    
    const serviceAnalytics = await Ride.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$serviceType',
          totalRides: { $sum: 1 },
          completedRides: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          totalRevenue: { $sum: '$fare.total' },
          avgFare: { $avg: '$fare.total' },
          totalDistance: { $sum: '$distance' },
          avgDistance: { $avg: '$distance' }
        }
      },
      { $sort: { totalRides: -1 } }
    ]);
    
    res.json({ success: true, serviceAnalytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get earnings analytics (for drivers)
router.get('/earnings', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Driver access required' });
    }
    
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
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
        startDate.setDate(startDate.getDate() - 30);
    }
    
    const earningsAnalytics = await Ride.aggregate([
      { 
        $match: { 
          driver: req.user._id,
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalEarnings: { $sum: '$fare.driverEarning' },
          totalRides: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          avgEarningPerRide: { $avg: '$fare.driverEarning' },
          avgEarningPerKm: { $avg: { $divide: ['$fare.driverEarning', '$distance'] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get total earnings summary
    const totalSummary = await Ride.aggregate([
      { 
        $match: { 
          driver: req.user._id,
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$fare.driverEarning' },
          totalRides: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          avgEarningPerRide: { $avg: '$fare.driverEarning' }
        }
      }
    ]);
    
    res.json({ 
      success: true, 
      earningsAnalytics,
      summary: totalSummary[0] || {
        totalEarnings: 0,
        totalRides: 0,
        totalDistance: 0,
        avgEarningPerRide: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get spending analytics (for customers)
router.get('/spending', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
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
        startDate.setDate(startDate.getDate() - 30);
    }
    
    const spendingAnalytics = await Ride.aggregate([
      { 
        $match: { 
          customer: req.user._id,
          'payment.status': 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSpending: { $sum: '$fare.total' },
          totalRides: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          avgSpendingPerRide: { $avg: '$fare.total' },
          avgSpendingPerKm: { $avg: { $divide: ['$fare.total', '$distance'] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get spending by service type
    const spendingByService = await Ride.aggregate([
      { 
        $match: { 
          customer: req.user._id,
          'payment.status': 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$serviceType',
          totalSpending: { $sum: '$fare.total' },
          totalRides: { $sum: 1 },
          avgSpending: { $avg: '$fare.total' }
        }
      },
      { $sort: { totalSpending: -1 } }
    ]);
    
    // Get total spending summary
    const totalSummary = await Ride.aggregate([
      { 
        $match: { 
          customer: req.user._id,
          'payment.status': 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSpending: { $sum: '$fare.total' },
          totalRides: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          avgSpendingPerRide: { $avg: '$fare.total' }
        }
      }
    ]);
    
    res.json({ 
      success: true, 
      spendingAnalytics,
      spendingByService,
      summary: totalSummary[0] || {
        totalSpending: 0,
        totalRides: 0,
        totalDistance: 0,
        avgSpendingPerRide: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get performance metrics
router.get('/performance', authenticate, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
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
        startDate.setDate(startDate.getDate() - 30);
    }
    
    const query = { createdAt: { $gte: startDate } };
    
    // Filter by user role
    if (req.user.role === 'driver') {
      query.driver = req.user._id;
    } else if (req.user.role === 'customer') {
      query.customer = req.user._id;
    }
    
    const performance = await Ride.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRides: { $sum: 1 },
          completedRides: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelledRides: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          avgRating: { 
            $avg: { 
              $cond: [
                { $eq: [req.user.role, 'driver'] },
                '$rating.driverRating',
                '$rating.customerRating'
              ]
            }
          },
          totalDistance: { $sum: '$distance' },
          avgDistance: { $avg: '$distance' },
          totalRevenue: { $sum: '$fare.total' }
        }
      }
    ]);
    
    const metrics = performance[0] || {
      totalRides: 0,
      completedRides: 0,
      cancelledRides: 0,
      avgRating: 0,
      totalDistance: 0,
      avgDistance: 0,
      totalRevenue: 0
    };
    
    // Calculate completion rate and cancellation rate
    metrics.completionRate = metrics.totalRides > 0 
      ? ((metrics.completedRides / metrics.totalRides) * 100).toFixed(1)
      : 0;
    
    metrics.cancellationRate = metrics.totalRides > 0 
      ? ((metrics.cancelledRides / metrics.totalRides) * 100).toFixed(1)
      : 0;
    
    res.json({ success: true, performance: metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;