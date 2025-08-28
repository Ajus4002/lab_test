const patientService = require('../services/patientService');
const { body } = require('express-validator');

class PatientController {
  // Validation rules
  get createPatientValidation() {
    return [
      body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      body('age')
        .isInt({ min: 0, max: 150 })
        .withMessage('Age must be between 0 and 150'),
      body('gender')
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),
      body('phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
      body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email')
    ];
  }

  get updatePatientValidation() {
    return [
      body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      body('age')
        .optional()
        .isInt({ min: 0, max: 150 })
        .withMessage('Age must be between 0 and 150'),
      body('gender')
        .optional()
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),
      body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
      body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email')
    ];
  }

  // Create new patient
  async createPatient(req, res) {
    try {
      const result = await patientService.createPatient(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all patients with filters and pagination
  async getAllPatients(req, res) {
    try {
      const { 
        name, 
        phone, 
        gender, 
        page = 1, 
        limit = 10 
      } = req.query;

      const filters = { name, phone, gender };
      const result = await patientService.getAllPatients(filters, page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get patient by ID
  async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const result = await patientService.getPatientById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update patient
  async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const result = await patientService.updatePatient(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete patient (soft delete)
  async deletePatient(req, res) {
    try {
      const { id } = req.params;
      const result = await patientService.deletePatient(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Search patients
  async searchPatients(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await patientService.searchPatients(q);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get patient statistics
  async getPatientStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      // This could be expanded to include more detailed statistics
      const stats = {
        totalPatients: 0,
        newPatientsThisMonth: 0,
        genderDistribution: {},
        ageGroupDistribution: {}
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
}

module.exports = new PatientController();
