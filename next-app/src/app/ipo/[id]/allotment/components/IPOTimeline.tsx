'use client';

import React from 'react';
import { formatDate } from '@/app/utils/dateUtils';
import { IPO } from '@/app/types/IPO';
import { isToday } from 'date-fns';

interface IPOTimelineProps {
  ipoData: IPO;
}

interface TimelineStep {
  type: string;
  date: string | null;
  icon: string;
  status: 'completed' | 'active' | 'upcoming';
}

// Timeline Step Component
const TimelineStep: React.FC<{ 
  type: string; 
  date: string | null; 
  status: 'completed' | 'active' | 'upcoming';
  index: number;
  totalSteps: number; 
}> = ({ type, date, status }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`h-5 w-5 rounded-full flex items-center justify-center ${
          status === 'completed' 
            ? 'bg-blue-500 border-2 border-blue-500 text-white' 
            : status === 'active'
              ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
              : 'bg-white border-2 border-gray-300'
        }`}
      >
        {status === 'completed' ? (
          <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
          </svg>
        ) : (
          <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
        )}
      </div>
      <div className={`mt-2 text-xs font-medium ${
        status === 'completed' ? 'text-blue-600' : 
        status === 'active' ? 'text-blue-600' : 
        'text-gray-500'
      }`}>{type}</div>
      <div className="text-xs text-gray-500">{date ? formatDate(date) : 'TBA'}</div>
    </div>
  );
};

export default function IPOTimeline({ ipoData }: IPOTimelineProps) {
  // Calculate credit date (typically 1 day after refund date)
  let creditDate: string | null = null;
  if (ipoData.refundDate) {
    const refundDateObj = new Date(ipoData.refundDate);
    refundDateObj.setDate(refundDateObj.getDate() + 1);
    creditDate = refundDateObj.toISOString().split('T')[0];
  }

  const formatDateString = (dateStr: string | null | undefined): string | null => {
    if (!dateStr) return null;
    
    // First, try to parse the date directly
    let date = new Date(dateStr);
    
    // If the date is invalid (like "Wed, Nov 6, 2024"), try to parse it differently
    if (isNaN(date.getTime())) {
      // Handle formats like "Wed, Nov 6, 2024"
      const match = dateStr.match(/[a-zA-Z]+,\s*([a-zA-Z]+)\s*(\d+),\s*(\d+)/);
      if (match) {
        const [, month, day, year] = match;
        const monthMap: {[key: string]: number} = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        date = new Date(parseInt(year), monthMap[month], parseInt(day));
      }
    }
    
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return null;
  };

  // Check if a date is in the past
  const isDateInPast = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false;
    
    try {
      // Handle various date formats
      const now = new Date();
      
      // First, try standard date parsing
      const date = new Date(dateStr);
      
      // If that fails, try manual parsing for formats like "Wed, Nov 6, 2024"
      if (isNaN(date.getTime())) {
        const match = dateStr.match(/[a-zA-Z]+,\s*([a-zA-Z]+)\s*(\d+),\s*(\d+)/);
        if (match) {
          const [, month, day, year] = match;
          const monthMap: {[key: string]: number} = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
          };
          const parsedDate = new Date(parseInt(year), monthMap[month], parseInt(day));
          return parsedDate < now;
        }
        return false;
      }
      
      return date < now;
    } catch (e) {
      console.error("Error comparing dates:", e);
      return false;
    }
  };
  
  // Check if a date is today
  const isDateToday = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false;
    
    try {
      // Handle various date formats
      // First, try standard date parsing
      const date = new Date(dateStr);
      
      // If that fails, try manual parsing for formats like "Wed, Nov 6, 2024"
      if (isNaN(date.getTime())) {
        const match = dateStr.match(/[a-zA-Z]+,\s*([a-zA-Z]+)\s*(\d+),\s*(\d+)/);
        if (match) {
          const [, month, day, year] = match;
          const monthMap: {[key: string]: number} = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
          };
          const parsedDate = new Date(parseInt(year), monthMap[month], parseInt(day));
          return isToday(parsedDate);
        }
        return false;
      }
      
      return isToday(date);
    } catch (e) {
      console.error("Error checking if date is today:", e);
      return false;
    }
  };

  // Timeline steps data
  const steps = [
    {
      type: 'Open',
      date: formatDateString(ipoData.openDate),
      icon: 'fa-calendar-check',
    },
    {
      type: 'Close',
      date: formatDateString(ipoData.closeDate),
      icon: 'fa-calendar-xmark',
    },
    {
      type: 'Allotment',
      date: formatDateString(ipoData.allotmentDate),
      icon: 'fa-file-circle-check',
    },
    {
      type: 'Refund',
      date: formatDateString(ipoData.refundDate),
      icon: 'fa-money-bill-transfer',
    },
    {
      type: 'Credit',
      date: formatDateString(creditDate) || formatDateString(ipoData.allotmentDate), // Use calculated credit date or fallback to allotment date
      icon: 'fa-share-nodes',
    },
    {
      type: 'Listing',
      date: formatDateString(ipoData.listingDate),
      icon: 'fa-chart-line',
    },
  ];

  // Current date for comparison
  const currentDate = new Date();
  
  // Directly check if the listing date has passed
  const ipoListingDate = ipoData.listingDate ? new Date(ipoData.listingDate) : null;
  const listingDatePassed = ipoListingDate && ipoListingDate < currentDate;
  
  // Check if it's listed by status
  const isListed = ipoData.status === 'listed';
  
  console.log('IPO Data:', {
    status: ipoData.status,
    listingDate: ipoData.listingDate,
    listingDatePassed: listingDatePassed,
    isListed: isListed,
    id: ipoData.id
  });
  
  // Filter out steps with no dates and determine their status
  const processedSteps = steps
    .filter(step => step.date)
    .map(step => {
      let status: 'completed' | 'active' | 'upcoming' = 'upcoming';
      
      // Force Listing step to completed if today is past the listing date
      if (step.type === 'Listing') {
        // Try to use the listing date from the date string, fallback to ipoData.listingDate
        const stepDate = step.date ? new Date(step.date) : null;
        
        // Directly use the listing date information we gathered earlier
        if (isListed || listingDatePassed) {
          status = 'completed';
          console.log('Forcing Listing step to completed based on IPO status or listing date');
        } else if (stepDate && stepDate < currentDate) {
          status = 'completed';
          console.log('Forcing Listing step to completed based on step date');
        }
      }
      // Special case for Open step - check if IPO status is open/closed/listed
      else if (step.type === 'Open' && ['open', 'closed', 'listed'].includes(ipoData.status || '')) {
        status = 'completed';
      }
      // Special case for Close step - check if IPO status is closed/listed
      else if (step.type === 'Close' && ['closed', 'listed'].includes(ipoData.status || '')) {
        status = 'completed';
      }
      // Check if the date is today
      else if (isDateToday(step.date)) {
        status = 'active';
      } 
      // Check if the date is in the past
      else if (isDateInPast(step.date)) {
        status = 'completed';
      }
      
      console.log(`Step ${step.type}: Status=${status}, Date=${step.date}`);
      return { ...step, status };
    });

    return (
        <section className="bg-white py-6 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-calendar-alt text-blue-600 mr-2"></i>
              IPO Timeline
            </h2>
            
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-gray-200"></div>
              
              {/* Timeline steps */}
              <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {processedSteps.map((step, index) => (
                  <TimelineStep 
                    key={step.type}
                    type={step.type}
                    date={step.date}
                    status={step.status}
                    index={index}
                    totalSteps={processedSteps.length}
                  />
                ))}
              </div>
            </div>
            
            {/* Current status */}
            <div className="mt-8 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Current Status:</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  ipoData.status === 'listed' 
                    ? 'bg-green-50 text-green-700' 
                    : ipoData.status === 'closed' 
                      ? 'bg-purple-50 text-purple-700'
                      : ipoData.status === 'open'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {ipoData.status === 'listed' 
                    ? 'Listed' 
                    : ipoData.status === 'closed'
                      ? 'Allotment In Progress'
                      : ipoData.status === 'open'
                        ? 'Open For Subscription'
                        : 'Upcoming'}
                </span>
                
                {ipoData.status === 'listed' && (
                  <div className="ml-auto text-xs flex items-center">
                    <span className="text-gray-600 mr-1.5">Listed on</span>
                    <span className="font-medium">{formatDate(ipoData.listingDate || '')}</span>
                    <span className={`ml-1.5 ${ipoData.listingGainPercentage && ipoData.listingGainPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {ipoData.listingGainPercentage && (
                        <>(
                          {ipoData.listingGainPercentage > 0 ? '+' : ''}
                          {ipoData.listingGainPercentage}%
                        )</>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
} 