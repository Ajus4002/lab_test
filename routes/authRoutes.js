const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Public routes
router.post('/register', 
  authController.registerValidation, 
  validate, 
  authController.register
);

router.post('/login', 
  authController.loginValidation, 
  validate, 
  authController.login
);

// Protected routes
router.get('/profile', auth, authController.getProfile);

router.put('/profile', 
  auth, 
  authController.profileUpdateValidation, 
  validate, 
  authController.updateProfile
);

router.post('/change-password', auth, authController.changePassword);

module.exports = router;

