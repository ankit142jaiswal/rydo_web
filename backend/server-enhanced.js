const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://rydo.com', 'https://admin.rydo.com'] 
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Trust proxy for production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Compression middleware
app.use(compression());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://rydo.com', 'https://admin.rydo.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Cookie parser (required for CSRF)
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting with different limits for different endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Stricter limit for auth endpoints
  message: { error: 'Too many authentication attempts, please try again later.' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// CSRF protection for state-changing operations
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Apply CSRF protection to all routes except GET and OPTIONS
app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  csrfProtection(req, res, next);
});

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// MongoDB Connection with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rydo_web', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('🍃 MongoDB Connected');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// MongoDB connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});

// Socket.io for real-time features with authentication
io.use((socket, next) => {
  // Add socket authentication here
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  // Verify JWT token here
  next();
});

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  // Join driver room for location updates
  socket.on('join_driver', (driverId) => {
    if (!driverId) return;
    socket.join(`driver_${driverId}`);
    console.log(`🚗 Driver ${driverId} joined room`);
  });
  
  // Join customer room for ride updates
  socket.on('join_customer', (customerId) => {
    if (!customerId) return;
    socket.join(`customer_${customerId}`);
    console.log(`👤 Customer ${customerId} joined room`);
  });
  
  // Handle driver location updates with validation
  socket.on('driver_location_update', (data) => {
    if (!data || !data.customerId || !data.latitude || !data.longitude) {
      return socket.emit('error', { message: 'Invalid location data' });
    }
    
    socket.to(`customer_${data.customerId}`).emit('driver_location', {
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle ride status updates
  socket.on('ride_status_update', (data) => {
    if (!data || !data.rideId || !data.status) {
      return socket.emit('error', { message: 'Invalid ride status data' });
    }
    
    io.to(`ride_${data.rideId}`).emit('ride_status', data);
  });
  
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RYDO Web API Server',
    version: '2.0.0',
    status: 'Running',
    environment: process.env.NODE_ENV || 'development',
    features: {
      'admin-dashboard': 'Active',
      'customer-portal': 'Active',
      'analytics': 'Active',
      'real-time-tracking': 'Active',
      'csrf-protection': 'Enabled',
      'rate-limiting': 'Enabled'
    },
    services: {
      'bike-taxi': 'Available',
      'courier': 'Available',
      'auto-taxi': 'Coming Soon',
      'mini-truck': 'Coming Soon',
      'truck-cargo': 'Planned',
      'train-freight': 'Planned'
    }
  });
});

// API Routes with versioning
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/rides', require('./routes/rides'));
app.use('/api/v1/drivers', require('./routes/drivers'));
app.use('/api/v1/customers', require('./routes/customers'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/analytics', require('./routes/analytics'));
app.use('/api/v1/notifications', require('./routes/notifications'));

// Legacy API routes (for backward compatibility)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // CSRF error handling
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
      error: 'CSRF_TOKEN_INVALID'
    });
  }
  
  // Validation error handling
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // JWT error handling
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'SERVER_ERROR'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/v1/auth',
      '/api/v1/rides',
      '/api/v1/drivers',
      '/api/v1/customers',
      '/health'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
  });
});

server.listen(PORT, () => {
  console.log(`🚀 RYDO Web Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Admin Dashboard: http://localhost:${PORT}`);
  console.log(`🔒 Security: CSRF Protection Enabled`);
  console.log(`⚡ Features: Rate Limiting, Compression, Helmet`);
});