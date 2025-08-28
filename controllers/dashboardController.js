const dashboardService = require('../services/dashboardService');

class DashboardController {
  // Get main dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const result = await dashboardService.getDashboardStats();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get monthly trend data
  async getMonthlyTrend(req, res) {
    try {
      const result = await dashboardService.getMonthlyTrend();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get gender distribution
  async getGenderDistribution(req, res) {
    try {
      const result = await dashboardService.getGenderDistribution();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get age group distribution
  async getAgeGroupDistribution(req, res) {
    try {
      const result = await dashboardService.getAgeGroupDistribution();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get reports by status
  async getReportsByStatus(req, res) {
    try {
      const result = await dashboardService.getReportsByStatus();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get top tests
  async getTopTests(req, res) {
    try {
      const result = await dashboardService.getTopTests();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get patient growth
  async getPatientGrowth(req, res) {
    try {
      const result = await dashboardService.getPatientGrowth();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get custom date range statistics
  async getCustomDateRangeStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const result = await dashboardService.getReportsByDateRange(startDate, endDate);
      
      const stats = {
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

  // Get summary statistics
  async getSummaryStats(req, res) {
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

      const result = await dashboardService.getReportsByDateRange(startDate, endDate);
      
      const summary = {
        period,
        startDate,
        endDate,
        totalReports: result.data.length,
        totalPatients: 0, // This could be calculated from the reports
        averageReportsPerDay: 0 // This could be calculated
      };

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DashboardController();

