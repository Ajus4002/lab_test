const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { email: userData.email },
            { phone: userData.phone }
          ]
        }
      });

      if (existingUser) {
        throw new Error('User with this email or phone already exists');
      }

      // Create new user
      const user = await User.create(userData);
      
      // Generate JWT token
      const token = this.generateToken(user);
      
      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.getPublicProfile(),
          token
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      // Build where clause based on provided credentials
      const whereClause = { isActive: true };
      
      if (credentials.email && credentials.phone) {
        whereClause[require('sequelize').Op.or] = [
          { email: credentials.email },
          { phone: credentials.phone }
        ];
      } else if (credentials.email) {
        whereClause.email = credentials.email;
      } else if (credentials.phone) {
        whereClause.phone = credentials.phone;
      }
      
      // Find user by email or phone
      const user = await User.findOne({
        where: whereClause
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(credentials.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user);
      
      return {
        success: true,
        message: 'Login successful',
        data: {
          user: user.getPublicProfile(),
          token
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        data: user.getPublicProfile()
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Remove sensitive fields from update data
      const { password, role, ...safeUpdateData } = updateData;
      
      await user.update(safeUpdateData);
      
      return {
        success: true,
        message: 'Profile updated successfully',
        data: user.getPublicProfile()
      };
    } catch (error) {
      throw error;
    }
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }
}

module.exports = new AuthService();

