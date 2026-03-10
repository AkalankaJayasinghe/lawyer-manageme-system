import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/not-found.css';

const NotFound = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="back-button">
          Go to {isAuthenticated ? "Dashboard" : "Login"}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;