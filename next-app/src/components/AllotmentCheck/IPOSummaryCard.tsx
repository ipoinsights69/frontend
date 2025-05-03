'use client';

import { IPODetailedData } from '@/app/types/IPO';
import Image from 'next/image';

interface IPOSummaryCardProps {
  ipoData: IPODetailedData;
}

export default function IPOSummaryCard({ ipoData }: IPOSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">IPO Summary</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Company Info */}
        <div className="flex items-start space-x-4">
          {ipoData.logoUrl && (
            <div className="flex-shrink-0">
              <Image
                src={ipoData.logoUrl}
                alt={ipoData.companyName}
                width={48}
                height={48}
                className="rounded-md"
              />
            </div>
          )}
          <div>
            <h3 className="text-base font-medium text-gray-900">{ipoData.companyName}</h3>
            {ipoData.industry && (
              <p className="text-sm text-gray-500 mt-1">{ipoData.industry}</p>
            )}
            {ipoData.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ipoData.description}</p>
            )}
          </div>
        </div>
        
        {/* IPO Details */}
        <div className="border-t border-gray-200 pt-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
            {ipoData.priceRange && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Price Band</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ₹{ipoData.priceRange.min} - ₹{ipoData.priceRange.max}
                </dd>
              </div>
            )}
            
            {ipoData.lotSize && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Lot Size</dt>
                <dd className="mt-1 text-sm text-gray-900">{ipoData.lotSize} shares</dd>
              </div>
            )}
            
            {ipoData.issueSize && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Issue Size</dt>
                <dd className="mt-1 text-sm text-gray-900">₹{ipoData.issueSize} Cr</dd>
              </div>
            )}
            
            {ipoData.issueType && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Issue Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{ipoData.issueType}</dd>
              </div>
            )}
            
            {ipoData.listingAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Listing At</dt>
                <dd className="mt-1 text-sm text-gray-900">{ipoData.listingAt}</dd>
              </div>
            )}
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${ipoData.status === 'listed' ? 'bg-green-100 text-green-800' : 
                   ipoData.status === 'closed' ? 'bg-blue-100 text-blue-800' : 
                   ipoData.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                   'bg-gray-100 text-gray-800'}`}
                >
                  {ipoData.status.charAt(0).toUpperCase() + ipoData.status.slice(1)}
                </span>
              </dd>
            </div>
          </dl>
        </div>
        
        {/* Subscription Status */}
        {ipoData.overallSubscription && ipoData.retailSubscription && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Subscription Status</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Overall</span>
                  <span className="font-medium text-gray-900">{ipoData.overallSubscription}x</span>
                </div>
                <div className="mt-1 overflow-hidden bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(ipoData.overallSubscription * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Retail</span>
                  <span className="font-medium text-gray-900">{ipoData.retailSubscription}x</span>
                </div>
                <div className="mt-1 overflow-hidden bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(ipoData.retailSubscription * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {ipoData.niiSubscription && (
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">NII</span>
                    <span className="font-medium text-gray-900">{ipoData.niiSubscription}x</span>
                  </div>
                  <div className="mt-1 overflow-hidden bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-purple-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(ipoData.niiSubscription * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {ipoData.qibSubscription && (
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">QIB</span>
                    <span className="font-medium text-gray-900">{ipoData.qibSubscription}x</span>
                  </div>
                  <div className="mt-1 overflow-hidden bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-yellow-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(ipoData.qibSubscription * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 