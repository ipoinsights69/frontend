'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { trackButtonClick } from '@/lib/analytics';

interface AnalyticsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText: string;
  buttonLocation: string;
  className?: string;
}

export default function AnalyticsButton({
  buttonText,
  buttonLocation,
  className = '',
  onClick,
  children,
  ...props
}: AnalyticsButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the button click in analytics
    trackButtonClick(buttonText, buttonLocation);
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children || buttonText}
    </button>
  );
} 