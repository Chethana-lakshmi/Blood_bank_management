const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getMe, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Validation rules for registration
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['donor', 'hospital']).withMessage('Role must be donor or hospital'),
];

// Validation rules for login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/me
// @access  Private
router.get('/me', auth, getMe);

// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', auth, changePassword);

module.exports = router;
