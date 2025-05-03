import React from 'react';

export default function DataProviders() {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-6 flex items-center text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-gray-700">
        All market data is sourced from publicly available information and updated regularly.
      </p>
    </div>
  );
} 