const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  
  type: { 
    type: String, 
    enum: ['credit', 'debit'], 
    required: true 
  },
  
  category: {
    type: String,
    enum: ['ride_payment', 'wallet_topup', 'refund', 'commission', 'bonus', 'penalty'],
    required: true
  },
  
  amount: { type: Number, required: true },
  balance: { type: Number, required: true }, // Balance after transaction
  
  description: { type: String, required: true },
  
  payment: {
    method: { type: String, enum: ['cash', 'online', 'wallet'] },
    gateway: String, // razorpay, paytm, etc.
    gatewayTransactionId: String,
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' }
  },
  
  metadata: { type: mongoose.Schema.Types.Mixed }, // Additional transaction data
  
  createdAt: { type: Date, default: Date.now }
});

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ ride: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);