import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchPatients();
  }, [filters]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        name: searchTerm || '',
        phone: searchTerm || ''
      });
      
      const response = await api.get(`/api/patients?${params}`);
      setPatients(response.data.data.patients);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/api/patients/${patientId}`);
        toast.success('Patient deleted successfully');
        fetchPatients();
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage patient information and records</p>
        </div>
        {isAdmin && (
          <Link
            to="/add-patient"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Patient
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </form>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="input-field w-32"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new patient.'}
            </p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Name</th>
                    <th className="table-header-cell">Age</th>
                    <th className="table-header-cell">Gender</th>
                    <th className="table-header-cell">Phone</th>
                    <th className="table-header-cell">Email</th>
                    <th className="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="table-row">
                      <td className="table-cell font-medium">{patient.name}</td>
                      <td className="table-cell">{patient.age}</td>
                      <td className="table-cell capitalize">{patient.gender}</td>
                      <td className="table-cell">{patient.phone}</td>
                      <td className="table-cell">{patient.email || '-'}</td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/patient/${patient.id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {isAdmin && (
                            <>
                              <Link
                                to={`/patient/${patient.id}/edit`}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(patient.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Patients;


