const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  getHospitalRequests,
} = require('../controllers/requestController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/requests/hospital
// @access  Private (hospital) — must be before /:id to prevent shadowing
router.get('/hospital', auth, roleCheck('hospital'), getHospitalRequests);

// @route   POST /api/requests
// @access  Private (hospital)
router.post('/', auth, roleCheck('hospital'), createRequest);

// @route   GET /api/requests
// @access  Private (admin, hospital)
router.get('/', auth, roleCheck('admin', 'hospital'), getAllRequests);

// @route   GET /api/requests/:id
// @access  Private (admin, hospital)
router.get('/:id', auth, roleCheck('admin', 'hospital'), getRequestById);

// @route   PATCH /api/requests/:id/status
// @access  Private (admin)
router.patch('/:id/status', auth, roleCheck('admin'), updateRequestStatus);

module.exports = router;
