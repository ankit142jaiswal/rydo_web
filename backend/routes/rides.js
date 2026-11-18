const express = require('express');
const Ride = require('../models/Ride');
const User = require('../models/User');
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

// Calculate fare based on distance and service type
const calculateFare = (distance, serviceType) => {
  const rates = {
    'bike-taxi': { base: 25, perKm: 8 },
    'courier': { base: 20, perKm: 6 },
    'auto': { base: 40, perKm: 12 },
    'mini-truck': { base: 100, perKm: 20 },
    'truck': { base: 200, perKm: 35 }
  };
  
  const rate = rates[serviceType] || rates['bike-taxi'];
  const baseFare = rate.base;
  const distanceFare = distance * rate.perKm;
  const total = baseFare + distanceFare;
  const commission = total * 0.2; // 20% commission
  const driverEarning = total - commission;
  
  return { baseFare, distanceFare, total, commission, driverEarning };
};

// Book a ride
router.post('/book', authenticate, async (req, res) => {
  try {
    const { pickup, destination, serviceType, paymentMethod, specialInstructions } = req.body;
    
    // Calculate distance (simplified - in real app use Google Maps API)
    const distance = Math.sqrt(
      Math.pow(destination.coordinates[0] - pickup.coordinates[0], 2) +
      Math.pow(destination.coordinates[1] - pickup.coordinates[1], 2)
    ) * 111; // Rough km conversion
    
    const fare = calculateFare(distance, serviceType);
    
    const ride = new Ride({
      customer: req.user._id,
      serviceType,
      pickup,
      destination,
      distance: Math.max(distance, 1), // Minimum 1km
      fare,
      payment: { method: paymentMethod },
      specialInstructions
    });
    
    await ride.save();
    await ride.populate('customer', 'name phone');
    
    // Map service type to the required driver vehicle type
    const vehicleTypeMap = {
      'bike-taxi': 'bike',
      'courier': 'bike',
      'auto': 'auto',
      'mini-truck': 'mini-truck',
      'truck': 'truck'
    };
    const requiredVehicleType = vehicleTypeMap[serviceType] || 'bike';

    // Find nearby ONLINE drivers matching the vehicle type.
    // Try geo-proximity first (within 10km); fall back to all matching online drivers.
    let nearbyDrivers = [];
    try {
      nearbyDrivers = await User.find({
        role: 'driver',
        isActive: true,
        'driverDetails.isOnline': true,
        'driverDetails.vehicleType': requiredVehicleType,
        'driverDetails.location': {
          $near: {
            $geometry: { type: 'Point', coordinates: pickup.coordinates },
            $maxDistance: 10000 // 10 km
          }
        }
      }).select('_id name').limit(10);
    } catch (geoErr) {
      // Geospatial query can fail if coordinates/index are missing — fall back.
      nearbyDrivers = [];
    }

    if (nearbyDrivers.length === 0) {
      nearbyDrivers = await User.find({
        role: 'driver',
        isActive: true,
        'driverDetails.isOnline': true,
        'driverDetails.vehicleType': requiredVehicleType
      }).select('_id name').limit(10);
    }

    // Persist a notification for each nearby driver
    const Notification = require('../models/Notification');
    const notifTitle = 'New Ride Request';
    const notifMessage = `${serviceType} ride from ${ride.pickup.address || 'pickup'} to ${ride.destination.address || 'destination'} — ₹${ride.fare.total}`;
    if (nearbyDrivers.length > 0) {
      await Notification.insertMany(nearbyDrivers.map(d => ({
        userId: d._id,
        type: 'ride_update',
        title: notifTitle,
        message: notifMessage,
        priority: 'high',
        actionRequired: true,
        details: {
          rideId: ride.rideId,
          serviceType: ride.serviceType,
          fare: ride.fare.total,
          pickup: ride.pickup,
          destination: ride.destination
        }
      })));
    }

    // Emit a targeted socket event to each nearby driver's room
    const io = req.app.get('io');
    const payload = {
      rideId: ride.rideId,
      pickup: ride.pickup,
      destination: ride.destination,
      serviceType: ride.serviceType,
      fare: ride.fare.total,
      distance: ride.distance,
      customerName: ride.customer.name,
      title: notifTitle,
      message: notifMessage
    };
    nearbyDrivers.forEach(d => {
      io.to(`driver_${d._id}`).emit('new_ride_request', payload);
    });
    
    res.status(201).json({
      success: true,
      message: 'Ride booked successfully',
      ride,
      notifiedDrivers: nearbyDrivers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's rides
router.get('/my-rides', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'driver' 
      ? { driver: req.user._id }
      : { customer: req.user._id };
    
    const rides = await Ride.find(query)
      .populate('customer', 'name phone')
      .populate('driver', 'name phone driverDetails.vehicleNumber')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, rides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Accept ride (driver)
router.post('/:rideId/accept', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ success: false, message: 'Only drivers can accept rides' });
    }
    
    const ride = await Ride.findOne({ rideId: req.params.rideId, status: 'requested' });
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found or already accepted' });
    }
    
    ride.driver = req.user._id;
    ride.status = 'accepted';
    ride.timeline.accepted = new Date();
    await ride.save();
    
    await ride.populate(['customer', 'driver']);
    
    // Notify customer
    const io = req.app.get('io');
    io.to(`customer_${ride.customer._id}`).emit('ride_accepted', {
      rideId: ride.rideId,
      driver: {
        name: req.user.name,
        phone: req.user.phone,
        vehicleNumber: req.user.driverDetails.vehicleNumber,
        rating: req.user.driverDetails.rating
      }
    });
    
    res.json({ success: true, message: 'Ride accepted', ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update ride status
router.put('/:rideId/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findOne({ rideId: req.params.rideId });
    
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Check permissions
    if (req.user.role === 'driver' && (!ride.driver || !ride.driver.equals(req.user._id))) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    ride.status = status;
    ride.timeline[status] = new Date();
    
    // Update driver earnings on completion
    if (status === 'completed') {
      await User.findByIdAndUpdate(ride.driver, {
        $inc: { 
          'driverDetails.earnings': ride.fare.driverEarning,
          'driverDetails.totalRides': 1
        }
      });
      
      await User.findByIdAndUpdate(ride.customer, {
        $inc: { 'customerDetails.totalRides': 1 }
      });
    }
    
    await ride.save();
    await ride.populate(['customer', 'driver']);
    
    // Emit status update
    const io = req.app.get('io');
    io.to(`customer_${ride.customer._id}`).emit('ride_status_update', {
      rideId: ride.rideId,
      status: ride.status
    });
    
    res.json({ success: true, message: 'Status updated', ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get ride details
router.get('/:rideId', authenticate, async (req, res) => {
  try {
    const ride = await Ride.findOne({ rideId: req.params.rideId })
      .populate('customer', 'name phone')
      .populate('driver', 'name phone driverDetails');
    
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rate ride
router.post('/:rideId/rate', authenticate, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const ride = await Ride.findOne({ rideId: req.params.rideId });
    
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    if (req.user.role === 'customer') {
      ride.rating.customerRating = rating;
      ride.rating.customerFeedback = feedback;
    } else {
      ride.rating.driverRating = rating;
      ride.rating.driverFeedback = feedback;
    }
    
    await ride.save();
    res.json({ success: true, message: 'Rating submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;