import React from 'react';
import Link from 'next/link';
import { IPOSummary } from '@/lib/server/ipoDataService';

interface IPOListProps {
  ipos: IPOSummary[];
  title: string;
  loading?: boolean;
  error?: Error | null;
  showViewAll?: boolean;
  viewAllLink?: string;
  limit?: number;
}

const IPOList = ({
  ipos,
  title,
  loading = false,
  error = null,
  showViewAll = true,
  viewAllLink = '/ipos',
  limit = 5
}: IPOListProps) => {
  const displayIpos = limit ? ipos.slice(0, limit) : ipos;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'listed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getLabelByStatus = (status: string | null) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'upcoming':
        return 'Upcoming';
      case 'closed':
        return 'Closed';
      case 'listed':
        return 'Listed';
      default:
        return 'Unknown';
    }
  };

  const getGainClass = (gain: number | null) => {
    if (gain === null) return 'text-gray-500';
    return gain >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatGain = (gain: number | null) => {
    if (gain === null) return 'N/A';
    return `${gain >= 0 ? '+' : ''}${gain.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 mb-4">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p>Error loading IPO data: {error.message}</p>
        </div>
      </div>
    );
  }

  if (displayIpos.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500">No IPOs found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        {showViewAll && (
          <Link 
            href={viewAllLink} 
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Price
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Listing Gain
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayIpos.map((ipo) => (
              <tr key={ipo.ipo_id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Link 
                    href={`/ipo/${ipo.ipo_id}`} 
                    className="font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    {ipo.company_name || ipo.ipo_name || 'Unknown'}
                  </Link>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {ipo.issue_price || 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(ipo.status)}`}>
                    {getLabelByStatus(ipo.status)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {ipo.status === 'upcoming' ? 
                    formatDate(ipo.opening_date) : 
                    ipo.status === 'open' ? 
                      `${formatDate(ipo.opening_date)} - ${formatDate(ipo.closing_date)}` : 
                      ipo.status === 'listed' ? 
                        formatDate(ipo.listing_date) : 
                        ipo.status === 'closed' ? 
                          formatDate(ipo.closing_date) : 
                          'N/A'
                  }
                </td>
                <td className={`px-4 py-4 whitespace-nowrap ${getGainClass(ipo.listing_gains_numeric)}`}>
                  {formatGain(ipo.listing_gains_numeric)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IPOList; 