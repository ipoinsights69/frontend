'use client';

import React from 'react';

interface TimelineDate {
  label: string;
  date: string | null;
  isPast: boolean;
  icon?: string;
}

interface IPOTimelineProps {
  dates: TimelineDate[];
}

const IPOTimeline: React.FC<IPOTimelineProps> = ({ dates }) => {
  // Filter out dates with null values
  const validDates = dates.filter(d => d.date);

  if (validDates.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">No timeline data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-0">
      {validDates.map((item, index) => (
        <div key={index} className="relative flex items-start">
          {/* Line connector */}
          {index < validDates.length - 1 && (
            <div className="absolute top-6 left-4 w-0.5 h-full bg-gray-300 dark:bg-gray-700" />
          )}
          
          {/* Date marker and content */}
          <div className="flex items-start mb-6 relative z-10">
            {/* Date marker */}
            <div className={`mr-4 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
              ${item.isPast 
                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' 
                : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'}`}>
              <span className="text-xs font-bold">{index + 1}</span>
            </div>
            
            {/* Content */}
            <div>
              <h3 className={`text-sm font-semibold 
                ${item.isPast 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-blue-600 dark:text-blue-400'}`}>
                {item.label}
              </h3>
              <time className="text-sm text-gray-600 dark:text-gray-400">{item.date}</time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IPOTimeline;
