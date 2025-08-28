const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const BloodReport = require('../models/BloodReport');
const Patient = require('../models/Patient');

class DashboardService {
  async getDashboardStats() {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      // Get today's reports
      const todayReports = await BloodReport.count({
        where: {
          reportDate: {
            [Op.gte]: today.toISOString().split('T')[0]
          },
          isActive: true
        }
      });

      // Get this month's reports
      const monthReports = await BloodReport.count({
        where: {
          reportDate: {
            [Op.gte]: startOfMonth.toISOString().split('T')[0]
          },
          isActive: true
        }
      });

      // Get this year's reports
      const yearReports = await BloodReport.count({
        where: {
          reportDate: {
            [Op.gte]: startOfYear.toISOString().split('T')[0]
          },
          isActive: true
        }
      });

      // Get total patients
      const totalPatients = await Patient.count({
        where: { isActive: true }
      });

      // Get total reports
      const totalReports = await BloodReport.count({
        where: { isActive: true }
      });

      // Get recent reports (last 5)
      const recentReports = await BloodReport.findAll({
        where: { isActive: true },
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['name', 'phone']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      // Get monthly trend for the last 6 months
      const monthlyTrend = await this.getMonthlyTrend();

      // Get gender distribution
      const genderDistribution = await this.getGenderDistribution();

      // Get age group distribution
      const ageGroupDistribution = await this.getAgeGroupDistribution();

      return {
        success: true,
        data: {
          todayReports,
          monthReports,
          yearReports,
          totalPatients,
          totalReports,
          recentReports,
          monthlyTrend,
          genderDistribution,
          ageGroupDistribution
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getMonthlyTrend() {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyData = await BloodReport.findAll({
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('report_date')), 'month'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: {
          reportDate: {
            [Op.gte]: sixMonthsAgo
          },
          isActive: true
        },
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('report_date'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('report_date')), 'ASC']]
      });

      return monthlyData.map(item => ({
        month: item.dataValues.month,
        count: parseInt(item.dataValues.count)
      }));
    } catch (error) {
      throw error;
    }
  }

  async getGenderDistribution() {
    try {
      const genderData = await Patient.findAll({
        attributes: [
          'gender',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: { isActive: true },
        group: ['gender']
      });

      return genderData.map(item => ({
        gender: item.gender,
        count: parseInt(item.dataValues.count)
      }));
    } catch (error) {
      throw error;
    }
  }

  async getAgeGroupDistribution() {
    try {
      const ageGroups = [
        { name: '0-18', min: 0, max: 18 },
        { name: '19-30', min: 19, max: 30 },
        { name: '31-50', min: 31, max: 50 },
        { name: '51-65', min: 51, max: 65 },
        { name: '65+', min: 66, max: 150 }
      ];

      const ageDistribution = [];

      for (const group of ageGroups) {
        const count = await Patient.count({
          where: {
            age: {
              [Op.between]: [group.min, group.max]
            },
            isActive: true
          }
        });

        ageDistribution.push({
          ageGroup: group.name,
          count
        });
      }

      return ageDistribution;
    } catch (error) {
      throw error;
    }
  }

  async getReportsByStatus() {
    try {
      const statusData = await BloodReport.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: { isActive: true },
        group: ['status']
      });

      return statusData.map(item => ({
        status: item.status,
        count: parseInt(item.dataValues.count)
      }));
    } catch (error) {
      throw error;
    }
  }

  async getTopTests() {
    try {
      const testData = await sequelize.query(`
        SELECT 
          test_name,
          COUNT(*) as count
        FROM blood_report_tests
        GROUP BY test_name
        ORDER BY count DESC
        LIMIT 10
      `, { type: sequelize.QueryTypes.SELECT });

      return testData;
    } catch (error) {
      throw error;
    }
  }

  async getPatientGrowth() {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const monthlyPatientData = await Patient.findAll({
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'month'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: {
          createdAt: {
            [Op.gte]: twelveMonthsAgo
          },
          isActive: true
        },
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'ASC']]
      });

      return monthlyPatientData.map(item => ({
        month: item.dataValues.month,
        count: parseInt(item.dataValues.count)
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DashboardService();

