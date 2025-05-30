import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  className = '',
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-200 text-gray-700",
    secondary: "bg-gray-100 text-gray-800"
  };
  
  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
} 