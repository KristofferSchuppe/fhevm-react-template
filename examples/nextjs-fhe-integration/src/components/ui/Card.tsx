import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 shadow-xl ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-gray-700 pb-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
