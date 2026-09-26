const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_bloodconnect_jwt_key_2026_production_ready';

/**
 * Generate a signed JWT token for the given user id.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * @desc    Register a new user (donor or hospital)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', '),
        errors: errors.array(),
      });
    }

    const { name, email, password, role, ...profileData } = req.body;

    // Admin registration is not allowed via this route
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be registered via this endpoint.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
    }

    // Create the user
    const user = await User.create({ name, email, password, role: role || 'donor' });

    let profile = null;

    // Create role-specific profile
    if (user.role === 'donor') {
      const {
        phone,
        dateOfBirth,
        gender,
        bloodGroup,
        address,
        city,
        state,
        pincode,
      } = profileData;

      let normalizedGender = gender || 'Male';
      if (gender) {
        normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
      }

      const dob = dateOfBirth ? new Date(dateOfBirth) : new Date('2000-01-01');

      if (!phone || !bloodGroup || !city || !state) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          success: false,
          message: 'Donor registration requires phone, bloodGroup, city, and state.',
        });
      }

      profile = await Donor.create({
        user: user._id,
        phone,
        dateOfBirth: dob,
        gender: normalizedGender,
        bloodGroup,
        address: address || '',
        city,
        state,
        pincode: pincode || '',
      });
    } else if (user.role === 'hospital') {
      const hospitalName = profileData.hospitalName || name;
      const {
        phone,
        licenseNumber,
        address,
        city,
        state,
        pincode,
      } = profileData;

      if (!hospitalName || !phone || !licenseNumber || !city || !state) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          success: false,
          message: 'Hospital registration requires hospital name, phone, license number, city, and state.',
        });
      }

      // Check license uniqueness
      const existingLicense = await Hospital.findOne({
        licenseNumber: licenseNumber.toUpperCase(),
      });
      if (existingLicense) {
        await User.findByIdAndDelete(user._id);
        return res.status(409).json({
          success: false,
          message: 'A hospital with this license number is already registered.',
        });
      }

      profile = await Hospital.create({
        user: user._id,
        hospitalName,
        phone,
        licenseNumber,
        address: address || `${city}, ${state}`,
        city,
        state,
        pincode: pincode || '',
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', '),
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user with profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    let profile = null;
    if (user.role === 'donor') {
      profile = await Donor.findOne({ user: user._id });
    } else if (user.role === 'hospital') {
      profile = await Hospital.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password for authenticated user
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide currentPassword and newPassword.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, changePassword };
