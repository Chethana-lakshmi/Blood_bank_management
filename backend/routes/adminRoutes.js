const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getStatistics,
  getAllUsers,
  updateUserStatus,
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All admin routes require admin role
router.use(auth, roleCheck('admin'));

// @route   GET /api/admin/dashboard
router.get('/dashboard', getDashboard);

// @route   GET /api/admin/statistics
router.get('/statistics', getStatistics);

// @route   GET /api/admin/users
router.get('/users', getAllUsers);

// @route   PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', updateUserStatus);

module.exports = router;
