import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'default' }) => {
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${size}`}>
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
