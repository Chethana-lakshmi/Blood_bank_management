const mongoose = require('mongoose');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const bloodRequestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital reference is required'],
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: [100, 'Patient name cannot exceed 100 characters'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUPS,
        message: `Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`,
      },
      required: [true, 'Blood group is required'],
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Units required is a mandatory field'],
      min: [1, 'At least 1 unit must be requested'],
      max: [50, 'Cannot request more than 50 units at once'],
    },
    requiredDate: {
      type: Date,
      required: [true, 'Required date is mandatory'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason for request is required'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    urgency: {
      type: String,
      enum: {
        values: ['NORMAL', 'URGENT', 'EMERGENCY'],
        message: 'Urgency must be NORMAL, URGENT, or EMERGENCY',
      },
      default: 'NORMAL',
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
        message: 'Status must be PENDING, APPROVED, REJECTED, or COMPLETED',
      },
      default: 'PENDING',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bloodRequestSchema.index({ hospital: 1 });
bloodRequestSchema.index({ status: 1 });
bloodRequestSchema.index({ urgency: 1 });
bloodRequestSchema.index({ bloodGroup: 1 });
bloodRequestSchema.index({ city: 1 });
bloodRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
