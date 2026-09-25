const mongoose = require('mongoose');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: [true, 'Donor reference is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUPS,
        message: `Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`,
      },
      required: [true, 'Blood group is required'],
    },
    unitsDonated: {
      type: Number,
      required: [true, 'Units donated is required'],
      min: [1, 'At least 1 unit must be donated'],
      max: [2, 'Cannot donate more than 2 units at once'],
    },
    donationDate: {
      type: Date,
      required: [true, 'Donation date is required'],
      default: Date.now,
    },
    location: {
      type: String,
      required: [true, 'Donation location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recorded by (admin/user) reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
donationSchema.index({ donor: 1 });
donationSchema.index({ bloodGroup: 1 });
donationSchema.index({ donationDate: -1 });
donationSchema.index({ recordedBy: 1 });

module.exports = mongoose.model('Donation', donationSchema);
