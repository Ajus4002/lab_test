import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, User } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AddPatient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      medicalHistory: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post('/api/patients', data);
      toast.success('Patient created successfully!');
      navigate('/patients');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/patients')}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
          <p className="text-gray-600">Create a new patient record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                className="input-field"
                placeholder="Enter patient's full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                min="0"
                max="150"
                {...register('age', { 
                  required: 'Age is required',
                  min: { value: 0, message: 'Age must be positive' },
                  max: { value: 150, message: 'Age must be reasonable' }
                })}
                className="input-field"
                placeholder="Enter age in years"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="input-field"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                className="input-field"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className="input-field"
                placeholder="Enter email address (optional)"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                {...register('emergencyContact')}
                className="input-field"
                placeholder="Emergency contact number (optional)"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className="input-field"
              placeholder="Enter patient's address (optional)"
            />
          </div>
        </div>

        {/* Medical Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical History
            </label>
            <textarea
              {...register('medicalHistory')}
              rows={4}
              className="input-field"
              placeholder="Enter any relevant medical history, allergies, or conditions (optional)"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Patient
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
