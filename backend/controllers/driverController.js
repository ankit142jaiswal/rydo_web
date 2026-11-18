const mongoose = require('mongoose');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');

const driverController = {
  // Get driver dashboard
  getDashboard: async (req, res) => {
    try {
      const driverId = new mongoose.Types.ObjectId(req.user.userId);
      const driver = await User.findById(driverId);

      if (!driver || driver.role !== 'driver') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get ride statistics
      const totalRides = await Ride.countDocuments({ driver: driverId, status: 'completed' });
      const todayRides = await Ride.countDocuments({ 
        driver: driverId, 
        status: 'completed',
        createdAt: { $gte: today }
      });

      // Get earnings
      const earnings = await Ride.aggregate([
        { $match: { driver: driverId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$fare.driverEarning' } } }
      ]);

      const todayEarnings = await Ride.aggregate([
        { 
          $match: { 
            driver: driverId, 
            status: 'completed',
            createdAt: { $gte: today }
          } 
        },
        { $group: { _id: null, total: { $sum: '$fare.driverEarning' } } }
      ]);

      // Get active rides
      const activeRides = await Ride.find({
        driver: driverId,
        status: { $in: ['accepted', 'started'] }
      }).populate('customer', 'name phone');

      res.json({
        success: true,
        dashboard: {
          totalRides,
          todayRides,
          totalEarnings: earnings[0]?.total || 0,
          todayEarnings: todayEarnings[0]?.total || 0,
          isOnline: driver.driverDetails.isOnline,
          rating: driver.driverDetails.rating,
          activeRides
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Toggle online status
  toggleOnlineStatus: async (req, res) => {
    try {
      const driverId = req.user.userId;
      const { isOnline } = req.body;

      const driver = await User.findByIdAndUpdate(
        driverId,
        { 'driverDetails.isOnline': isOnline },
        { new: true }
      );

      res.json({
        success: true,
        message: `Driver is now ${isOnline ? 'online' : 'offline'}`,
        isOnline: driver.driverDetails.isOnline
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get ride history
  getRideHistory: async (req, res) => {
    try {
      const driverId = req.user.userId;
      const { page = 1, limit = 10 } = req.query;

      const rides = await Ride.find({ driver: driverId })
        .populate('customer', 'name phone')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Ride.countDocuments({ driver: driverId });

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
  },

  // Update ride status
  updateRideStatus: async (req, res) => {
    try {
      const { rideId } = req.params;
      const { status } = req.body;
      const driverId = req.user.userId;

      const ride = await Ride.findOne({ _id: rideId, driver: driverId });
      if (!ride) {
        return res.status(404).json({ success: false, message: 'Ride not found' });
      }

      ride.status = status;
      ride.timeline[status] = new Date();
      
      if (status === 'completed') {
        // Update driver earnings
        await User.findByIdAndUpdate(driverId, {
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
        message: 'Ride status updated',
        ride
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update driver profile
  updateProfile: async (req, res) => {
    try {
      const driverId = req.user.userId;
      const { name, phone, vehicleDetails } = req.body;

      const updateData = { name, phone, updatedAt: Date.now() };
      if (vehicleDetails) {
        updateData['driverDetails.vehicleType'] = vehicleDetails.vehicleType;
        updateData['driverDetails.vehicleNumber'] = vehicleDetails.vehicleNumber;
        updateData['driverDetails.vehicleModel'] = vehicleDetails.vehicleModel;
      }

      const driver = await User.findByIdAndUpdate(
        driverId,
        updateData,
        { new: true }
      ).select('-password');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        driver
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update location
  updateLocation: async (req, res) => {
    try {
      const driverId = req.user.userId;
      const { latitude, longitude } = req.body;

      await User.findByIdAndUpdate(driverId, {
        'driverDetails.location': {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        }
      });

      res.json({
        success: true,
        message: 'Location updated successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Log driver activity
  logActivity: async (req, res) => {
    try {
      const driverId = req.user.userId;
      const { action, newStatus, rideId, section } = req.body;
      
      // Log activity (in production, you might want to store this in a separate collection)
      console.log(`Driver ${driverId} performed action: ${action} in section: ${section}`, {
        newStatus,
        rideId,
        timestamp: new Date()
      });
      
      res.json({
        success: true,
        message: 'Activity logged successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = driverController;