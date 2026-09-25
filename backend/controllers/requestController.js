const BloodRequest = require('../models/BloodRequest');
const Hospital = require('../models/Hospital');
const BloodStock = require('../models/BloodStock');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Helper: send notification to all admins
 */
const notifyAdmins = async (message, type, relatedId = null, relatedModel = null) => {
  const admins = await User.find({ role: 'admin', isActive: true }, '_id');
  if (admins.length === 0) return;
  const notifications = admins.map((admin) => ({
    user: admin._id,
    message,
    type,
    relatedId,
    relatedModel,
  }));
  await Notification.insertMany(notifications);
};

/**
 * @desc    Create a blood request (hospital)
 * @route   POST /api/requests
 * @access  Private (hospital)
 */
const createRequest = async (req, res, next) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      requiredDate,
      city,
      reason,
      urgency,
      contactNumber,
      notes,
    } = req.body;

    // Find hospital profile for logged-in hospital user
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital profile not found for your account.',
      });
    }

    if (hospital.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({
        success: false,
        message: 'Your hospital must be verified before submitting blood requests.',
      });
    }

    const request = await BloodRequest.create({
      hospital: hospital._id,
      patientName,
      bloodGroup,
      unitsRequired,
      requiredDate,
      city,
      reason,
      urgency: urgency || 'NORMAL',
      contactNumber,
      notes,
    });

    // Notify hospital user
    await Notification.create({
      user: req.user._id,
      message: `Your blood request for ${unitsRequired} units of ${bloodGroup} has been submitted and is pending approval.`,
      type: 'REQUEST_SUBMITTED',
      relatedId: request._id,
      relatedModel: 'BloodRequest',
    });

    // Notify admins
    const urgencyLabel = urgency === 'EMERGENCY' ? '🆘 EMERGENCY' : urgency === 'URGENT' ? '⚠️ URGENT' : 'ℹ️ NORMAL';
    await notifyAdmins(
      `${urgencyLabel}: New blood request from ${hospital.hospitalName} for ${unitsRequired} units of ${bloodGroup}. City: ${city}.`,
      urgency === 'EMERGENCY' ? 'EMERGENCY' : 'REQUEST_SUBMITTED',
      request._id,
      'BloodRequest'
    );

    return res.status(201).json({
      success: true,
      message: 'Blood request submitted successfully. Awaiting admin approval.',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all blood requests
 *          - Admin: gets all requests
 *          - Hospital: gets own requests
 * @route   GET /api/requests
 * @access  Private (admin, hospital)
 */
const getAllRequests = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      urgency,
      bloodGroup,
      city,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    // Hospital users can only see their own requests
    if (req.user.role === 'hospital') {
      const hospital = await Hospital.findOne({ user: req.user._id }, '_id');
      if (!hospital) {
        return res.status(404).json({ success: false, message: 'Hospital profile not found.' });
      }
      filter.hospital = hospital._id;
    }

    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, 'i');

    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [requests, total] = await Promise.all([
      BloodRequest.find(filter)
        .populate({
          path: 'hospital',
          populate: { path: 'user', select: 'name email' },
        })
        .populate('processedBy', 'name email')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      BloodRequest.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        requests,
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
 * @desc    Get single blood request by ID
 * @route   GET /api/requests/:id
 * @access  Private (admin, hospital)
 */
const getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate({
        path: 'hospital',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('processedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    // Hospital can only view their own requests
    if (req.user.role === 'hospital') {
      const hospital = await Hospital.findOne({ user: req.user._id }, '_id');
      if (!hospital || request.hospital._id.toString() !== hospital._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view this request.',
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update request status (admin only)
 * @route   PATCH /api/requests/:id/status
 * @access  Private (admin)
 */
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const request = await BloodRequest.findById(req.params.id).populate('hospital');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found.',
      });
    }

    const previousStatus = request.status;

    // Prevent reverting from a terminal status
    if (['COMPLETED', 'REJECTED'].includes(previousStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update a request that is already ${previousStatus}.`,
      });
    }

    // If completing, check and deduct blood stock
    if (status === 'COMPLETED') {
      if (previousStatus !== 'APPROVED') {
        return res.status(400).json({
          success: false,
          message: 'A request must be APPROVED before it can be COMPLETED.',
        });
      }

      const stock = await BloodStock.findOne({ bloodGroup: request.bloodGroup });
      if (!stock || stock.unitsAvailable < request.unitsRequired) {
        return res.status(400).json({
          success: false,
          message: `Insufficient blood stock. Available: ${stock ? stock.unitsAvailable : 0} units of ${request.bloodGroup}. Required: ${request.unitsRequired} units.`,
        });
      }

      stock.unitsAvailable -= request.unitsRequired;
      await stock.save();

      // Send low-stock notification if applicable
      if (stock.unitsAvailable <= 10) {
        const admins = await User.find({ role: 'admin', isActive: true }, '_id');
        const msg =
          stock.unitsAvailable === 0
            ? `⚠️ CRITICAL: ${request.bloodGroup} is now OUT OF STOCK after fulfilling request.`
            : `⚠️ LOW STOCK: ${request.bloodGroup} now has only ${stock.unitsAvailable} units after fulfilling request.`;
        const notifs = admins.map((a) => ({
          user: a._id,
          message: msg,
          type: 'LOW_STOCK',
          relatedId: stock._id,
          relatedModel: 'BloodStock',
        }));
        if (notifs.length > 0) await Notification.insertMany(notifs);
      }
    }

    // Update request
    request.status = status;
    if (notes) request.notes = notes;
    request.processedBy = req.user._id;
    request.processedAt = new Date();
    await request.save();

    // Notify the hospital user
    const hospitalUser = await Hospital.findById(request.hospital._id || request.hospital);
    const hospitalUserId = hospitalUser ? hospitalUser.user : null;

    if (hospitalUserId) {
      const notificationTypeMap = {
        APPROVED: 'REQUEST_APPROVED',
        REJECTED: 'REQUEST_REJECTED',
        COMPLETED: 'REQUEST_COMPLETED',
        PENDING: 'REQUEST_SUBMITTED',
      };

      const msgMap = {
        APPROVED: `Your blood request for ${request.unitsRequired} units of ${request.bloodGroup} has been APPROVED.`,
        REJECTED: `Your blood request for ${request.unitsRequired} units of ${request.bloodGroup} has been REJECTED. ${notes ? 'Reason: ' + notes : ''}`,
        COMPLETED: `Your blood request for ${request.unitsRequired} units of ${request.bloodGroup} has been COMPLETED. Blood units dispatched.`,
        PENDING: `Your blood request status has been reset to PENDING.`,
      };

      await Notification.create({
        user: hospitalUserId,
        message: msgMap[status],
        type: notificationTypeMap[status],
        relatedId: request._id,
        relatedModel: 'BloodRequest',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Request status updated to ${status}.`,
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get requests for the logged-in hospital
 * @route   GET /api/requests/hospital
 * @access  Private (hospital)
 */
const getHospitalRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, urgency, bloodGroup } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const hospital = await Hospital.findOne({ user: req.user._id }, '_id');
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital profile not found.' });
    }

    const filter = { hospital: hospital._id };
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (bloodGroup) filter.bloodGroup = bloodGroup;

    const [requests, total] = await Promise.all([
      BloodRequest.find(filter)
        .populate('processedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      BloodRequest.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        requests,
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

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  getHospitalRequests,
};
