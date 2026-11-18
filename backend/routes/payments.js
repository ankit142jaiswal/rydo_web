const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Ride = require('../models/Ride');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Verify a Razorpay signature. In development/test mode (when a real key secret
// is not configured), signature verification is skipped so the test flow works
// end-to-end. In production a real RAZORPAY_KEY_SECRET must be set.
const isRealSecretConfigured = () => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return secret && secret !== 'thisissecretkey' && secret.length > 10;
};

const verifySignature = (orderId, paymentId, signature) => {
  // Dev/test mode: accept if any payment/order id is present
  if (process.env.NODE_ENV !== 'production' && !isRealSecretConfigured()) {
    return !!(orderId && paymentId);
  }
  const body = orderId + '|' + paymentId;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  return expected === signature;
};

// Create a Razorpay order, or a mock order in dev/test mode when a real secret
// is not configured (so the checkout flow can be exercised end-to-end).
const createOrder = async (options) => {
  if (process.env.NODE_ENV !== 'production' && !isRealSecretConfigured()) {
    return {
      id: 'order_test_' + Date.now() + Math.random().toString(36).substring(2, 8),
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt,
      status: 'created',
    };
  }
  return razorpay.orders.create(options);
};

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

// Create Razorpay order
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { rideId, amount } = req.body;
    
    // Verify ride exists and belongs to user
    const ride = await Ride.findOne({ rideId, customer: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `ride_${rideId}`,
      notes: {
        rideId: rideId,
        customerId: req.user._id.toString(),
        serviceType: ride.serviceType
      }
    };
    
    const order = await createOrder(options);
    
    // Update ride with order ID
    ride.payment.razorpayOrderId = order.id;
    await ride.save();
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// Verify payment
router.post('/verify-payment', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rideId } = req.body;
    
    // Verify signature (dev/test mode skips when no real secret configured)
    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
    
    // Update ride payment status
    const ride = await Ride.findOne({ rideId, customer: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    ride.payment.status = 'completed';
    ride.payment.razorpayPaymentId = razorpay_payment_id;
    ride.payment.transactionId = `TXN_${Date.now()}`;
    await ride.save();
    
    // Note: Driver earnings are credited when ride status changes to 'completed' in rides.js
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      transactionId: ride.payment.transactionId
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// Add money to wallet
router.post('/add-to-wallet', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (amount < 1 || amount > 10000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be between ₹1 and ₹10,000' 
      });
    }
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `wallet_${req.user._id}_${Date.now()}`,
      notes: {
        purpose: 'wallet_recharge',
        userId: req.user._id.toString()
      }
    };
    
    const order = await createOrder(options);
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Wallet recharge error:', error);
    res.status(500).json({ success: false, message: 'Failed to create wallet recharge order' });
  }
});

// Verify wallet payment
router.post('/verify-wallet-payment', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    
    // Verify signature (dev/test mode skips when no real secret configured)
    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
    
    // Add money to user wallet
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { wallet: amount } },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Wallet recharged successfully',
      walletBalance: user.wallet
    });
  } catch (error) {
    console.error('Wallet payment verification error:', error);
    res.status(500).json({ success: false, message: 'Wallet recharge verification failed' });
  }
});

// Pay from wallet
router.post('/pay-from-wallet', authenticate, async (req, res) => {
  try {
    const { rideId, amount } = req.body;
    
    // Verify ride
    const ride = await Ride.findOne({ rideId, customer: req.user._id });
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Atomically deduct from wallet (prevents race condition)
    const deductResult = await User.findOneAndUpdate(
      { _id: req.user._id, wallet: { $gte: amount } },
      { $inc: { wallet: -amount } },
      { new: true }
    );
    
    if (!deductResult) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient wallet balance' 
      });
    }
    
    ride.payment.status = 'completed';
    ride.payment.transactionId = `WALLET_${Date.now()}`;
    await ride.save();
    
    // Note: Driver earnings are credited when ride status changes to 'completed' in rides.js
    
    const updatedUser = await User.findById(req.user._id);
    
    res.json({
      success: true,
      message: 'Payment completed from wallet',
      walletBalance: updatedUser.wallet,
      transactionId: ride.payment.transactionId
    });
  } catch (error) {
    console.error('Wallet payment error:', error);
    res.status(500).json({ success: false, message: 'Wallet payment failed' });
  }
});

// Get payment history
router.get('/history', authenticate, async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [{ customer: req.user._id }, { driver: req.user._id }],
      'payment.status': 'completed'
    })
    .populate('customer', 'name')
    .populate('driver', 'name')
    .sort({ createdAt: -1 })
    .limit(50);
    
    const payments = rides.map(ride => ({
      rideId: ride.rideId,
      amount: ride.fare.total,
      method: ride.payment.method,
      status: ride.payment.status,
      transactionId: ride.payment.transactionId,
      date: ride.createdAt,
      type: ride.customer._id.equals(req.user._id) ? 'debit' : 'credit',
      description: `${ride.serviceType} ride - ${ride.pickup.address} to ${ride.destination.address}`
    }));
    
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get wallet balance
router.get('/wallet-balance', authenticate, async (req, res) => {
  try {
    res.json({ 
      success: true, 
      balance: req.user.wallet 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;