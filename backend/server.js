const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables (supports running from root or backend directory)
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// Connect to MongoDB (non-blocking)
connectDB();

const app = express();

// ─── CORS Configuration ──────────────────────────────────────────────────────
const allowedOrigins = [
  'https://blood-bank-management-wine.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }
    // Reflect origin for broad cross-origin capability
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ─── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Request Logger (dev) ──────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Database Health Middleware for API routes ────────────────────────────────
app.use('/api', async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB Atlas is connecting or not reachable. Please ensure MONGODB_URI is set in environment variables and 0.0.0.0/0 is added in Atlas Network Access.',
    });
  }
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'BloodConnect API is running smoothly.',
    dbState: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/blood-stock', require('./routes/bloodStockRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 BloodConnect API server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   API base URL: http://localhost:${PORT}/api`);
  });
}

// ─── Graceful Error Handling ──────────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Logged Unhandled Rejection:', err.message || err);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down server...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;
