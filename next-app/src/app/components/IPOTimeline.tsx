'use client';

import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { format } from 'date-fns';

interface IPODate {
  date: string;
  label: string;
  isPast: boolean;
}

interface DateItem {
  label: string;
  date: string;
}

export interface IPOTimelineProps {
  dates: {
    openDate?: string;
    closeDate?: string;
    allotmentDate?: string;
    refundsDate?: string;
    listingDate?: string;
    [key: string]: string | undefined;
  };
}

const IPOTimeline: React.FC<IPOTimelineProps> = ({ dates }) => {
  const timelineItems: DateItem[] = [];
  
  if (dates.openDate) {
    timelineItems.push({ label: 'Open Date', date: dates.openDate });
  }
  
  if (dates.closeDate) {
    timelineItems.push({ label: 'Close Date', date: dates.closeDate });
  }
  
  if (dates.allotmentDate) {
    timelineItems.push({ label: 'Allotment Date', date: dates.allotmentDate });
  }
  
  if (dates.refundsDate) {
    timelineItems.push({ label: 'Refunds Date', date: dates.refundsDate });
  }
  
  if (dates.listingDate) {
    timelineItems.push({ label: 'Listing Date', date: dates.listingDate });
  }
  
  // Add any other dates that might be present
  Object.entries(dates).forEach(([key, value]) => {
    if (
      value && 
      !['openDate', 'closeDate', 'allotmentDate', 'refundsDate', 'listingDate'].includes(key)
    ) {
      // Convert camelCase to Title Case (e.g., refundsDate to Refunds Date)
      const label = key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      timelineItems.push({ label, date: value });
    }
  });
  
  if (timelineItems.length === 0) {
    return <div className="text-gray-500">No timeline information available</div>;
  }
  
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-6">
        {timelineItems.map((item, index) => (
          <div key={index} className="relative pl-10">
            <div className="absolute left-0 w-10 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-blue-500 z-10"></div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium">{item.label}</h3>
              <time className="text-sm text-gray-500">{item.date}</time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IPOTimeline; 