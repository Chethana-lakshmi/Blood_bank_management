const express = require('express');
const router = express.Router();
const {
  recordDonation,
  getAllDonations,
  getDonationsByDonor,
  getMyDonations,
} = require('../controllers/donationController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/donations/my
// @access  Private (donor) — must be before /:donorId
router.get('/my', auth, roleCheck('donor'), getMyDonations);

// @route   POST /api/donations
// @access  Private (admin only)
router.post('/', auth, roleCheck('admin'), recordDonation);

// @route   GET /api/donations
// @access  Private (admin)
router.get('/', auth, roleCheck('admin'), getAllDonations);

// @route   GET /api/donations/donor/:donorId
// @access  Private (admin, or the donor themselves)
router.get('/donor/:donorId', auth, getDonationsByDonor);

module.exports = router;
