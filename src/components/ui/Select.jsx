import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  required = false,
  disabled = false,
  placeholder,
  options = [],
  ...props
}, ref) => {
  const selectClasses = `
    block w-full rounded-md border border-gray-300 px-3 py-2
    bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const value = typeof option === 'object' ? option.value : option;
          const label = typeof option === 'object' ? option.label : option;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
