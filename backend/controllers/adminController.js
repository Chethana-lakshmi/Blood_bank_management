const User = require('../models/User');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const BloodStock = require('../models/BloodStock');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');

/**
 * Helper: get a date N months ago from now
 */
const monthsAgo = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * @desc    Get admin dashboard summary
 * @route   GET /api/admin/dashboard
 * @access  Private (admin)
 */
const getDashboard = async (req, res, next) => {
  try {
    const sixMonthsAgo = monthsAgo(6);

    // Parallel queries for top-level counts
    const [
      totalDonors,
      totalHospitals,
      totalDonations,
      pendingRequests,
      emergencyRequests,
      allStock,
      monthlyDonationsRaw,
      requestStatusBreakdown,
      monthlyRequestsRaw,
    ] = await Promise.all([
      Donor.countDocuments(),
      Hospital.countDocuments({ verificationStatus: 'VERIFIED' }),
      Donation.countDocuments(),
      BloodRequest.countDocuments({ status: 'PENDING' }),
      BloodRequest.countDocuments({ urgency: 'EMERGENCY', status: { $in: ['PENDING', 'APPROVED'] } }),
      BloodStock.find({}),
      // Monthly donations (last 6 months)
      Donation.aggregate([
        { $match: { donationDate: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$donationDate' },
              month: { $month: '$donationDate' },
            },
            count: { $sum: 1 },
            totalUnits: { $sum: '$unitsDonated' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      // Request status breakdown
      BloodRequest.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      // Monthly requests (last 6 months)
      BloodRequest.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    const totalBloodUnits = allStock.reduce((sum, s) => sum + s.unitsAvailable, 0);

    const bloodStockByGroup = allStock.map((s) => ({
      bloodGroup: s.bloodGroup,
      unitsAvailable: s.unitsAvailable,
      status: s.status,
    }));

    // Format monthly donations into readable shape
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyDonations = monthlyDonationsRaw.map((d) => ({
      month: `${MONTH_NAMES[d._id.month - 1]} ${d._id.year}`,
      count: d.count,
      totalUnits: d.totalUnits,
    }));

    const monthlyRequests = monthlyRequestsRaw.map((r) => ({
      month: `${MONTH_NAMES[r._id.month - 1]} ${r._id.year}`,
      count: r.count,
    }));

    const statusBreakdown = {};
    requestStatusBreakdown.forEach((r) => {
      statusBreakdown[r._id] = r.count;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalDonors,
        totalHospitals,
        totalBloodUnits,
        totalDonations,
        pendingRequests,
        emergencyRequests,
        bloodStockByGroup,
        monthlyDonations,
        requestStatusBreakdown: statusBreakdown,
        monthlyRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed statistics
 * @route   GET /api/admin/statistics
 * @access  Private (admin)
 */
const getStatistics = async (req, res, next) => {
  try {
    const [
      donorsByBloodGroup,
      donorsByCity,
      requestsByBloodGroup,
      requestsByUrgency,
      topDonors,
      donationsByBloodGroup,
      hospitalsByVerification,
      recentDonations,
      recentRequests,
    ] = await Promise.all([
      // Donors by blood group
      Donor.aggregate([
        { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Donors by city (top 10)
      Donor.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Blood requests by blood group
      BloodRequest.aggregate([
        { $group: { _id: '$bloodGroup', count: { $sum: 1 }, totalUnits: { $sum: '$unitsRequired' } } },
        { $sort: { count: -1 } },
      ]),
      // Requests by urgency
      BloodRequest.aggregate([
        { $group: { _id: '$urgency', count: { $sum: 1 } } },
      ]),
      // Top 5 donors by donation count
      Donor.find({})
        .populate('user', 'name email')
        .sort({ donationCount: -1 })
        .limit(5)
        .select('user bloodGroup donationCount lastDonationDate city'),
      // Donations by blood group
      Donation.aggregate([
        { $group: { _id: '$bloodGroup', count: { $sum: 1 }, totalUnits: { $sum: '$unitsDonated' } } },
        { $sort: { totalUnits: -1 } },
      ]),
      // Hospitals by verification status
      Hospital.aggregate([
        { $group: { _id: '$verificationStatus', count: { $sum: 1 } } },
      ]),
      // Recent 5 donations
      Donation.find({})
        .populate({ path: 'donor', populate: { path: 'user', select: 'name' } })
        .sort({ createdAt: -1 })
        .limit(5),
      // Recent 5 requests
      BloodRequest.find({})
        .populate({ path: 'hospital', select: 'hospitalName city' })
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        donorsByBloodGroup,
        donorsByCity,
        requestsByBloodGroup,
        requestsByUrgency,
        topDonors,
        donationsByBloodGroup,
        hospitalsByVerification,
        recentDonations,
        recentRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (paginated)
 * @route   GET /api/admin/users
 * @access  Private (admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (role) filter.role = role;
    if (search && search.trim()) {
      filter.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { email: new RegExp(search.trim(), 'i') },
      ];
    }
    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
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
 * @desc    Update user active status
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (admin)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isActive (boolean) is required.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.',
      });
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getStatistics, getAllUsers, updateUserStatus };
