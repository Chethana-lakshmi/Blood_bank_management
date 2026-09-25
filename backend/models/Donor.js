const mongoose = require('mongoose');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      default: () => new Date('2000-01-01'),
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other', 'MALE', 'FEMALE', 'OTHER'],
        message: 'Gender must be Male, Female, or Other',
      },
      default: 'Male',
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUPS,
        message: `Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`,
      },
      required: [true, 'Blood group is required'],
    },
    address: {
      type: String,
      trim: true,
      default: '',
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
    lastDonationDate: {
      type: Date,
      default: null,
    },
    donationCount: {
      type: Number,
      default: 0,
      min: [0, 'Donation count cannot be negative'],
    },
    availabilityStatus: {
      type: String,
      enum: {
        values: ['AVAILABLE', 'UNAVAILABLE'],
        message: 'Availability status must be AVAILABLE or UNAVAILABLE',
      },
      default: 'AVAILABLE',
    },
    medicalConditions: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
donorSchema.index({ bloodGroup: 1 });
donorSchema.index({ city: 1 });
donorSchema.index({ availabilityStatus: 1 });
donorSchema.index({ bloodGroup: 1, city: 1, availabilityStatus: 1 });

// Virtual: age calculation
donorSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

// Virtual: eligibility (90 days since last donation)
donorSchema.virtual('isEligible').get(function () {
  if (!this.lastDonationDate) return true;
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  return new Date(this.lastDonationDate) <= ninetyDaysAgo;
});

donorSchema.set('toJSON', { virtuals: true });
donorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Donor', donorSchema);
