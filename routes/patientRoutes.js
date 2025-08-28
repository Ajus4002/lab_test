const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { auth, adminAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Admin only routes
router.post('/', 
  adminAuth, 
  patientController.createPatientValidation, 
  validate, 
  patientController.createPatient
);

router.put('/:id', 
  adminAuth, 
  patientController.updatePatientValidation, 
  validate, 
  patientController.updatePatient
);

router.delete('/:id', adminAuth, patientController.deletePatient);

// Routes accessible by both admin and patients
router.get('/', patientController.getAllPatients);

router.get('/search', patientController.searchPatients);

router.get('/stats', adminAuth, patientController.getPatientStats);

router.get('/:id', patientController.getPatientById);

module.exports = router;

