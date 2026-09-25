const express = require('express');
const router = express.Router();
const {
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
  updateAvailability,
  getMyDonorProfile,
} = require('../controllers/donorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/donors/me
// @access  Private (donor)
router.get('/me', auth, roleCheck('donor'), getMyDonorProfile);

// @route   GET /api/donors
// @access  Private (admin, hospital)
router.get('/', auth, roleCheck('admin', 'hospital'), getAllDonors);

// @route   GET /api/donors/:id
// @access  Private (admin, hospital, or the donor themselves)
router.get('/:id', auth, getDonorById);

// @route   PUT /api/donors/:id
// @access  Private (donor updates own, admin updates any)
router.put('/:id', auth, roleCheck('donor', 'admin'), updateDonor);

// @route   PATCH /api/donors/:id/availability
// @access  Private (donor, admin)
router.patch('/:id/availability', auth, roleCheck('donor', 'admin'), updateAvailability);

// @route   DELETE /api/donors/:id
// @access  Private (admin only)
router.delete('/:id', auth, roleCheck('admin'), deleteDonor);

module.exports = router;
