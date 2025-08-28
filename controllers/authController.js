const authService = require('../services/authService');
const { body } = require('express-validator');

class AuthController {
  // Validation rules
  get registerValidation() {
    return [
      body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
      body('phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
      body('role')
        .optional()
        .isIn(['admin', 'patient'])
        .withMessage('Role must be either admin or patient')
    ];
  }

  get loginValidation() {
    return [
      body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
      body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
      body('password')
        .notEmpty()
        .withMessage('Password is required')
    ];
  }

  get profileUpdateValidation() {
    return [
      body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
      body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number')
    ];
  }

  // Register new user
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, phone, password } = req.body;
      
      if (!email && !phone) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either email or phone number'
        });
      }

      const result = await authService.login({ email, phone, password });
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const result = await authService.getProfile(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const result = await authService.updateProfile(req.user.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      const user = await authService.getProfile(req.user.id);
      const isCurrentPasswordValid = await user.data.comparePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      const result = await authService.updateProfile(req.user.id, { password: newPassword });
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();
