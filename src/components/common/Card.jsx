import React from 'react';

function Card({ 
  title, 
  children, 
  className = '', 
  headerClassName = '',
  bodyClassName = '' 
}) {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className={`px-4 py-5 border-b border-gray-200 ${headerClassName}`}>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
        </div>
      )}
      <div className={`px-4 py-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default Card;
