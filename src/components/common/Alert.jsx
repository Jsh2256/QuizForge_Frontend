import React from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const variants = {
  success: {
    icon: CheckCircleIcon,
    className: 'bg-green-50 text-green-800',
    iconClassName: 'text-green-400'
  },
  error: {
    icon: XCircleIcon,
    className: 'bg-red-50 text-red-800',
    iconClassName: 'text-red-400'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    className: 'bg-yellow-50 text-yellow-800',
    iconClassName: 'text-yellow-400'
  },
  info: {
    icon: InformationCircleIcon,
    className: 'bg-blue-50 text-blue-800',
    iconClassName: 'text-blue-400'
  }
};

function Alert({ title, message, variant = 'info' }) {
  const { icon: Icon, className, iconClassName } = variants[variant];

  return (
    <div className={`rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClassName}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {message && (
            <div className="text-sm mt-2">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Alert;
