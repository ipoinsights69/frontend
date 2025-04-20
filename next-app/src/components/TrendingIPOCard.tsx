import React from 'react';
import Link from 'next/link';
import { IPOSummary } from '@/lib/server/ipoDataService';

interface TrendingIPOCardProps {
  ipo: IPOSummary;
  label: string;
  color: string;
}

const TrendingIPOCard = ({ ipo, label, color }: TrendingIPOCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/ipo/${ipo.ipo_id}`}>
      <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
        <div className={`${color} px-4 py-2 text-white font-medium text-sm`}>
          {label}
        </div>
        <div className="p-5">
          <div className="flex items-center mb-4">
            {ipo.logo_url ? (
              <img 
                src={ipo.logo_url} 
                alt={`${ipo.company_name || ipo.ipo_name || ''}`}
                className="w-10 h-10 rounded-full mr-3 object-contain bg-gray-50" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold">
                  {(ipo.company_name || ipo.ipo_name || '?').charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {ipo.company_name || ipo.ipo_name}
              </h3>
              <p className="text-sm text-gray-600">IPO {ipo.year}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Issue Price</span>
              <span className="text-sm font-medium">{ipo.issue_price || 'N/A'}</span>
            </div>
            
            {ipo.status === 'listed' && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Listing Gain</span>
                <span className={`text-sm font-medium ${
                  ipo.listing_gains_numeric && ipo.listing_gains_numeric > 0 
                    ? 'text-green-600' 
                    : ipo.listing_gains_numeric && ipo.listing_gains_numeric < 0 
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}>
                  {ipo.listing_gains || 'N/A'}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                {ipo.status === 'upcoming' 
                  ? 'Opening Date' 
                  : ipo.status === 'open' 
                    ? 'Closing Date'
                    : ipo.status === 'listed'
                      ? 'Listed On'
                      : 'Date'}
              </span>
              <span className="text-sm font-medium">
                {ipo.status === 'upcoming' 
                  ? formatDate(ipo.opening_date)
                  : ipo.status === 'open'
                    ? formatDate(ipo.closing_date)
                    : ipo.status === 'listed'
                      ? formatDate(ipo.listing_date)
                      : 'N/A'}
              </span>
            </div>
            
            {ipo.issue_size && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Issue Size</span>
                <span className="text-sm font-medium">{ipo.issue_size}</span>
              </div>
            )}
          </div>
          
          <div className="mt-5 flex justify-end">
            <span className="inline-flex items-center text-indigo-600 text-sm font-medium">
              View details
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TrendingIPOCard; 