'use client';

import React from 'react';
import { formatDate } from '@/app/utils/dateUtils';
import { IPO } from '@/app/types/IPO';
import { format, isPast, parseISO, isToday } from 'date-fns';

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
}> = ({ type, date, status, index, totalSteps }) => {
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
        const [_, month, day, year] = match;
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
          const [_, month, day, year] = match;
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
          const [_, month, day, year] = match;
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

  // Add fake data for testing if needed
  if (processedSteps.length === 0 && ipoData.status === 'listed') {
    processedSteps.push({
      type: 'Listing',
      date: new Date().toISOString().split('T')[0],
      icon: 'fa-chart-line',
      status: 'completed'
    });
  }

  // Debug: log all processed steps
  console.log('Processed steps:', processedSteps.map(s => ({ type: s.type, date: s.date, status: s.status })));
  console.log('IPO status:', ipoData.status);
  
  // Force completion of the Listing step and fix the progress bar calculation
  processedSteps.forEach((step, index) => {
    // Force all steps to completed if all dates are in the past
    const stepDate = step.date ? new Date(step.date) : null;
    if (stepDate && stepDate <= currentDate) {
      step.status = 'completed';
      console.log(`Force completed for ${step.type} because ${stepDate} <= ${currentDate}`);
    }
    
    // Always mark earlier steps as completed if later steps are completed
    if (index > 0 && processedSteps[index-1].status !== 'completed') {
      const prevStep = processedSteps[index-1];
      const currentStepCompleted = step.status === 'completed';
      if (currentStepCompleted) {
        prevStep.status = 'completed';
        console.log(`Force completed for ${prevStep.type} because ${step.type} is completed`);
      }
    }
  });
  
  // As a final sanity check, force the Listing step to be completed for specific IPO statuses
  const listingStep = processedSteps.find(step => step.type === 'Listing');
  if (listingStep) {
    if (ipoData.status === 'listed' || listingDatePassed) {
      listingStep.status = 'completed';
      console.log('Forcing Listing step to completed as final check');
    }
  }
  
  // Calculate progress percentage based on completed steps
  const completedSteps = processedSteps.filter(step => step.status === 'completed').length;
  const progressPercentage = processedSteps.length > 0 
    ? (completedSteps / processedSteps.length) * 100
    : 0;

  return (
    <section className="bg-white border-b border-gray-200 py-6 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-gray-800">{ipoData.companyName || 'IPO'} Timeline</h2>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
          ipoData.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
          ipoData.status === 'open' ? 'bg-green-50 text-green-600' :
          ipoData.status === 'closed' ? 'bg-yellow-50 text-yellow-600' :
          ipoData.status === 'listed' ? 'bg-green-50 text-green-600' :
          'bg-gray-50 text-gray-600'
        }`}>
          {ipoData.status ? ipoData.status.charAt(0).toUpperCase() + ipoData.status.slice(1) : 'Unknown'}
        </span>
      </div>
      
      <div className="relative">
        {/* Gray background line */}
        <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
        
        {/* Blue progress line */}
        <div 
          className="absolute top-2 left-0 h-0.5 bg-blue-600 z-10 transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        {/* Timeline steps */}
        <div className="grid grid-cols-6 relative z-20">
          {processedSteps.map((step, index) => (
            <TimelineStep
              key={index}
              type={step.type}
              date={step.date}
              status={step.status}
              index={index}
              totalSteps={processedSteps.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 