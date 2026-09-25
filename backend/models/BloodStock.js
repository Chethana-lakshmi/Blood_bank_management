const mongoose = require('mongoose');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const bloodStockSchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUPS,
        message: `Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`,
      },
      required: [true, 'Blood group is required'],
      unique: true,
    },
    unitsAvailable: {
      type: Number,
      default: 0,
      min: [0, 'Units available cannot be negative'],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: stock status
bloodStockSchema.virtual('status').get(function () {
  if (this.unitsAvailable === 0) return 'OUT_OF_STOCK';
  if (this.unitsAvailable <= 10) return 'LOW_STOCK';
  return 'AVAILABLE';
});

// Pre-save hook: update lastUpdated
bloodStockSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('BloodStock', bloodStockSchema);
