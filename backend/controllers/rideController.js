const Ride = require('../models/Ride');
const User = require('../models/User');
const Notification = require('../models/Notification');

const rideController = {
  // Book a new ride
  bookRide: async (req, res) => {
    try {
      const customerId = req.user.userId;
      const { pickup, destination, serviceType, paymentMethod } = req.body;

      // Calculate distance and fare
      const distance = Math.random() * 20 + 2; // Mock calculation
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
      const commission = total * 0.2;
      const driverEarning = total - commission;

      const ride = new Ride({
        customer: customerId,
        serviceType,
        pickup,
        destination,
        fare: {
          baseFare,
          distanceFare,
          total,
          commission,
          driverEarning
        },
        payment: {
          method: paymentMethod,
          status: 'pending'
        },
        distance: Math.round(distance * 100) / 100,
        duration: Math.round(distance * 2.5)
      });

      await ride.save();

      // Find nearby drivers
      const nearbyDrivers = await User.find({
        role: 'driver',
        'driverDetails.isOnline': true,
        'driverDetails.vehicleType': serviceType === 'bike-taxi' ? 'bike' : serviceType
      }).limit(5);

      // Send notifications to drivers
      for (const driver of nearbyDrivers) {
        await Notification.create({
          userId: driver._id,
          type: 'ride_update',
          title: 'New Ride Request',
          message: `New ${serviceType} ride request from ${pickup.address}`,
          priority: 'high',
          actionRequired: true,
          details: { 
            rideId: ride._id,
            pickup: pickup.address,
            destination: destination.address,
            fare: total,
            distance: distance.toFixed(1) + ' km'
          }
        });
      }

      res.status(201).json({
        success: true,
        message: 'Ride booked successfully',
        ride
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Accept ride by driver
  acceptRide: async (req, res) => {
    try {
      const { rideId } = req.params;
      const driverId = req.user.userId;

      const ride = await Ride.findById(rideId);
      if (!ride || ride.status !== 'requested') {
        return res.status(400).json({
          success: false,
          message: 'Ride not available'
        });
      }

      ride.driver = driverId;
      ride.status = 'accepted';
      ride.timeline.accepted = new Date();
      await ride.save();

      // Notify customer
      await Notification.create({
        userId: ride.customer,
        type: 'ride_update',
        title: 'Ride Accepted',
        message: 'Your ride has been accepted by a driver',
        priority: 'medium',
        details: { 
          rideId: ride._id,
          driverId: driverId
        }
      });

      res.json({
        success: true,
        message: 'Ride accepted successfully',
        ride
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
      const userId = req.user.userId;

      const ride = await Ride.findById(rideId);
      if (!ride) {
        return res.status(404).json({
          success: false,
          message: 'Ride not found'
        });
      }

      // Check authorization
      if ((!ride.driver || ride.driver.toString() !== userId) && ride.customer.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      ride.status = status;
      ride.timeline[status] = new Date();

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
        
        // Notify customer about completion
        await Notification.create({
          userId: ride.customer,
          type: 'ride_update',
          title: 'Ride Completed',
          message: 'Your ride has been completed. Please rate your driver!',
          priority: 'medium',
          actionRequired: true,
          details: { 
            rideId: ride._id,
            fare: ride.fare.total,
            distance: ride.distance + ' km'
          }
        });
        
        // Notify driver about earnings
        await Notification.create({
          userId: ride.driver,
          type: 'ride_update',
          title: 'Ride Completed',
          message: `You earned ₹${ride.fare.driverEarning} from this ride`,
          priority: 'low',
          details: { 
            rideId: ride._id,
            earnings: ride.fare.driverEarning,
            distance: ride.distance + ' km'
          }
        });
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

  // Get ride details
  getRideDetails: async (req, res) => {
    try {
      const { rideId } = req.params;
      const userId = req.user.userId;

      const ride = await Ride.findById(rideId)
        .populate('customer', 'name phone')
        .populate('driver', 'name phone driverDetails.vehicleNumber');

      if (!ride) {
        return res.status(404).json({
          success: false,
          message: 'Ride not found'
        });
      }

      // Check authorization
      if (ride.driver?.toString() !== userId && ride.customer.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      res.json({
        success: true,
        ride
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = rideController;