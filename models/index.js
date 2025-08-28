const User = require('./User');
const Patient = require('./Patient');
const BloodReport = require('./BloodReport');
const BloodReportTest = require('./BloodReportTest');

// Define associations
Patient.hasMany(BloodReport, {
  foreignKey: 'patientId',
  as: 'bloodReports',
  onDelete: 'CASCADE'
});

BloodReport.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient'
});

BloodReport.hasMany(BloodReportTest, {
  foreignKey: 'reportId',
  as: 'tests',
  onDelete: 'CASCADE'
});

BloodReportTest.belongsTo(BloodReport, {
  foreignKey: 'reportId',
  as: 'bloodReport'
});

// Export models
module.exports = {
  User,
  Patient,
  BloodReport,
  BloodReportTest
};

