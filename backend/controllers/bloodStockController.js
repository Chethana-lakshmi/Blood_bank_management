const BloodStock = require('../models/BloodStock');
const Notification = require('../models/Notification');
const User = require('../models/User');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * @desc    Get all blood stock (all 8 groups)
 * @route   GET /api/blood-stock
 * @access  Private
 */
const getAllStock = async (req, res, next) => {
  try {
    // Ensure all 8 blood groups exist in DB
    const stocks = await BloodStock.find({}).sort({ bloodGroup: 1 });

    // Map by blood group for easy lookup
    const stockMap = {};
    stocks.forEach((s) => {
      stockMap[s.bloodGroup] = s;
    });

    // Build response ensuring all groups represented
    const allStock = BLOOD_GROUPS.map((bg) => {
      if (stockMap[bg]) return stockMap[bg];
      return {
        bloodGroup: bg,
        unitsAvailable: 0,
        status: 'OUT_OF_STOCK',
        lastUpdated: null,
      };
    });

    const totalUnits = stocks.reduce((sum, s) => sum + s.unitsAvailable, 0);
    const lowStockGroups = allStock.filter(
      (s) => s.status === 'LOW_STOCK' || s.status === 'OUT_OF_STOCK'
    );

    return res.status(200).json({
      success: true,
      data: {
        stocks: allStock,
        summary: {
          totalUnits,
          lowStockGroups: lowStockGroups.map((s) => s.bloodGroup),
          outOfStockGroups: allStock
            .filter((s) => s.status === 'OUT_OF_STOCK')
            .map((s) => s.bloodGroup),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get stock for a specific blood group
 * @route   GET /api/blood-stock/:bloodGroup
 * @access  Private
 */
const getStockByGroup = async (req, res, next) => {
  try {
    const { bloodGroup } = req.params;

    // Decode encoded + sign: "A%2B" → "A+"
    const decodedGroup = decodeURIComponent(bloodGroup);

    if (!BLOOD_GROUPS.includes(decodedGroup)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blood group. Must be one of: ${BLOOD_GROUPS.join(', ')}`,
      });
    }

    let stock = await BloodStock.findOne({ bloodGroup: decodedGroup });

    if (!stock) {
      // Return virtual stock with 0 units
      return res.status(200).json({
        success: true,
        data: {
          stock: {
            bloodGroup: decodedGroup,
            unitsAvailable: 0,
            status: 'OUT_OF_STOCK',
            lastUpdated: null,
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: { stock },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update blood stock (admin only) — pass delta value
 * @route   PATCH /api/blood-stock/:bloodGroup
 * @access  Private (admin)
 */
const updateStock = async (req, res, next) => {
  try {
    const { bloodGroup } = req.params;
    const { delta, reason } = req.body;

    const decodedGroup = decodeURIComponent(bloodGroup);

    if (!BLOOD_GROUPS.includes(decodedGroup)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blood group. Must be one of: ${BLOOD_GROUPS.join(', ')}`,
      });
    }

    if (delta === undefined || delta === null || isNaN(Number(delta))) {
      return res.status(400).json({
        success: false,
        message: 'delta is required and must be a number (positive to add, negative to remove).',
      });
    }

    const deltaNum = Number(delta);

    // Find or create stock entry
    let stock = await BloodStock.findOne({ bloodGroup: decodedGroup });
    if (!stock) {
      if (deltaNum < 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove units from a blood group with no stock.',
        });
      }
      stock = new BloodStock({ bloodGroup: decodedGroup, unitsAvailable: 0 });
    }

    const newUnits = stock.unitsAvailable + deltaNum;

    if (newUnits < 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot remove ${Math.abs(deltaNum)} units. Only ${stock.unitsAvailable} units available for ${decodedGroup}.`,
      });
    }

    stock.unitsAvailable = newUnits;
    await stock.save();

    // Send LOW_STOCK notification to all admins if stock drops to LOW or OUT
    if (newUnits <= 10) {
      const admins = await User.find({ role: 'admin', isActive: true }, '_id');
      const notificationType = newUnits === 0 ? 'LOW_STOCK' : 'LOW_STOCK';
      const notificationMessage =
        newUnits === 0
          ? `⚠️ CRITICAL: ${decodedGroup} blood group is OUT OF STOCK!`
          : `⚠️ LOW STOCK: ${decodedGroup} blood group has only ${newUnits} units remaining.`;

      if (admins.length > 0) {
        const notifications = admins.map((admin) => ({
          user: admin._id,
          message: notificationMessage,
          type: notificationType,
          relatedId: stock._id,
          relatedModel: 'BloodStock',
        }));
        await Notification.insertMany(notifications);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Blood stock for ${decodedGroup} updated. Delta: ${deltaNum > 0 ? '+' : ''}${deltaNum} units.`,
      data: { stock },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Initialize all 8 blood groups if they don't exist
 * @route   POST /api/blood-stock/initialize
 * @access  Private (admin)
 */
const initializeStock = async (req, res, next) => {
  try {
    const operations = BLOOD_GROUPS.map((bg) => ({
      updateOne: {
        filter: { bloodGroup: bg },
        update: { $setOnInsert: { bloodGroup: bg, unitsAvailable: 0 } },
        upsert: true,
      },
    }));

    await BloodStock.bulkWrite(operations);
    const stocks = await BloodStock.find({}).sort({ bloodGroup: 1 });

    return res.status(200).json({
      success: true,
      message: 'Blood stock initialized for all 8 blood groups.',
      data: { stocks },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStock, getStockByGroup, updateStock, initializeStock };
