import React from 'react';
import Link from 'next/link';
import { IPOSummary } from '@/lib/server/ipoDataService';

interface IPOCalendarProps {
  upcomingIpos: IPOSummary[];
  loading?: boolean;
}

const IPOCalendar: React.FC<IPOCalendarProps> = ({ upcomingIpos, loading = false }) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  const getFormattedDay = (date: Date) => {
    return date.getDate();
  };

  const getFormattedMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'short' });
  };

  const getWeekDay = (date: Date) => {
    return date.toLocaleString('default', { weekday: 'short' });
  };

  // Group IPOs by month for better display
  const groupedIpos = upcomingIpos.reduce((acc, ipo) => {
    const openDate = formatDate(ipo.opening_date);
    if (openDate) {
      const month = getFormattedMonth(openDate);
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(ipo);
    }
    return acc;
  }, {} as Record<string, IPOSummary[]>);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="flex space-x-2 mb-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-16 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show a message if no upcoming IPOs
  if (upcomingIpos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming IPOs scheduled at the moment.</p>
        <Link href="/ipos" className="mt-2 inline-flex items-center text-indigo-600 text-sm font-medium">
          View all IPOs
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[500px]">
      {Object.entries(groupedIpos).map(([month, ipos]) => (
        <div key={month} className="mb-6">
          <h4 className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-3">{month}</h4>
          <div className="space-y-3">
            {ipos.map((ipo) => {
              const openDate = formatDate(ipo.opening_date);
              if (!openDate) return null;
              
              return (
                <Link 
                  href={`/ipo/${ipo.ipo_id}`} 
                  key={ipo.ipo_id}
                  className="flex items-start p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex flex-col items-center mr-4 bg-white shadow-sm rounded-md p-2 w-12">
                    <span className="text-xs text-gray-500">{getWeekDay(openDate)}</span>
                    <span className="text-lg font-bold text-gray-900">{getFormattedDay(openDate)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {ipo.company_name || ipo.ipo_name}
                    </h3>
                    <div className="flex flex-wrap text-xs mt-1">
                      <span className="text-gray-500 mr-3">
                        {ipo.issue_price || 'Price TBA'}
                      </span>
                      {ipo.issue_size && (
                        <span className="text-gray-500">
                          Size: {ipo.issue_size}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="text-center pt-3">
        <Link href="/ipos/upcoming" className="inline-flex items-center text-indigo-600 text-sm font-medium">
          View all upcoming IPOs
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default IPOCalendar; 