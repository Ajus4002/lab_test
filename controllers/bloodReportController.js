const bloodReportService = require('../services/bloodReportService');
const { body } = require('express-validator');

class BloodReportController {
  // Validation rules
  get createReportValidation() {
    return [
      body('patientId')
        .isInt()
        .withMessage('Valid patient ID is required'),
      body('reportDate')
        .optional()
        .isISO8601()
        .withMessage('Report date must be a valid date'),
      body('tests')
        .isArray({ min: 1 })
        .withMessage('At least one test result is required'),
      body('tests.*.category')
        .notEmpty()
        .withMessage('Test category is required'),
      body('tests.*.testName')
        .notEmpty()
        .withMessage('Test name is required'),
      body('tests.*.resultValue')
        .notEmpty()
        .withMessage('Test result value is required')
    ];
  }

  get updateReportValidation() {
    return [
      body('reportDate')
        .optional()
        .isISO8601()
        .withMessage('Report date must be a valid date'),
      body('tests')
        .optional()
        .isArray()
        .withMessage('Tests must be an array'),
      body('tests.*.category')
        .optional()
        .notEmpty()
        .withMessage('Test category cannot be empty'),
      body('tests.*.testName')
        .optional()
        .notEmpty()
        .withMessage('Test name cannot be empty'),
      body('tests.*.resultValue')
        .optional()
        .notEmpty()
        .withMessage('Test result value cannot be empty')
    ];
  }

  // Create new blood report
  async createBloodReport(req, res) {
    try {
      const result = await bloodReportService.createBloodReport(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all blood reports with filters and pagination
  async getAllBloodReports(req, res) {
    try {
      const { 
        patientName, 
        patientPhone, 
        startDate, 
        endDate, 
        status, 
        page = 1, 
        limit = 10 
      } = req.query;

      const filters = {
        patientName,
        patientPhone,
        dateRange: startDate && endDate ? { startDate, endDate } : null,
        status
      };

      const result = await bloodReportService.getAllBloodReports(filters, page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get blood report by ID
  async getBloodReportById(req, res) {
    try {
      const { id } = req.params;
      const result = await bloodReportService.getBloodReportById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update blood report
  async updateBloodReport(req, res) {
    try {
      const { id } = req.params;
      const result = await bloodReportService.updateBloodReport(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete blood report (soft delete)
  async deleteBloodReport(req, res) {
    try {
      const { id } = req.params;
      const result = await bloodReportService.deleteBloodReport(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Generate PDF for blood report
  async generatePDF(req, res) {
    try {
      const { id } = req.params;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=blood-report-${id}.pdf`);
      
      const doc = await bloodReportService.generatePDF(id);
      doc.pipe(res);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Preview blood report
  async previewReport(req, res) {
    try {
      const { id } = req.params;
      const result = await bloodReportService.getBloodReportById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get reports by date range
  async getReportsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const result = await bloodReportService.getReportsByDateRange(startDate, endDate);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get report statistics
  async getReportStats(req, res) {
    try {
      const { period = 'month' } = req.query;
      
      let startDate, endDate;
      const now = new Date();
      
      switch (period) {
        case 'today':
          startDate = now.toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
          endDate = new Date().toISOString().split('T')[0];
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
      }

      const result = await bloodReportService.getReportsByDateRange(startDate, endDate);
      
      const stats = {
        period,
        startDate,
        endDate,
        totalReports: result.data.length,
        reports: result.data
      };

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Bulk operations
  async bulkDeleteReports(req, res) {
    try {
      const { reportIds } = req.body;
      
      if (!Array.isArray(reportIds) || reportIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Report IDs array is required'
        });
      }

      const deletePromises = reportIds.map(id => 
        bloodReportService.deleteBloodReport(id)
      );

      await Promise.all(deletePromises);

      res.status(200).json({
        success: true,
        message: `${reportIds.length} reports deleted successfully`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BloodReportController();
