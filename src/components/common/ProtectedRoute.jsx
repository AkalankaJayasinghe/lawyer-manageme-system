import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children,
  requiredRoles = [], 
  redirectTo = '/login',
  requiresAuth = true 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  // If authentication is not required, render the child component
  if (!requiresAuth) {
    return children;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If no specific roles are required, render the child component
  if (requiredRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  const hasRequiredRole = requiredRoles.includes(user?.role);

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user?.role === 'lawyer') {
      return <Navigate to="/lawyer-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// Higher-order component for easier usage
export const withAuth = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Role-based route components
export const UserRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['user']} redirectTo="/login">
    {children}
  </ProtectedRoute>
);

export const LawyerRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['lawyer']} redirectTo="/register-lawyer">
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin']} redirectTo="/login">
    {children}
  </ProtectedRoute>
);

export const LawyerOrUserRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['lawyer', 'user']}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
