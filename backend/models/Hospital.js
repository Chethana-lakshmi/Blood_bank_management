const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: [200, 'Hospital name cannot exceed 200 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ['PENDING', 'VERIFIED', 'REJECTED'],
        message: 'Verification status must be PENDING, VERIFIED, or REJECTED',
      },
      default: 'PENDING',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    specializations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
hospitalSchema.index({ verificationStatus: 1 });
hospitalSchema.index({ city: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
