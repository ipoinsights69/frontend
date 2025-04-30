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

  // Get a simplified date display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Determine status badge appearance
  const getStatusBadge = () => {
    if (ipo.status === 'upcoming') {
      return (
        <span className="text-sm font-medium px-2 py-1 rounded bg-blue-50 text-blue-600">
          Upcoming
        </span>
      );
    }

    if (ipo.status === 'open') {
      return (
        <span className="text-sm font-medium px-2 py-1 rounded bg-green-50 text-green-600">
          Open
        </span>
      );
    }

    if (ipo.status === 'closed') {
      return (
        <span className="text-sm font-medium px-2 py-1 rounded bg-orange-50 text-orange-600">
          Closed
        </span>
      );
    }
    
    if ('listingGainPercentage' in ipo && ipo.listingGainPercentage !== undefined) {
      const isPositive = ipo.listingGainPercentage >= 0;
      return (
        <span className={`text-sm font-medium px-2 py-1 rounded ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? '+' : ''}{ipo.listingGainPercentage.toFixed(2)}%
        </span>
      );
    }
    
    return (
      <span className="text-sm font-medium px-2 py-1 rounded bg-gray-50 text-gray-600">
        {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
      </span>
    );
  };

  // Format price display
  const formatPrice = () => {
    if (ipo.priceRange) {
      return `₹${ipo.priceRange.min}-${ipo.priceRange.max}`;
    }
    if (ipo.cutOffPrice) {
      return `₹${ipo.cutOffPrice}`;
    }
    if (ipo.issueSize) {
      return `₹${ipo.issueSize} Cr`;
    }
    return 'N/A';
  };

  // Get the appropriate date to display based on IPO status
  const getDateToDisplay = () => {
    if (ipo.status === 'upcoming' || ipo.status === 'open') {
      return `${formatDate(ipo.openDate)} - ${formatDate(ipo.closeDate)}`;
    }
    if (ipo.status === 'listed') {
      return formatDate(ipo.listingDate);
    }
    if (ipo.status === 'closed') {
      return formatDate(ipo.closeDate);
    }
    return 'N/A';
  };

  return (
    <div className="grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="col-span-5 px-6 py-4 flex items-center">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-semibold text-sm mr-3 ${getBgColor(ipo.companyName)}`}>
          {getInitials(ipo.companyName)}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{ipo.companyName}</h3>
          <p className="text-xs text-gray-500 truncate max-w-xs">{ipo.listingAt || ipo.industry || ''}</p>
        </div>
      </div>
      <div className="col-span-3 px-6 py-4 flex items-center text-sm text-gray-600">
        {getDateToDisplay()}
      </div>
      <div className="col-span-2 px-6 py-4 flex items-center justify-end text-sm font-medium text-gray-900">
        {formatPrice()}
      </div>
      <div className="col-span-2 px-6 py-4 flex items-center justify-end">
        {getStatusBadge()}
      </div>
    </div>
  );
};

export default IPOCard; 