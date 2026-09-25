const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: {
        values: [
          'REQUEST_SUBMITTED',
          'REQUEST_APPROVED',
          'REQUEST_REJECTED',
          'REQUEST_COMPLETED',
          'DONATION_RECORDED',
          'LOW_STOCK',
          'EMERGENCY',
        ],
        message: 'Invalid notification type',
      },
      required: [true, 'Notification type is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    relatedModel: {
      type: String,
      enum: ['BloodRequest', 'Donation', 'BloodStock', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
