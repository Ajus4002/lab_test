const { Op } = require('sequelize');
const Patient = require('../models/Patient');

class PatientService {
  async createPatient(patientData) {
    try {
      // Check if patient with same phone already exists
      const existingPatient = await Patient.findOne({
        where: { phone: patientData.phone }
      });

      if (existingPatient) {
        throw new Error('Patient with this phone number already exists');
      }

      const patient = await Patient.create(patientData);
      
      return {
        success: true,
        message: 'Patient created successfully',
        data: patient
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllPatients(filters = {}, page = 1, limit = 10) {
    try {
      const whereClause = { isActive: true };
      
      // Apply filters
      if (filters.name) {
        whereClause.name = { [Op.iLike]: `%${filters.name}%` };
      }
      
      if (filters.phone) {
        whereClause.phone = { [Op.iLike]: `%${filters.phone}%` };
      }
      
      if (filters.gender) {
        whereClause.gender = filters.gender;
      }

      const offset = (page - 1) * limit;
      
      const { count, rows } = await Patient.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        success: true,
        data: {
          patients: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getPatientById(patientId) {
    try {
      const patient = await Patient.findByPk(patientId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }

      return {
        success: true,
        data: patient
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePatient(patientId, updateData) {
    try {
      const patient = await Patient.findByPk(patientId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Check if phone is being updated and if it conflicts with another patient
      if (updateData.phone && updateData.phone !== patient.phone) {
        const existingPatient = await Patient.findOne({
          where: { 
            phone: updateData.phone,
            id: { [Op.ne]: patientId }
          }
        });

        if (existingPatient) {
          throw new Error('Patient with this phone number already exists');
        }
      }

      await patient.update(updateData);
      
      return {
        success: true,
        message: 'Patient updated successfully',
        data: patient
      };
    } catch (error) {
      throw error;
    }
  }

  async deletePatient(patientId) {
    try {
      const patient = await Patient.findByPk(patientId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Soft delete - set isActive to false
      await patient.update({ isActive: false });
      
      return {
        success: true,
        message: 'Patient deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  async searchPatients(query) {
    try {
      const patients = await Patient.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { phone: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } }
          ]
        },
        limit: 10,
        order: [['name', 'ASC']]
      });

      return {
        success: true,
        data: patients
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PatientService();

