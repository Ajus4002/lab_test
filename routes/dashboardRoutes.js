const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

router.get('/monthly-trend', dashboardController.getMonthlyTrend);

router.get('/gender-distribution', dashboardController.getGenderDistribution);

router.get('/age-group-distribution', dashboardController.getAgeGroupDistribution);

router.get('/reports-by-status', dashboardController.getReportsByStatus);

router.get('/top-tests', dashboardController.getTopTests);

router.get('/patient-growth', dashboardController.getPatientGrowth);

router.get('/custom-date-range', dashboardController.getCustomDateRangeStats);

router.get('/summary', dashboardController.getSummaryStats);

module.exports = router;

