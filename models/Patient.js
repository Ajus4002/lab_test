const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 150
    }
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 20]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emergencyContact: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  emergencyPhone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  medicalHistory: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'patients'
});

module.exports = Patient;

