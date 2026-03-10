import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../components/common/Footer';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <Header />
      <div className="container">
        <div className="not-found-content">
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
