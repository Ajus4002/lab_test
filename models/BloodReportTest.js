const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BloodReportTest = sequelize.define('BloodReportTest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'blood_reports',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'General',
    validate: {
      notEmpty: true
    }
  },
  testName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  resultValue: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  normalRange: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  isAbnormal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  referenceValue: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'blood_report_tests'
});

module.exports = BloodReportTest;

