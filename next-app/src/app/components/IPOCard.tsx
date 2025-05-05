'use client';

import React from 'react';
import { IPO } from '@/app/types/IPO';

interface IPOCardProps {
  ipo: IPO;
}

const IPOCard: React.FC<IPOCardProps> = ({ ipo }) => {
  // Generate initials for the company logo placeholder
  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (name.substring(0, 2)).toUpperCase();
  };

  // Determine the background color based on the company name
  const getBgColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-red-100 text-red-600',
      'bg-yellow-100 text-yellow-600',
      'bg-indigo-100 text-indigo-600',
      'bg-pink-100 text-pink-600',
      'bg-teal-100 text-teal-600',
      'bg-orange-100 text-orange-600',
      'bg-gray-100 text-gray-600'
    ];
    
    // Use a simple hash of the company name to pick a color
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Get proper status badge with correct color
  const getStatusBadge = () => {
    switch (ipo.status) {
      case 'upcoming':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">Upcoming</span>;
      case 'open':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600">Open Now</span>;
      case 'closed':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">Closed</span>;
      case 'listed':
        if (ipo.listingGainPercentage !== undefined) {
          const isPositive = ipo.listingGainPercentage >= 0;
          return (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {isPositive ? '+' : ''}{ipo.listingGainPercentage.toFixed(2)}%
            </span>
          );
        }
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">Listed</span>;
      default:
        return null;
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Get appropriate dates based on IPO status
  const getDateInfo = () => {
    if (ipo.status === 'upcoming' && ipo.openDate) {
      return {
        label: 'Opens On',
        value: formatDate(ipo.openDate)
      };
    }
    
    if (ipo.status === 'open') {
      return {
        label: 'Closes On',
        value: formatDate(ipo.closeDate)
      };
    }
    
    if (ipo.status === 'closed') {
      return {
        label: 'Closed On',
        value: formatDate(ipo.closeDate)
      };
    }
    
    if (ipo.status === 'listed') {
      return {
        label: 'Listed On',
        value: formatDate(ipo.listingDate)
      };
    }
    
    return { label: '', value: '' };
  };

  // Format price based on available data
  const getPriceInfo = () => {
    if (ipo.priceRange) {
      return {
        label: 'Price Range',
        value: `₹${ipo.priceRange.min}-${ipo.priceRange.max}`
      };
    }
    
    if (ipo.cutOffPrice) {
      return {
        label: 'Price',
        value: `₹${ipo.cutOffPrice}`
      };
    }
    
    if (ipo.issuePrice) {
      return {
        label: 'Issue Price',
        value: ipo.issuePrice
      };
    }
    
    if (ipo.issueSize) {
      return {
        label: 'Issue Size',
        value: `₹${ipo.issueSize} Cr`
      };
    }
    
    return { label: '', value: '' };
  };

  // Get lot size info if available
  const getLotInfo = () => {
    if (ipo.lotSize) {
      return {
        label: 'Lot Size',
        value: `${ipo.lotSize} shares`
      };
    }
    
    return null;
  };

  const dateInfo = getDateInfo();
  const priceInfo = getPriceInfo();
  const lotInfo = getLotInfo();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {ipo.logoUrl ? (
            <img src={ipo.logoUrl} alt={ipo.companyName} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${getBgColor(ipo.companyName)}`}>
              {getInitials(ipo.companyName)}
            </div>
          )}
          
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate">{ipo.companyName}</h3>
            {ipo.industry && (
              <p className="text-xs text-gray-500 truncate">{ipo.industry}</p>
            )}
          </div>
          
          <div className="flex-shrink-0">
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          {dateInfo.value && (
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">{dateInfo.label}</p>
              <p className="text-sm font-medium text-gray-800">{dateInfo.value}</p>
            </div>
          )}
          
          {priceInfo.value && (
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">{priceInfo.label}</p>
              <p className="text-sm font-medium text-gray-800">{priceInfo.value}</p>
            </div>
          )}
        </div>
        
        {lotInfo && (
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-gray-500">{lotInfo.label}:</span>
            <span className="text-sm font-medium text-gray-800">{lotInfo.value}</span>
          </div>
        )}
        
        {ipo.listingAt && (
          <div className="mt-3 flex items-center">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {ipo.listingAt}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPOCard; 