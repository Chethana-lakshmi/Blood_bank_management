/**
 * Global error handler middleware.
 * Must be registered LAST in Express app (after all routes).
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error for debugging (in production use a proper logger)
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Mongoose: Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}. Please use a different value.`;
    statusCode = 409;
  }

  // Mongoose: Validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join('. ');
    statusCode = 400;
  }

  // Mongoose: CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    message = `Invalid value for field: ${err.path}. Expected a valid ID.`;
    statusCode = 400;
  }

  // JWT errors (should be caught in auth middleware, but as safety net)
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token.';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token has expired.';
    statusCode = 401;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
