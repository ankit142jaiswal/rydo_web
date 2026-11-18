const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
      error: 'NO_TOKEN'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'rydo_secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
        error: 'INVALID_TOKEN'
      });
    }
    req.user = { ...user, id: user.userId, _id: user.userId };
    next();
  });
};

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  });
};

// Driver Authentication Middleware
const authenticateDriver = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    if (!['driver', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Driver access required',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  });
};

// Validation Error Handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common Validation Rules
const validationRules = {
  // User Registration
  userRegistration: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('phone')
      .isMobilePhone('en-IN')
      .withMessage('Valid Indian mobile number is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],

  // User Login
  userLogin: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Ride Booking
  rideBooking: [
    body('pickup.latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Valid pickup latitude is required'),
    body('pickup.longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Valid pickup longitude is required'),
    body('destination.latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Valid destination latitude is required'),
    body('destination.longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Valid destination longitude is required'),
    body('serviceType')
      .isIn(['bike-taxi', 'courier', 'auto', 'mini-truck', 'truck'])
      .withMessage('Valid service type is required'),
    body('paymentMethod')
      .isIn(['cash', 'online', 'wallet'])
      .withMessage('Valid payment method is required')
  ],

  // Driver Registration
  driverRegistration: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('phone')
      .isMobilePhone('en-IN')
      .withMessage('Valid Indian mobile number is required'),
    body('licenseNumber')
      .isLength({ min: 10, max: 20 })
      .withMessage('Valid license number is required'),
    body('vehicleType')
      .isIn(['bike', 'auto', 'car', 'mini-truck', 'truck'])
      .withMessage('Valid vehicle type is required'),
    body('vehicleNumber')
      .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/)
      .withMessage('Valid vehicle number is required (e.g., DL01AB1234)')
  ],

  // Location Update
  locationUpdate: [
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Valid latitude is required'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Valid longitude is required')
  ],

  // Payment Processing
  paymentProcessing: [
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Valid amount is required'),
    body('currency')
      .isIn(['INR'])
      .withMessage('Currency must be INR'),
    body('paymentMethod')
      .isIn(['razorpay', 'paytm', 'wallet', 'cash'])
      .withMessage('Valid payment method is required')
  ]
};

// Rate Limiting for Specific Actions
const createRateLimiter = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false
  });
};

const rateLimiters = {
  // Strict limits for authentication
  auth: createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts'),
  
  // Moderate limits for booking
  booking: createRateLimiter(60 * 1000, 10, 'Too many booking requests'),
  
  // Lenient limits for location updates
  location: createRateLimiter(60 * 1000, 60, 'Too many location updates'),
  
  // Very strict for password reset
  passwordReset: createRateLimiter(60 * 60 * 1000, 3, 'Too many password reset attempts')
};

module.exports = {
  authenticateToken,
  authenticateAdmin,
  authenticateDriver,
  handleValidationErrors,
  validationRules,
  rateLimiters
};