const { sequelize } = require('./config/database');
const User = require('./models/User');

async function checkUsers() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    console.log('👥 Checking existing users...');
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt']
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database.');
    } else {
      console.log(`✅ Found ${users.length} users:`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed.');
  }
}

checkUsers();
