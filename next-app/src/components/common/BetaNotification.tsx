'use client';

import { useState, useEffect } from 'react';

const BetaNotification = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Only show beta notification if NEXT_PUBLIC_BETA_MODE is true
  const isBetaMode = process.env.NEXT_PUBLIC_BETA_MODE === 'true';
  
  // Check if the notification was previously dismissed
  useEffect(() => {
    if (!isBetaMode) {
      setIsVisible(false);
      return;
    }
    
    const dismissed = localStorage.getItem('betaNotificationDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, [isBetaMode]);
  
  const dismissNotification = () => {
    setIsVisible(false);
    localStorage.setItem('betaNotificationDismissed', 'true');
  };
  
  if (!isVisible || !isBetaMode) return null;
  
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <span className="flex p-1.5 bg-yellow-100 rounded-lg mr-3">
              <svg className="h-4 w-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <p className="text-sm font-medium text-yellow-700">
              <span>🚧 Beta Version: We're actively improving our website. Data is accurate, but some features are still in development.</span>
            </p>
          </div>
          <div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
            <button
              onClick={dismissNotification}
              className="text-yellow-600 hover:text-yellow-800"
              aria-label="Dismiss"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaNotification; 