const User = require('../models/User');
const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

const adminController = {
  // Get dashboard statistics
  getDashboard: async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      // User statistics
      const totalUsers = await User.countDocuments();
      const totalCustomers = await User.countDocuments({ role: 'customer' });
      const totalDrivers = await User.countDocuments({ role: 'driver' });
      const onlineDrivers = await User.countDocuments({ 
        role: 'driver', 
        'driverDetails.isOnline': true 
      });

      // Ride statistics
      const totalRides = await Ride.countDocuments();
      const completedRides = await Ride.countDocuments({ status: 'completed' });
      const todayRides = await Ride.countDocuments({ 
        createdAt: { $gte: today } 
      });
      const monthRides = await Ride.countDocuments({ 
        createdAt: { $gte: thisMonth } 
      });

      // Revenue statistics
      const totalRevenue = await Ride.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$fare.total' } } }
      ]);

      const todayRevenue = await Ride.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: today }
          } 
        },
        { $group: { _id: null, total: { $sum: '$fare.total' } } }
      ]);

      const monthRevenue = await Ride.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: thisMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$fare.total' } } }
      ]);

      // Recent rides
      const recentRides = await Ride.find()
        .populate('customer', 'name phone')
        .populate('driver', 'name phone')
        .sort({ createdAt: -1 })
        .limit(10);

      // Completion rate
      const completionRate = totalRides > 0 ? 
        Math.round((completedRides / totalRides) * 100) : 0;

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
            completionRate
          },
          revenue: {
            total: totalRevenue[0]?.total || 0,
            today: todayRevenue[0]?.total || 0,
            month: monthRevenue[0]?.total || 0
          },
          recentRides
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get all users with filters
  getUsers: async (req, res) => {
    try {
      const { role, page = 1, limit = 10, search } = req.query;
      
      let query = {};
      if (role && role !== 'all') {
        query.role = role;
      }
      
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
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get all rides with filters
  getRides: async (req, res) => {
    try {
      const { status, page = 1, limit = 10, search } = req.query;
      
      let query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (search) {
        // Search in ride ID or populate customer/driver names
        query.rideId = { $regex: search, $options: 'i' };
      }

      const rides = await Ride.find(query)
        .populate('customer', 'name phone')
        .populate('driver', 'name phone')
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
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update user status
  updateUserStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { isActive, updatedAt: Date.now() },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User status updated successfully',
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update ride status
  updateRideStatus: async (req, res) => {
    try {
      const { rideId } = req.params;
      const { status, cancellationReason } = req.body;

      const ride = await Ride.findById(rideId);
      if (!ride) {
        return res.status(404).json({
          success: false,
          message: 'Ride not found'
        });
      }

      ride.status = status;
      ride.timeline[status] = new Date();
      
      if (status === 'cancelled' && cancellationReason) {
        ride.cancellationReason = cancellationReason;
      }

      if (status === 'completed') {
        // Update driver earnings
        await User.findByIdAndUpdate(ride.driver, {
          $inc: {
            'driverDetails.totalRides': 1,
            'driverDetails.earnings': ride.fare.driverEarning
          }
        });

        // Update customer ride count
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
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get admin profile
  getProfile: async (req, res) => {
    try {
      const admin = await User.findById(req.user.id).select('-password');
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.json({
        success: true,
        profile: admin
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update admin profile
  updateProfile: async (req, res) => {
    try {
      const { name, phone, email, department } = req.body;
      
      const admin = await User.findByIdAndUpdate(
        req.user.id,
        { 
          name, 
          phone, 
          email, 
          department,
          updatedAt: Date.now()
        },
        { new: true }
      ).select('-password');

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        profile: admin
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update driver details
  updateDriver: async (req, res) => {
    try {
      const { driverId } = req.params;
      const { status, verificationStatus, phone, email } = req.body;
      
      const driver = await User.findOneAndUpdate(
        { _id: driverId, role: 'driver' },
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
        return res.status(404).json({
          success: false,
          message: 'Driver not found'
        });
      }

      res.json({
        success: true,
        message: 'Driver updated successfully',
        driver
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update driver status
  updateDriverStatus: async (req, res) => {
    try {
      const { driverId } = req.params;
      const { status } = req.body;
      
      const driver = await User.findOneAndUpdate(
        { _id: driverId, role: 'driver' },
        { 
          status,
          updatedAt: Date.now()
        },
        { new: true }
      ).select('-password');

      if (!driver) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found'
        });
      }

      res.json({
        success: true,
        message: 'Driver status updated successfully',
        driver
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = adminController;