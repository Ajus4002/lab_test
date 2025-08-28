import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  Eye,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/api/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your blood report management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todayReports}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.monthReports}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Year</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.yearReports}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Report Section */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">New Report Style Demo</h3>
            <p className="text-blue-700">
              Check out the new Aswas Diagnostics-style blood report format with category grouping
            </p>
          </div>
          <Link
            to="/demo-report"
            className="btn-primary bg-blue-600 hover:bg-blue-700"
          >
            View Demo
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.genderDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ gender, percent }) => `${gender} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
          <Link
            to="/blood-reports"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        
        <div className="overflow-hidden">
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
              {stats.recentReports.map((report) => (
                <tr key={report.id} className="table-row">
                  <td className="table-cell font-medium">{report.reportNumber}</td>
                  <td className="table-cell">{report.patient.name}</td>
                  <td className="table-cell">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <Link
                        to={`/report/${report.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <a
                        href={`/api/blood-reports/${report.id}/pdf`}
                        className="text-green-600 hover:text-green-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


