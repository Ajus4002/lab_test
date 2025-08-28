import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import BloodReports from './pages/BloodReports';
import AddReport from './pages/AddReport';
import ReportPreview from './pages/ReportPreview';
import AddPatient from './pages/AddPatient';
import Layout from './components/Layout';
import ReportDemo from './components/ReportDemo';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      
      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/patients" element={
        <ProtectedRoute>
          <Layout>
            <Patients />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/add-patient" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <AddPatient />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/blood-reports" element={
        <ProtectedRoute>
          <Layout>
            <BloodReports />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/add-report" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <AddReport />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/report/:id" element={
        <ProtectedRoute>
          <Layout>
            <ReportPreview />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/demo-report" element={
        <ProtectedRoute>
          <Layout>
            <ReportDemo />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

