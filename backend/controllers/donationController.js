const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const BloodStock = require('../models/BloodStock');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Record a new donation (admin only)
 * @route   POST /api/donations
 * @access  Private (admin)
 */
const recordDonation = async (req, res, next) => {
  try {
    const { donorId, bloodGroup, unitsDonated, donationDate, location, notes } = req.body;

    // Validate donor exists
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found.',
      });
    }

    // Check eligibility (90 days)
    if (!donor.isEligible) {
      const nextEligible = new Date(donor.lastDonationDate);
      nextEligible.setDate(nextEligible.getDate() + 90);
      return res.status(400).json({
        success: false,
        message: `Donor is not eligible to donate yet. Eligible from: ${nextEligible.toDateString()}.`,
      });
    }

    // Create donation record
    const donation = await Donation.create({
      donor: donor._id,
      bloodGroup: bloodGroup || donor.bloodGroup,
      unitsDonated: unitsDonated || 1,
      donationDate: donationDate || new Date(),
      location,
      notes,
      recordedBy: req.user._id,
    });

    // Update donor stats
    donor.lastDonationDate = donation.donationDate;
    donor.donationCount += 1;
    await donor.save();

    // Update blood stock — upsert
    let stock = await BloodStock.findOne({ bloodGroup: donation.bloodGroup });
    if (!stock) {
      stock = new BloodStock({ bloodGroup: donation.bloodGroup, unitsAvailable: 0 });
    }
    stock.unitsAvailable += donation.unitsDonated;
    await stock.save();

    // Notify the donor user
    await Notification.create({
      user: donor.user,
      message: `Thank you! Your donation of ${donation.unitsDonated} unit(s) of ${donation.bloodGroup} blood on ${new Date(donation.donationDate).toDateString()} has been recorded. Total donations: ${donor.donationCount}.`,
      type: 'DONATION_RECORDED',
      relatedId: donation._id,
      relatedModel: 'Donation',
    });

    // Populate before response
    const populatedDonation = await Donation.findById(donation._id)
      .populate({ path: 'donor', populate: { path: 'user', select: 'name email' } })
      .populate('recordedBy', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Donation recorded successfully. Blood stock updated.',
      data: {
        donation: populatedDonation,
        updatedStock: {
          bloodGroup: stock.bloodGroup,
          unitsAvailable: stock.unitsAvailable,
          status: stock.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all donations (paginated, filterable)
 * @route   GET /api/donations
 * @access  Private (admin)
 */
const getAllDonations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      bloodGroup,
      donorId,
      startDate,
      endDate,
      sortBy = 'donationDate',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (donorId) filter.donor = donorId;
    if (startDate || endDate) {
      filter.donationDate = {};
      if (startDate) filter.donationDate.$gte = new Date(startDate);
      if (endDate) filter.donationDate.$lte = new Date(endDate);
    }

    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .populate({ path: 'donor', populate: { path: 'user', select: 'name email' } })
        .populate('recordedBy', 'name email')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Donation.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        donations,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all donations for a specific donor
 * @route   GET /api/donations/donor/:donorId
 * @access  Private (admin, or the donor themselves)
 */
const getDonationsByDonor = async (req, res, next) => {
  try {
    const { donorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found.',
      });
    }

    // If requesting user is a donor, ensure they can only access their own donations
    if (req.user.role === 'donor' && donor.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own donation history.',
      });
    }

    const [donations, total] = await Promise.all([
      Donation.find({ donor: donorId })
        .populate('recordedBy', 'name email')
        .sort({ donationDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Donation.countDocuments({ donor: donorId }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        donor: {
          id: donor._id,
          bloodGroup: donor.bloodGroup,
          donationCount: donor.donationCount,
          lastDonationDate: donor.lastDonationDate,
        },
        donations,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get donation history for logged-in donor
 * @route   GET /api/donations/my
 * @access  Private (donor)
 */
const getMyDonations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const donor = await Donor.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found.' });
    }

    const [donations, total] = await Promise.all([
      Donation.find({ donor: donor._id })
        .populate('recordedBy', 'name email')
        .sort({ donationDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Donation.countDocuments({ donor: donor._id }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        donor: {
          id: donor._id,
          bloodGroup: donor.bloodGroup,
          donationCount: donor.donationCount,
          lastDonationDate: donor.lastDonationDate,
          isEligible: donor.isEligible,
        },
        donations,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { recordDonation, getAllDonations, getDonationsByDonor, getMyDonations };
