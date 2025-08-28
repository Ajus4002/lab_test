import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
    changePassword: '/api/auth/change-password',
  },
  
  // Patients
  patients: {
    list: '/api/patients',
    create: '/api/patients',
    get: (id) => `/api/patients/${id}`,
    update: (id) => `/api/patients/${id}`,
    delete: (id) => `/api/patients/${id}`,
    search: '/api/patients/search',
    stats: '/api/patients/stats',
  },
  
  // Blood Reports
  bloodReports: {
    list: '/api/blood-reports',
    create: '/api/blood-reports',
    get: (id) => `/api/blood-reports/${id}`,
    update: (id) => `/api/blood-reports/${id}`,
    delete: (id) => `/api/blood-reports/${id}`,
    preview: (id) => `/api/blood-reports/${id}/preview`,
    pdf: (id) => `/api/blood-reports/${id}/pdf`,
    stats: '/api/blood-reports/stats',
    dateRange: '/api/blood-reports/date-range',
    bulkDelete: '/api/blood-reports/bulk-delete',
  },
  
  // Dashboard
  dashboard: {
    stats: '/api/dashboard/stats',
    monthlyTrend: '/api/dashboard/monthly-trend',
    genderDistribution: '/api/dashboard/gender-distribution',
    ageGroupDistribution: '/api/dashboard/age-group-distribution',
    reportsByStatus: '/api/dashboard/reports-by-status',
    topTests: '/api/dashboard/top-tests',
    patientGrowth: '/api/dashboard/patient-growth',
    customDateRange: '/api/dashboard/custom-date-range',
    summary: '/api/dashboard/summary',
  },
};

// Helper functions for common API operations
export const apiHelpers = {
  // Get request with error handling
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Request failed' 
      };
    }
  },

  // Post request with error handling
  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Request failed' 
      };
    }
  },

  // Put request with error handling
  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Request failed' 
      };
    }
  },

  // Delete request with error handling
  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Request failed' 
      };
    }
  },
};

export default api;


