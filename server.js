const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./config/database');
// Import models to establish associations
require('./models/index');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const bloodReportRoutes = require('./routes/bloodReportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/blood-reports', bloodReportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Blood Report Management System is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Database connection and server start
async function startServer() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    console.log('🔄 Syncing database models...');
    // Sync database models
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized.');
    
    // Test associations
    console.log('🔗 Testing model associations...');
    const { Patient, BloodReport } = require('./models/index');
    console.log('✅ Models loaded successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Blood Report Management System is ready!`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

startServer();

