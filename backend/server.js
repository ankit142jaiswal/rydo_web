const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);

// Trust proxy for rate limiting
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

// CORS origin check: in development allow any localhost/127.0.0.1 origin
// (Flutter web runs on a random localhost port), in production use the fixed allowlist.
// Add extra origins via ALLOWED_ORIGINS env var (comma-separated).
const buildProductionOrigins = () => {
  const defaults = [
    'https://rydo.com',
    'https://admin.rydo.com',
    'https://rydo-web-frontend.onrender.com',
    'https://rydocustomerapp.vercel.app',
    'https://rydocaptainapp.vercel.app'
  ];
  const extra = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
    : [];
  return [...new Set([...defaults, ...extra])];
};

const corsOriginCheck = (origin, callback) => {
  // Allow requests with no origin (mobile apps, curl, same-origin)
  if (!origin) return callback(null, true);

  if (process.env.NODE_ENV === 'production') {
    const productionOrigins = buildProductionOrigins();
    if (!productionOrigins.includes(origin)) {
      console.warn(`CORS: origin ${origin} not allowed`);
    }
    // Reject by omitting CORS headers (browser blocks it) instead of a 500
    return callback(null, productionOrigins.includes(origin));
  }

  // Development: allow any localhost / 127.0.0.1 origin on any port
  const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return isLocalhost ? callback(null, true) : callback(null, true);
};

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? buildProductionOrigins() : true,
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: corsOriginCheck,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rydo_web', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('🍃 MongoDB Connected');
  // Create default admin user if not exists
  const User = require('./models/User');
  const adminExists = await User.findOne({ email: 'admin@rydo.com' });
  if (!adminExists) {
    const admin = new User({
      name: 'Admin',
      email: 'admin@rydo.com',
      phone: '+919999999999',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('👤 Default admin user created');
  }
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  // Join driver room for location updates
  socket.on('join_driver', (driverId) => {
    socket.join(`driver_${driverId}`);
  });
  
  // Join customer room for ride updates
  socket.on('join_customer', (customerId) => {
    socket.join(`customer_${customerId}`);
  });
  
  // Handle driver location updates
  socket.on('driver_location_update', (data) => {
    socket.to(`customer_${data.customerId}`).emit('driver_location', data);
  });
  
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'RYDO Web API Server',
    version: '1.0.0',
    status: 'Running',
    features: {
      'admin-dashboard': 'Active',
      'customer-portal': 'Active',
      'analytics': 'Active',
      'real-time-tracking': 'Active'
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));

// 404 handler
app.use('*', (req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

server.listen(PORT, () => {
  console.log(`🚀 RYDO Web Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Admin Dashboard: http://localhost:${PORT}`);
});