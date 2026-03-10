import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute, { UserRoute, LawyerRoute, AdminRoute } from './components/common/ProtectedRoute';
import Layout from './layout/MainLayout';
import './styles/global.css';

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LawyersPage = lazy(() => import('./pages/LawyersPage'));
const LawyerProfilePage = lazy(() => import('./pages/LawyerProfilePage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const LawyerProfileManagement = lazy(() => import('./pages/LawyerProfileManagement'));
const BookingManagement = lazy(() => import('./pages/BookingManagement'));
const MessagingPage = lazy(() => import('./pages/MessagingPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const DocumentManagement = lazy(() => import('./pages/DocumentManagement'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const About = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Loading component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/lawyers" element={<LawyersPage />} />
                <Route path="/lawyers/:id" element={<LawyerProfilePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes - General */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* Protected Routes - User Only */}
                <Route path="/client-dashboard" element={
                  <UserRoute>
                    <ClientDashboard />
                  </UserRoute>
                } />
                
                {/* Protected Routes - Lawyer Routes */}
                <Route path="/lawyer-dashboard" element={
                  <LawyerRoute>
                    <Dashboard />
                  </LawyerRoute>
                } />
                <Route path="/lawyer-profile-management" element={
                  <LawyerRoute>
                    <LawyerProfileManagement />
                  </LawyerRoute>
                } />
                
                {/* Protected Routes - Shared */}
                <Route path="/booking/:id" element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } />
                <Route path="/booking-management" element={
                  <ProtectedRoute>
                    <BookingManagement />
                  </ProtectedRoute>
                } />
                <Route path="/messaging" element={
                  <ProtectedRoute>
                    <MessagingPage />
                  </ProtectedRoute>
                } />
                <Route path="/payment/:id" element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                } />
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <DocumentManagement />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                
                {/* Catch all route - 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;