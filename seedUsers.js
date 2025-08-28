const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function seedUsers() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    console.log('🔄 Syncing database models...');
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized.');
    
    // Check if users already exist
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('✅ Users already exist in database. Skipping seed.');
      return;
    }
    
    console.log('👥 Creating demo users...');
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '+1234567890',
      password: 'password123',
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin user created:', adminUser.email);
    
    // Create patient user
    const patientUser = await User.create({
      name: 'Patient User',
      email: 'patient@example.com',
      phone: '+0987654321',
      password: 'password123',
      role: 'patient',
      isActive: true
    });
    console.log('✅ Patient user created:', patientUser.email);
    
    console.log('🎉 Demo users created successfully!');
    console.log('');
    console.log('Demo Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Patient: patient@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed.');
  }
}

seedUsers();
