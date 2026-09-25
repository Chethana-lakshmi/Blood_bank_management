const express = require('express');
const router = express.Router();
const {
  getAllStock,
  getStockByGroup,
  updateStock,
  initializeStock,
} = require('../controllers/bloodStockController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/blood-stock
// @access  Private (all authenticated users)
router.get('/', auth, getAllStock);

// @route   POST /api/blood-stock/initialize
// @access  Private (admin)
router.post('/initialize', auth, roleCheck('admin'), initializeStock);

// @route   GET /api/blood-stock/:bloodGroup
// @access  Private (all authenticated users)
router.get('/:bloodGroup', auth, getStockByGroup);

// @route   PATCH /api/blood-stock/:bloodGroup
// @access  Private (admin only)
router.patch('/:bloodGroup', auth, roleCheck('admin'), updateStock);

module.exports = router;
