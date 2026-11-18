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

// Get customer dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    // Get today's rides
    const todayRides = await Ride.find({
      customer: req.user._id,
      createdAt: { $gte: today }
    });
    
    // Get this month's rides
    const monthRides = await Ride.find({
      customer: req.user._id,
      createdAt: { $gte: thisMonth }
    });
    
    // Get active ride
    const activeRide = await Ride.findOne({
      customer: req.user._id,
      status: { $in: ['requested', 'accepted', 'arrived', 'started'] }
    }).populate('driver', 'name phone driverDetails');
    
    // Calculate spending
    const todaySpending = todayRides
      .filter(ride => ride.payment.status === 'completed')
      .reduce((sum, ride) => sum + ride.fare.total, 0);
    
    const monthSpending = monthRides
      .filter(ride => ride.payment.status === 'completed')
      .reduce((sum, ride) => sum + ride.fare.total, 0);
    
    res.json({
      success: true,
      dashboard: {
        today: {
          rides: todayRides.length,
          spending: todaySpending
        },
        month: {
          rides: monthRides.length,
          spending: monthSpending
        },
        total: {
          rides: req.user.customerDetails.totalRides,
          rating: req.user.customerDetails.rating
        },
        wallet: req.user.wallet,
        activeRide
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get customer ride history
router.get('/rides', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const { page = 1, limit = 20, status } = req.query;
    
    const query = { customer: req.user._id };
    if (status) {
      query.status = status;
    }
    
    const rides = await Ride.find(query)
      .populate('driver', 'name phone driverDetails.vehicleNumber driverDetails.rating')
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

// Add/Update customer address
router.post('/addresses', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const { type, address, coordinates } = req.body;
    
    if (!['home', 'work', 'other'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address type must be home, work, or other' 
      });
    }
    
    const user = await User.findById(req.user._id);
    
    // Remove existing address of same type
    user.customerDetails.addresses = user.customerDetails.addresses.filter(
      addr => addr.type !== type
    );
    
    // Add new address
    user.customerDetails.addresses.push({ type, address, coordinates });
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Address saved successfully',
      addresses: user.customerDetails.addresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get customer addresses
router.get('/addresses', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    res.json({ 
      success: true, 
      addresses: req.user.customerDetails.addresses 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete customer address
router.delete('/addresses/:type', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const { type } = req.params;
    
    const user = await User.findById(req.user._id);
    user.customerDetails.addresses = user.customerDetails.addresses.filter(
      addr => addr.type !== type
    );
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Address deleted successfully',
      addresses: user.customerDetails.addresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get customer profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const customer = await User.findById(req.user._id).select('-password');
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update customer profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const allowedUpdates = ['name', 'phone', 'avatar'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const customer = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully', 
      customer 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get ride estimates
router.post('/estimate', authenticate, async (req, res) => {
  try {
    const { pickup, destination, serviceType } = req.body;
    
    if (!pickup?.coordinates || !destination?.coordinates) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pickup and destination coordinates are required' 
      });
    }
    
    // Calculate distance (simplified - in real app use Google Maps API)
    const distance = Math.sqrt(
      Math.pow(destination.coordinates[0] - pickup.coordinates[0], 2) +
      Math.pow(destination.coordinates[1] - pickup.coordinates[1], 2)
    ) * 111; // Rough km conversion
    
    const actualDistance = Math.max(distance, 1); // Minimum 1km
    
    // Calculate fare
    const rates = {
      'bike-taxi': { base: 25, perKm: 8, time: 15 },
      'courier': { base: 20, perKm: 6, time: 20 },
      'auto': { base: 40, perKm: 12, time: 12 },
      'mini-truck': { base: 100, perKm: 20, time: 25 },
      'truck': { base: 200, perKm: 35, time: 30 }
    };
    
    const rate = rates[serviceType] || rates['bike-taxi'];
    const baseFare = rate.base;
    const distanceFare = actualDistance * rate.perKm;
    const total = baseFare + distanceFare;
    const estimatedTime = Math.ceil(actualDistance * rate.time / 10); // minutes
    
    res.json({
      success: true,
      estimate: {
        distance: Math.round(actualDistance * 100) / 100,
        estimatedTime,
        fare: {
          baseFare,
          distanceFare: Math.round(distanceFare),
          total: Math.round(total)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel ride
router.post('/cancel-ride/:rideId', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const ride = await Ride.findOne({ 
      rideId: req.params.rideId, 
      customer: req.user._id,
      status: { $in: ['requested', 'accepted', 'arrived'] }
    });
    
    if (!ride) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ride not found or cannot be cancelled' 
      });
    }
    
    ride.status = 'cancelled';
    ride.cancellationReason = reason;
    ride.timeline.cancelled = new Date();
    await ride.save();
    
    // Notify driver if assigned
    if (ride.driver) {
      const io = req.app.get('io');
      io.to(`driver_${ride.driver}`).emit('ride_cancelled', {
        rideId: ride.rideId,
        reason
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Ride cancelled successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add money to wallet
router.post('/wallet/add', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const { amount } = req.body;
    
    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 10000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be a positive number between ₹1 and ₹10,000' 
      });
    }
    
    const Transaction = require('../models/Transaction');
    
    const customer = await User.findById(req.user._id);
    const newBalance = customer.wallet + amount;

    await User.findByIdAndUpdate(req.user._id, { wallet: newBalance });

    await Transaction.create({
      user: req.user._id,
      type: 'credit',
      category: 'wallet_topup',
      amount,
      balance: newBalance,
      description: 'Wallet top-up',
      payment: {
        method: 'online',
        status: 'success'
      }
    });

    res.json({
      success: true,
      message: 'Money added to wallet successfully',
      newBalance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get wallet transactions
router.get('/wallet/transactions', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const { page = 1, limit = 20 } = req.query;
    const Transaction = require('../models/Transaction');

    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      transactions,
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

// Log customer activity
router.post('/activity-log', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Customer access required' });
    }
    
    const { action, actionType, path, section, rideId } = req.body;
    
    // Log activity (in production, you might want to store this in a separate collection)
    console.log(`Customer ${req.user._id} performed action: ${action} in section: ${section}`, {
      actionType,
      path,
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