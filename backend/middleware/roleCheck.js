/**
 * Role check middleware factory.
 * Usage: roleCheck('admin'), roleCheck('admin', 'hospital')
 * Must be used AFTER the auth middleware.
 */
const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires one of the following roles: ${roles.join(', ')}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

module.exports = roleCheck;
