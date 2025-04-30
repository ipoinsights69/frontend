'use client';

import React from 'react';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/app/utils/dateUtils';

interface AllotmentHeroProps {
  ipoData: any;
}

const AllotmentHero: React.FC<AllotmentHeroProps> = ({ ipoData }) => {
  const basicDetails = ipoData.basicDetails || {};
  
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            {ipoData.logo_url && (
              <div className="h-12 w-12 flex-shrink-0 bg-white rounded-full p-0.5 shadow-sm">
                <Image 
                  src={ipoData.logo_url} 
                  alt={ipoData.company_name} 
                  width={48} 
                  height={48} 
                  className="rounded-full object-contain" 
                />
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{ipoData.company_name}</h1>
              <p className="text-sm text-gray-500">{ipoData.ipo_name || `${ipoData.company_name} IPO`}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="px-3 py-1.5 bg-white rounded-md shadow-sm">
              <div className="text-gray-500">Issue Price</div>
              <div className="font-medium text-gray-900">₹{formatCurrency(basicDetails.priceRange?.max || ipoData.price_range?.max || ipoData.issue_price || '0')}</div>
            </div>
            
            <div className="px-3 py-1.5 bg-white rounded-md shadow-sm">
              <div className="text-gray-500">Issue Size</div>
              <div className="font-medium text-gray-900">₹{formatCurrency(basicDetails.issueSize || ipoData.issue_size || '0')} Cr</div>
            </div>
            
            <div className="px-3 py-1.5 bg-white rounded-md shadow-sm">
              <div className="text-gray-500">Lot Size</div>
              <div className="font-medium text-gray-900">{basicDetails.lotSize || ipoData.lot_size || '0'} Shares</div>
            </div>
            
            <div className="px-3 py-1.5 bg-white rounded-md shadow-sm">
              <div className="text-gray-500">Allotment Date</div>
              <div className="font-medium text-gray-900">{formatDate(ipoData.allotment_date) || 'TBA'}</div>
            </div>
          </div>
        </div>
        
        {ipoData.status === 'upcoming' && (
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-700 mb-6">
            <div className="flex items-center">
              <i className="fas fa-info-circle mr-2"></i>
              <p>Allotment status will be available after the IPO closes and allotment is finalized.</p>
            </div>
          </div>
        )}
        
        {ipoData.status === 'open' && (
          <div className="bg-green-50 border border-green-100 rounded-md p-3 text-sm text-green-700 mb-6">
            <div className="flex items-center">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              <p>IPO is currently open for subscription. Allotment status will be available after {formatDate(ipoData.allotment_date)}.</p>
            </div>
          </div>
        )}
        
        {(ipoData.status === 'closed' && new Date(ipoData.allotment_date) > new Date()) && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm text-yellow-700 mb-6">
            <div className="flex items-center">
              <i className="fas fa-clock mr-2"></i>
              <p>IPO subscription is closed. Allotment status will be available on {formatDate(ipoData.allotment_date)}.</p>
            </div>
          </div>
        )}
        
        {((ipoData.status === 'closed' && new Date(ipoData.allotment_date) <= new Date()) || ipoData.status === 'listed') && (
          <div className="bg-purple-50 border border-purple-100 rounded-md p-3 text-sm text-purple-700 mb-6">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <p>Allotment is finalized. You can check your application status below.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllotmentHero; 