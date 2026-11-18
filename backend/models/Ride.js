const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rideId: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  serviceType: {
    type: String,
    enum: ['bike-taxi', 'courier', 'auto', 'mini-truck', 'truck'],
    required: true
  },
  
  pickup: {
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true },
    landmark: String
  },
  
  destination: {
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true },
    landmark: String
  },
  
  status: {
    type: String,
    enum: ['requested', 'accepted', 'arrived', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  
  fare: {
    baseFare: { type: Number, default: 0 },
    distanceFare: { type: Number, default: 0 },
    timeFare: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    driverEarning: { type: Number, default: 0 }
  },
  
  payment: {
    method: { type: String, enum: ['cash', 'online', 'wallet'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    transactionId: String
  },
  
  distance: { type: Number, default: 0 }, // in km
  duration: { type: Number, default: 0 }, // in minutes
  
  timeline: {
    requested: { type: Date, default: Date.now },
    accepted: Date,
    arrived: Date,
    started: Date,
    completed: Date,
    cancelled: Date
  },
  
  rating: {
    customerRating: { type: Number, min: 1, max: 5 },
    driverRating: { type: Number, min: 1, max: 5 },
    customerFeedback: String,
    driverFeedback: String
  },
  
  route: [{
    latitude: Number,
    longitude: Number,
    timestamp: Date
  }],
  
  cancellationReason: String,
  specialInstructions: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

rideSchema.pre('save', function(next) {
  if (!this.rideId) {
    this.rideId = 'RYDO' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ride', rideSchema);