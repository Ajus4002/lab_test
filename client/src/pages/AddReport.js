import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AddReport = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Common test categories
  const testCategories = [
    'BIOCHEMISTRY',
    'HEMATOLOGY',
    'IMMUNOLOGY',
    'MICROBIOLOGY',
    'PATHOLOGY',
    'ENDOCRINOLOGY',
    'CARDIAC MARKERS',
    'LIVER FUNCTION',
    'KIDNEY FUNCTION',
    'GENERAL'
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      patientId: '',
      reportDate: new Date().toISOString().split('T')[0],
      doctorNotes: '',
      tests: [
        {
          category: 'BIOCHEMISTRY',
          testName: '',
          resultValue: '',
          unit: '',
          normalRange: '',
          referenceValue: '',
          notes: ''
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tests"
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  // Refresh patients when component becomes visible (e.g., returning from add-patient)
  useEffect(() => {
    const handleFocus = () => {
      fetchPatients();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/api/patients?limit=1000');
      setPatients(response.data.data.patients);
    } catch (error) {
      toast.error('Failed to fetch patients');
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.post('/api/blood-reports', data);
      toast.success('Blood report created successfully!');
      navigate('/blood-reports');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blood report');
    } finally {
      setLoading(false);
    }
  };

  const addTest = () => {
    append({
      category: 'BIOCHEMISTRY',
      testName: '',
      resultValue: '',
      unit: '',
      normalRange: '',
      referenceValue: '',
      notes: ''
    });
  };

  const removeTest = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Blood Report</h1>
        <p className="text-gray-600">Create a new blood test report</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient and Date Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Report Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Patient *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchPatients}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                    title="Refresh patient list"
                  >
                    ↻ Refresh
                  </button>
                  <Link
                    to="/add-patient"
                    className="text-sm text-primary-600 hover:text-primary-800 underline"
                  >
                    + Add New Patient
                  </Link>
                </div>
              </div>
              <select
                {...register('patientId', { required: 'Patient is required' })}
                className="input-field"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.phone}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Date *
              </label>
              <input
                type="date"
                {...register('reportDate', { required: 'Report date is required' })}
                className="input-field"
              />
              {errors.reportDate && (
                <p className="mt-1 text-sm text-red-600">{errors.reportDate.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor Notes
            </label>
            <textarea
              {...register('doctorNotes')}
              rows={3}
              className="input-field"
              placeholder="Enter any additional notes or observations..."
            />
          </div>
        </div>

        {/* Test Results */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Test Results</h3>
            <button
              type="button"
              onClick={addTest}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Test
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Test #{index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTest(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register(`tests.${index}.category`, { required: 'Category is required' })}
                    className="input-field"
                  >
                    {testCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.tests?.[index]?.category && (
                    <p className="mt-1 text-sm text-red-600">Category is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name *
                  </label>
                  <input
                    {...register(`tests.${index}.testName`, { required: 'Test name is required' })}
                    className="input-field"
                    placeholder="e.g., Total Cholesterol"
                  />
                  {errors.tests?.[index]?.testName && (
                    <p className="mt-1 text-sm text-red-600">Test name is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Result Value *
                  </label>
                  <input
                    {...register(`tests.${index}.resultValue`, { required: 'Result value is required' })}
                    className="input-field"
                    placeholder="e.g., 213"
                  />
                  {errors.tests?.[index]?.resultValue && (
                    <p className="mt-1 text-sm text-red-600">Result value is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <input
                    {...register(`tests.${index}.unit`)}
                    className="input-field"
                    placeholder="e.g., mg/dL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Normal Range
                  </label>
                  <input
                    {...register(`tests.${index}.normalRange`)}
                    className="input-field"
                    placeholder="e.g., 130 - 200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Value
                  </label>
                  <input
                    {...register(`tests.${index}.referenceValue`)}
                    className="input-field"
                    placeholder="e.g., 165"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <input
                    {...register(`tests.${index}.notes`)}
                    className="input-field"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/blood-reports')}
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
                Create Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReport;
