const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * @desc    Get all hospitals (paginated, filterable)
 * @route   GET /api/hospitals
 * @access  Private (admin)
 */
const getAllHospitals = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      verificationStatus,
      city,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (city) filter.city = new RegExp(city, 'i');
    if (search && search.trim()) {
      filter.hospitalName = new RegExp(search.trim(), 'i');
    }

    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [hospitals, total] = await Promise.all([
      Hospital.find(filter)
        .populate('user', 'name email createdAt isActive')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Hospital.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        hospitals,
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
 * @desc    Get single hospital by ID
 * @route   GET /api/hospitals/:id
 * @access  Private
 */
const getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate(
      'user',
      'name email createdAt isActive'
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { hospital },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update hospital profile
 * @route   PUT /api/hospitals/:id
 * @access  Private (hospital updates own, admin updates any)
 */
const updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found.',
      });
    }

    // Hospital can only update own profile
    if (
      req.user.role === 'hospital' &&
      hospital.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own hospital profile.',
      });
    }

    const allowedFields = [
      'hospitalName',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
      'website',
      'specializations',
    ];

    // Admins can also update licenseNumber
    if (req.user.role === 'admin') {
      allowedFields.push('licenseNumber');
    }

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Hospital profile updated successfully.',
      data: { hospital: updatedHospital },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update hospital verification status (admin only)
 * @route   PATCH /api/hospitals/:id/verification
 * @access  Private (admin)
 */
const updateVerificationStatus = async (req, res, next) => {
  try {
    const { verificationStatus, rejectionReason } = req.body;

    if (!verificationStatus || !['PENDING', 'VERIFIED', 'REJECTED'].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'verificationStatus must be PENDING, VERIFIED, or REJECTED.',
      });
    }

    if (verificationStatus === 'REJECTED' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'A rejectionReason is required when rejecting a hospital.',
      });
    }

    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found.',
      });
    }

    hospital.verificationStatus = verificationStatus;
    if (verificationStatus === 'REJECTED') {
      hospital.rejectionReason = rejectionReason;
    } else {
      hospital.rejectionReason = undefined;
    }
    await hospital.save();

    // Send notification to hospital user
    let notificationMessage = '';
    if (verificationStatus === 'VERIFIED') {
      notificationMessage =
        'Congratulations! Your hospital has been verified. You can now submit blood requests.';
    } else if (verificationStatus === 'REJECTED') {
      notificationMessage = `Your hospital verification was rejected. Reason: ${rejectionReason}`;
    } else {
      notificationMessage = 'Your hospital verification status has been updated to PENDING.';
    }

    await Notification.create({
      user: hospital.user,
      message: notificationMessage,
      type: verificationStatus === 'VERIFIED' ? 'REQUEST_APPROVED' : 'REQUEST_REJECTED',
      relatedId: hospital._id,
      relatedModel: null,
    });

    return res.status(200).json({
      success: true,
      message: `Hospital verification status updated to ${verificationStatus}.`,
      data: { hospital },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get hospital profile for logged-in hospital user
 * @route   GET /api/hospitals/me
 * @access  Private (hospital)
 */
const getMyHospitalProfile = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id }).populate(
      'user',
      'name email createdAt'
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { hospital },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  updateHospital,
  updateVerificationStatus,
  getMyHospitalProfile,
};
