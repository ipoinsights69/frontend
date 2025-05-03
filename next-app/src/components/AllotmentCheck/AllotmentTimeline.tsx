'use client';

import { IPODetailedData } from '@/app/types/IPO';
import { format, parseISO, isPast, isToday } from 'date-fns';

interface AllotmentTimelineProps {
  ipoData: IPODetailedData;
}

export default function AllotmentTimeline({ ipoData }: AllotmentTimelineProps) {
  // Parse dates
  const parseDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return parseISO(dateString);
    } catch (e) {
      return null;
    }
  };

  // Get credit date from basicDetails if available
  const creditOfSharesToDemat = ipoData.basicDetails?.creditOfSharesToDemat;

  const openDate = parseDate(ipoData.openDate);
  const closeDate = parseDate(ipoData.closeDate);
  const allotmentDate = parseDate(ipoData.allotmentDate);
  const refundDate = parseDate(ipoData.refundDate);
  const creditDate = parseDate(creditOfSharesToDemat);
  const listingDate = parseDate(ipoData.listingDate);

  // Format date to display
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return 'TBD';
    return format(date, 'dd MMM yyyy');
  };

  // Determine current stage
  const getCurrentStage = () => {
    if (!openDate) return 0;
    
    if (openDate && (!isPast(openDate) || isToday(openDate))) {
      return 1; // Bidding Open
    }
    
    if (closeDate && isPast(closeDate)) {
      if (allotmentDate && (isPast(allotmentDate) || isToday(allotmentDate))) {
        if (refundDate && isPast(refundDate)) {
          if (creditDate && isPast(creditDate)) {
            if (listingDate && isPast(listingDate)) {
              return 6; // Listed
            }
            return 5; // Credit Transfer Complete
          }
          return 4; // Refund Process
        }
        return 3; // Allotment Finalized
      }
      return 2; // Bidding Closed, Allotment in Process
    }
    
    return 1; // Default to Bidding Open
  };

  const currentStage = getCurrentStage();

  const timelineSteps = [
    { id: 1, name: 'Bidding', date: openDate ? formatDisplayDate(openDate) + ' - ' + formatDisplayDate(closeDate) : 'TBD' },
    { id: 2, name: 'Allotment', date: formatDisplayDate(allotmentDate) },
    { id: 3, name: 'Refund Process', date: formatDisplayDate(refundDate) },
    { id: 4, name: 'Share Credit', date: formatDisplayDate(creditDate) },
    { id: 5, name: 'Listing', date: formatDisplayDate(listingDate) },
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">IPO Timeline</h2>
        
        <div className="relative">
          {/* Timeline Track */}
          <div className="absolute inset-0 flex items-center">
            <div className="h-0.5 w-full bg-gray-200" />
          </div>
          
          {/* Timeline Steps */}
          <ul className="relative flex justify-between">
            {timelineSteps.map((step) => {
              const isActive = currentStage >= step.id;
              const isCurrent = currentStage === step.id;
              
              return (
                <li key={step.id} className="flex flex-col items-center">
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    isActive ? 'bg-blue-600' : 'bg-gray-200'
                  } ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`}>
                    {isActive ? (
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium text-gray-500">{step.id}</span>
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {step.date}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
} 