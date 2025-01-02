import React from 'react';

function Input({
  label,
  error,
  id,
  type = 'text',
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          type={type}
          id={id}
          className={`
            appearance-none block w-full px-3 py-2
            border border-gray-300 rounded-md shadow-sm
            placeholder-gray-400
            focus:outline-none focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default Input;
