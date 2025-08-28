import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  FileText,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const BloodReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        patientName: searchTerm || '',
        patientPhone: searchTerm || ''
      });
      
      const response = await api.get(`/api/blood-reports?${params}`);
      setReports(response.data.data.reports);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch blood reports');
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

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this blood report?')) {
      try {
        await api.delete(`/api/blood-reports/${reportId}`);
        toast.success('Blood report deleted successfully');
        fetchReports();
      } catch (error) {
        toast.error('Failed to delete blood report');
      }
    }
  };

  const handleDownloadPDF = async (reportId) => {
    try {
      // Redirect to report preview with print view enabled for better PDF generation
      window.open(`/report/${reportId}?view=print`, '_blank');
      toast.success('Opening report in print view for download');
    } catch (error) {
      toast.error('Failed to open report for download');
    }
  };

  const isAdmin = user?.role === 'admin';

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blood Reports</h1>
          <p className="text-gray-600">Manage blood test reports and results</p>
        </div>
        {isAdmin && (
          <Link
            to="/add-report"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Report
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by patient name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </form>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="input-field"
              placeholder="Start Date"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="mt-4">
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="input-field w-full md:w-48"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blood reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new blood report.'}
            </p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Report #</th>
                    <th className="table-header-cell">Patient</th>
                    <th className="table-header-cell">Date</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {reports.map((report) => (
                    <tr key={report.id} className="table-row">
                      <td className="table-cell font-medium">{report.reportNumber}</td>
                      <td className="table-cell">
                        <div>
                          <div className="font-medium">{report.patient.name}</div>
                          <div className="text-sm text-gray-500">{report.patient.phone}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(report.reportDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/report/${report.id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/report/${report.id}?view=print`}
                            className="text-green-600 hover:text-green-900"
                            title="Print Style View"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDownloadPDF(report.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Download PDF (Print Style)"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <>
                              <Link
                                to={`/report/${report.id}/edit`}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(report.id)}
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

export default BloodReports;


