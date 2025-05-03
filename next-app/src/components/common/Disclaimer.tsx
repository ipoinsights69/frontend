'use client';

import React, { useState, useEffect } from 'react';

export default function Disclaimer() {
  const [minimized, setMinimized] = useState(false);
  const [hideForSession, setHideForSession] = useState(false);
  
  useEffect(() => {
    // Check if user has previously hidden the disclaimer
    const disclaimerState = localStorage.getItem('disclaimerState');
    if (disclaimerState) {
      const { minimized, hidden } = JSON.parse(disclaimerState);
      setMinimized(minimized);
      setHideForSession(hidden);
    }
  }, []);
  
  // Don't render if hidden for session
  if (hideForSession) return null;
  
  const savePreference = (minimized: boolean, hidden: boolean) => {
    setMinimized(minimized);
    setHideForSession(hidden);
    localStorage.setItem('disclaimerState', JSON.stringify({ minimized, hidden }));
  };
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-800 text-white text-xs border-t border-gray-700 transition-all duration-300 ${minimized ? 'py-1' : 'py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {minimized ? (
            <div className="flex items-center space-x-2">
              <span className="font-medium">DISCLAIMER</span>
              <button 
                onClick={() => savePreference(false, false)}
                className="text-blue-300 hover:text-blue-200 text-xs"
              >
                Expand
              </button>
            </div>
          ) : (
            <div className="pr-8">
              <span className="font-medium">DISCLAIMER:</span>{' '}
              <span>
                No financial information whatsoever published within this application should be considered as advice to buy or sell securities or invest in IPOs. All information is purely for educational purposes. We are not a SEBI-registered analyst. Consult a financial advisor before making investment decisions.
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            {!minimized && (
              <button 
                onClick={() => savePreference(true, false)}
                className="text-gray-300 hover:text-white text-xs"
              >
                Minimize
              </button>
            )}
            <button 
              onClick={() => savePreference(true, true)}
              className="text-gray-300 hover:text-white text-xs"
            >
              Hide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 