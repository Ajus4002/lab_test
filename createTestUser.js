const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function createTestUser() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    console.log('🔄 Syncing database models...');
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized.');
    
    // Delete existing test user if exists
    await User.destroy({
      where: {
        email: 'test@example.com'
      }
    });
    
    console.log('👥 Creating test user...');
    
    // Hash password manually to ensure it's correct
    const hashedPassword = await bcrypt.hash('testpass123', 12);
    console.log('🔐 Password hashed:', hashedPassword.substring(0, 20) + '...');
    
    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1111111111',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Test user created:', testUser.email);
    
    console.log('🎉 Test user created successfully!');
    console.log('');
    console.log('Test Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: testpass123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed.');
  }
}

createTestUser();
