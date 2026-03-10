import React from 'react';

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const colorClasses = {
  blue: 'border-blue-600',
  white: 'border-white',
  gray: 'border-gray-600',
  green: 'border-green-600',
};

const Spinner = ({ size = 'md', color = 'blue', className = '', label = 'Loading...' }) => {
  return (
    <div role="status" className={`inline-block ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClasses[size]} ${colorClasses[color]}`}
        style={{ borderTopColor: 'transparent' }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export const PageSpinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-64">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-3 text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default Spinner;
