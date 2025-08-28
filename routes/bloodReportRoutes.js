const express = require('express');
const router = express.Router();
const bloodReportController = require('../controllers/bloodReportController');
const { auth, adminAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Admin only routes
router.post('/', 
  adminAuth, 
  bloodReportController.createReportValidation, 
  validate, 
  bloodReportController.createBloodReport
);

router.put('/:id', 
  adminAuth, 
  bloodReportController.updateReportValidation, 
  validate, 
  bloodReportController.updateBloodReport
);

router.delete('/:id', adminAuth, bloodReportController.deleteBloodReport);

router.post('/bulk-delete', adminAuth, bloodReportController.bulkDeleteReports);

// Routes accessible by both admin and patients
router.get('/', bloodReportController.getAllBloodReports);

router.get('/stats', bloodReportController.getReportStats);

router.get('/date-range', bloodReportController.getReportsByDateRange);

router.get('/:id', bloodReportController.getBloodReportById);

router.get('/:id/preview', bloodReportController.previewReport);

router.get('/:id/pdf', bloodReportController.generatePDF);

module.exports = router;

