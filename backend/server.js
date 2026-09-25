const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB (non-blocking)
connectDB();

const app = express();

// ─── CORS Configuration ──────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Request Logger (dev) ──────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Database Health Middleware for API routes ────────────────────────────────
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB Atlas firewall blocked this connection. In MongoDB Atlas (cloud.mongodb.com), go to Network Access -> "+ Add IP Address" -> select "Allow Access From Anywhere" (0.0.0.0/0) and click Confirm.',
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
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 BloodConnect API server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API base URL: http://localhost:${PORT}/api`);
});

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
