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

// Get nearby drivers
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, serviceType, radius = 5 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }
    
    const vehicleTypeMap = {
      'bike-taxi': 'bike',
      'courier': 'bike',
      'auto': 'auto',
      'mini-truck': 'mini-truck',
      'truck': 'truck'
    };
    
    const requiredVehicleType = vehicleTypeMap[serviceType] || 'bike';
    
    const drivers = await User.find({
      role: 'driver',
      'driverDetails.isOnline': true,
      'driverDetails.vehicleType': requiredVehicleType,
      'driverDetails.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    }).select('name phone driverDetails').limit(10);
    
    res.json({ success: true, drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update driver location
router.post('/update-location', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Only drivers can update location' });
    }
    
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }
    
    await User.findByIdAndUpdate(req.user._id, {
      'driverDetails.location': {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });
    
    // Emit location update to connected customers
    const io = req.app.get('io');
    io.emit('driver_location_update', {
      driverId: req.user._id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });
    
    res.json({ success: true, message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle online/offline status
router.post('/toggle-status', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Only drivers can toggle status' });
    }
    
    const { isOnline } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'driverDetails.isOnline': isOnline },
      { new: true }
    );
    
    res.json({ 
      success: true, 
      message: `Driver is now ${isOnline ? 'online' : 'offline'}`,
      isOnline: user.driverDetails.isOnline
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get driver dashboard data
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Driver access required' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    // Get today's rides and earnings
    const todayRides = await Ride.find({
      driver: req.user._id,
      status: 'completed',
      createdAt: { $gte: today }
    });
    
    // Get this month's rides and earnings
    const monthRides = await Ride.find({
      driver: req.user._id,
      status: 'completed',
      createdAt: { $gte: thisMonth }
    });
    
    // Get pending rides
    const pendingRides = await Ride.find({
      driver: req.user._id,
      status: { $in: ['accepted', 'arrived', 'started'] }
    }).populate('customer', 'name phone');
    
    const todayEarnings = todayRides.reduce((sum, ride) => sum + ride.fare.driverEarning, 0);
    const monthEarnings = monthRides.reduce((sum, ride) => sum + ride.fare.driverEarning, 0);
    
    res.json({
      success: true,
      dashboard: {
        today: {
          rides: todayRides.length,
          earnings: todayEarnings
        },
        month: {
          rides: monthRides.length,
          earnings: monthEarnings
        },
        total: {
          rides: req.user.driverDetails.totalRides,
          earnings: req.user.driverDetails.earnings
        },
        rating: req.user.driverDetails.rating,
        isOnline: req.user.driverDetails.isOnline,
        pendingRides
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get driver earnings history
router.get('/earnings', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Driver access required' });
    }
    
    const { page = 1, limit = 20 } = req.query;
    
    const rides = await Ride.find({
      driver: req.user._id,
      status: 'completed'
    })
    .populate('customer', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const earnings = rides.map(ride => ({
      rideId: ride.rideId,
      customer: ride.customer.name,
      serviceType: ride.serviceType,
      distance: ride.distance,
      fare: ride.fare.total,
      commission: ride.fare.commission,
      earning: ride.fare.driverEarning,
      date: ride.createdAt,
      pickup: ride.pickup.address,
      destination: ride.destination.address
    }));
    
    res.json({ success: true, earnings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update driver documents
router.post('/documents', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Driver access required' });
    }
    
    const { license, rc, insurance, photo } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      'driverDetails.documents': {
        license,
        rc,
        insurance,
        photo
      }
    });
    
    res.json({ success: true, message: 'Documents updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get driver profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Driver access required' });
    }
    
    const driver = await User.findById(req.user._id).select('-password');
    res.json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update driver profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Driver access required' });
    }
    
    const allowedUpdates = ['name', 'phone', 'driverDetails'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const driver = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, message: 'Profile updated successfully', driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Log driver activity
router.post('/activity-log', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Driver access required' });
    }
    
    const { action, newStatus, rideId, section } = req.body;
    
    // Log activity (in production, you might want to store this in a separate collection)
    console.log(`Driver ${req.user._id} performed action: ${action} in section: ${section}`, {
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
});

module.exports = router;