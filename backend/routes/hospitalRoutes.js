const express = require('express');
const router = express.Router();
const {
  getAllHospitals,
  getHospitalById,
  updateHospital,
  updateVerificationStatus,
  getMyHospitalProfile,
} = require('../controllers/hospitalController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/hospitals/me
// @access  Private (hospital)
router.get('/me', auth, roleCheck('hospital'), getMyHospitalProfile);

// @route   GET /api/hospitals
// @access  Private (admin)
router.get('/', auth, roleCheck('admin'), getAllHospitals);

// @route   GET /api/hospitals/:id
// @access  Private (admin, hospital)
router.get('/:id', auth, roleCheck('admin', 'hospital'), getHospitalById);

// @route   PUT /api/hospitals/:id
// @access  Private (hospital updates own, admin updates any)
router.put('/:id', auth, roleCheck('hospital', 'admin'), updateHospital);

// @route   PATCH /api/hospitals/:id/verification
// @access  Private (admin only)
router.patch('/:id/verification', auth, roleCheck('admin'), updateVerificationStatus);

module.exports = router;
