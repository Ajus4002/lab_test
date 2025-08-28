const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BloodReport = sequelize.define('BloodReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    defaultValue: function() {
      return 'BR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'patients',
      key: 'id'
    }
  },
  reportDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  doctorNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'blood_reports'
});

module.exports = BloodReport;

