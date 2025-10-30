import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200';
  const variantClasses =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
