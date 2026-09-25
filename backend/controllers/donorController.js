const Donor = require('../models/Donor');
const User = require('../models/User');

/**
 * @desc    Get all donors (paginated, filterable)
 * @route   GET /api/donors
 * @access  Private (admin, hospital)
 */
const getAllDonors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      bloodGroup,
      city,
      availabilityStatus,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, 'i');
    if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

    // Search by donor name (requires population)
    let userIds = [];
    if (search && search.trim()) {
      const users = await User.find(
        { name: new RegExp(search.trim(), 'i'), role: 'donor' },
        '_id'
      );
      userIds = users.map((u) => u._id);
      filter.user = { $in: userIds };
    }

    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [donors, total] = await Promise.all([
      Donor.find(filter)
        .populate('user', 'name email createdAt isActive')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Donor.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        donors,
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
 * @desc    Get single donor by ID
 * @route   GET /api/donors/:id
 * @access  Private
 */
const getDonorById = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id).populate(
      'user',
      'name email createdAt isActive'
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { donor },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update donor profile
 * @route   PUT /api/donors/:id
 * @access  Private (donor updates own, admin updates any)
 */
const updateDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found.',
      });
    }

    // Donor can only update own profile; admin can update any
    if (
      req.user.role === 'donor' &&
      donor.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile.',
      });
    }

    const allowedFields = [
      'phone',
      'dateOfBirth',
      'gender',
      'bloodGroup',
      'address',
      'city',
      'state',
      'pincode',
      'availabilityStatus',
      'medicalConditions',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Donor profile updated successfully.',
      data: { donor: updatedDonor },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete donor (admin only)
 * @route   DELETE /api/donors/:id
 * @access  Private (admin)
 */
const deleteDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found.',
      });
    }

    // Deactivate the associated user account
    await User.findByIdAndUpdate(donor.user, { isActive: false });
    await Donor.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Donor deleted and user account deactivated.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update availability status (donor updates own)
 * @route   PATCH /api/donors/:id/availability
 * @access  Private (donor)
 */
const updateAvailability = async (req, res, next) => {
  try {
    const { availabilityStatus } = req.body;

    if (!availabilityStatus || !['AVAILABLE', 'UNAVAILABLE'].includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message: 'availabilityStatus must be AVAILABLE or UNAVAILABLE.',
      });
    }

    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found.',
      });
    }

    // Only the donor themselves (or admin) can update
    if (
      req.user.role !== 'admin' &&
      donor.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own availability.',
      });
    }

    donor.availabilityStatus = availabilityStatus;
    await donor.save();

    return res.status(200).json({
      success: true,
      message: `Availability updated to ${availabilityStatus}.`,
      data: { availabilityStatus: donor.availabilityStatus },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get donor profile for the logged-in donor
 * @route   GET /api/donors/me
 * @access  Private (donor)
 */
const getMyDonorProfile = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id }).populate(
      'user',
      'name email createdAt'
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { donor },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
  updateAvailability,
  getMyDonorProfile,
};
