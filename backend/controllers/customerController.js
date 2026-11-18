const User = require('../models/User');
const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

const customerController = {
  // Get customer dashboard
  getDashboard: async (req, res) => {
    try {
      const customerId = req.user.userId;
      const customer = await User.findById(customerId);

      if (!customer || customer.role !== 'customer') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      // Get ride statistics
      const totalRides = await Ride.countDocuments({ customer: customerId });
      const completedRides = await Ride.countDocuments({ 
        customer: customerId, 
        status: 'completed' 
      });

      // Get recent rides
      const recentRides = await Ride.find({ customer: customerId })
        .populate('driver', 'name phone driverDetails.vehicleNumber')
        .sort({ createdAt: -1 })
        .limit(5);

      // Get active ride
      const activeRide = await Ride.findOne({
        customer: customerId,
        status: { $in: ['requested', 'accepted', 'started'] }
      }).populate('driver', 'name phone driverDetails.vehicleNumber');

      res.json({
        success: true,
        dashboard: {
          totalRides,
          completedRides,
          wallet: customer.wallet,
          rating: customer.customerDetails.rating,
          recentRides,
          activeRide
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Book a ride
  bookRide: async (req, res) => {
    try {
      const customerId = req.user.userId;
      const { pickup, destination, serviceType } = req.body;

      // Calculate fare (simplified)
      const distance = Math.random() * 20 + 5; // Mock distance calculation
      const baseFare = serviceType === 'bike-taxi' ? 25 : 40;
      const perKmRate = serviceType === 'bike-taxi' ? 8 : 12;
      const total = baseFare + (distance * perKmRate);
      const commission = total * 0.2;
      const driverEarning = total - commission;

      const ride = new Ride({
        customer: customerId,
        serviceType,
        pickup,
        destination,
        fare: {
          baseFare,
          distanceFare: distance * perKmRate,
          total,
          commission,
          driverEarning
        },
        distance,
        duration: Math.round(distance * 2.5), // Estimated duration
        payment: {
          method: 'online',
          status: 'pending'
        }
      });

      await ride.save();

      res.status(201).json({
        success: true,
        message: 'Ride booked successfully',
        ride
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get ride history
  getRideHistory: async (req, res) => {
    try {
      const customerId = req.user.userId;
      const { page = 1, limit = 10 } = req.query;

      const rides = await Ride.find({ customer: customerId })
        .populate('driver', 'name phone driverDetails.vehicleNumber')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Ride.countDocuments({ customer: customerId });

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

  // Cancel ride
  cancelRide: async (req, res) => {
    try {
      const { rideId } = req.params;
      const { reason } = req.body;
      const customerId = req.user.userId;

      const ride = await Ride.findOne({ 
        _id: rideId, 
        customer: customerId,
        status: { $in: ['requested', 'accepted'] }
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

      res.json({
        success: true,
        message: 'Ride cancelled successfully',
        ride
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Add money to wallet
  addToWallet: async (req, res) => {
    try {
      const customerId = req.user.userId;
      const { amount } = req.body;

      const customer = await User.findById(customerId);
      const newBalance = customer.wallet + amount;

      await User.findByIdAndUpdate(customerId, { wallet: newBalance });

      // Create transaction record
      await Transaction.create({
        user: customerId,
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

      // Create notification
      await Notification.create({
        userId: customerId,
        type: 'system',
        title: 'Wallet Recharged',
        message: `₹${amount} has been added to your wallet successfully`,
        priority: 'low',
        details: {
          amount: amount,
          newBalance: newBalance,
          transactionType: 'credit'
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
  },

  // Get wallet transactions
  getTransactions: async (req, res) => {
    try {
      const customerId = req.user.userId;
      const { page = 1, limit = 20 } = req.query;

      const transactions = await Transaction.find({ user: customerId })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Transaction.countDocuments({ user: customerId });

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
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const customerId = req.user.userId;
      const { name, phone, addresses } = req.body;

      const updateData = { name, phone, updatedAt: Date.now() };
      if (addresses) {
        updateData['customerDetails.addresses'] = addresses;
      }

      const customer = await User.findByIdAndUpdate(
        customerId,
        updateData,
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
  },

  // Log customer activity
  logActivity: async (req, res) => {
    try {
      const customerId = req.user.userId;
      const { action, actionType, path, section, rideId } = req.body;
      
      // Log activity (in production, you might want to store this in a separate collection)
      console.log(`Customer ${customerId} performed action: ${action} in section: ${section}`, {
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
  }
};

module.exports = customerController;