const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'driver', 'admin'], default: 'customer' },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Driver specific fields
  driverDetails: {
    licenseNumber: String,
    vehicleType: { type: String, enum: ['bike', 'auto', 'car', 'mini-truck', 'truck'] },
    vehicleNumber: String,
    vehicleModel: String,
    isOnline: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    totalRides: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    documents: {
      license: String,
      rc: String,
      insurance: String,
      photo: String
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  },
  
  // Customer specific fields
  customerDetails: {
    addresses: [{
      type: { type: String, enum: ['home', 'work', 'other'] },
      address: String,
      coordinates: [Number]
    }],
    totalRides: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 }
  },
  
  wallet: { type: Number, default: 0 },
  
  // Notification settings
  notificationSettings: {
    rideUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true },
    security: { type: Boolean, default: true },
    earnings: { type: Boolean, default: true }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ "driverDetails.location": "2dsphere" });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);