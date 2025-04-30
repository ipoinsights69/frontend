'use client';

import React from 'react';
import { formatDate } from '@/app/utils/dateUtils';

interface SubscriptionTabProps {
  ipoData: any;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ ipoData }) => {
  // Get subscription data from subscriptionStatus
  const subscriptionStatus = ipoData.subscriptionStatus || {};
  const overall = subscriptionStatus.overall || {};
  
  // Parse values from flat structure or nested structure
  const retailSubscription = overall.retail?.subscription_times || 
                            ipoData.retail_subscription_numeric || 
                            ipoData.subscription_details?.status?.retail || 0;
                            
  const niiSubscription = overall.nii?.subscription_times || 
                         ipoData.nii_subscription_numeric || 
                         ipoData.subscription_details?.status?.nii || 0;
                         
  const qibSubscription = overall.qib?.subscription_times || 
                         ipoData.qib_subscription_numeric || 
                         ipoData.subscription_details?.status?.qib || 0;
                         
  const totalApplications = subscriptionStatus.total_applications || 
                           ipoData.subscription_details?.total_applications || 
                           ipoData.total_applications || 0;
  
  const totalSubscription = overall.total?.subscription_times || 
                           ipoData.overall_subscription_numeric || 
                           ipoData.subscription_details?.status?.overall || 0;

  // Format subscription values
  const formatSubscription = (value: any) => {
    if (!value) return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return `${numValue.toFixed(2)}x${numValue >= 1 ? (numValue >= 10 ? ' (Heavily Oversubscribed)' : ' (Oversubscribed)') : ''}`;
  };

  // Get reservation details if available
  const reservation = ipoData.reservation || {};
  const lotSize = ipoData.lotSize || {};

  if (!subscriptionStatus.summary && totalSubscription <= 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Subscription information not available</h3>
        <p className="text-gray-600">Subscription details for this IPO will be added soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Subscription Details */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-800">Subscription Status</h2>
            <p className="text-xs text-gray-500 mt-1">
              {subscriptionStatus.summary ? 
                `As of ${formatDate(ipoData.closing_date || 'Final Day')}` : 
                'Subscription details'}
            </p>
          </div>
          
          <div className="p-4">
            {/* Subscription Summary */}
            {subscriptionStatus.summary && (
              <div className="mb-4 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                {subscriptionStatus.summary.replace(/<\/?[^>]+(>|$)/g, "")}
              </div>
            )}
            
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Overall Subscription</span>
                <span className="text-sm font-medium text-gray-700">{formatSubscription(totalSubscription)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, parseFloat(totalSubscription) * 10)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Retail Subscription */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Retail Individual Investors</span>
                  <span className="text-sm font-medium text-gray-700">{formatSubscription(retailSubscription)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, parseFloat(retailSubscription) * 10)}%` }}
                  ></div>
                </div>
                {overall.retail?.shares_offered && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span>Shares Offered: {parseInt(overall.retail.shares_offered).toLocaleString()}</span>
                    {parseFloat(retailSubscription) > 0 && overall.retail.shares_bid_for && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Shares Bid: {parseInt(overall.retail.shares_bid_for).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* NII Subscription */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Non-Institutional Investors</span>
                  <span className="text-sm font-medium text-gray-700">{formatSubscription(niiSubscription)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, parseFloat(niiSubscription) * 10)}%` }}
                  ></div>
                </div>
                {overall.nii?.shares_offered && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span>Shares Offered: {parseInt(overall.nii.shares_offered).toLocaleString()}</span>
                    {parseFloat(niiSubscription) > 0 && overall.nii.shares_bid_for && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Shares Bid: {parseInt(overall.nii.shares_bid_for).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* QIB Subscription (if available) */}
              {(qibSubscription > 0 || overall.qib) && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Qualified Institutional Buyers</span>
                    <span className="text-sm font-medium text-gray-700">{formatSubscription(qibSubscription)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, parseFloat(qibSubscription) * 10)}%` }}
                    ></div>
                  </div>
                  {overall.qib?.shares_offered && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span>Shares Offered: {parseInt(overall.qib.shares_offered).toLocaleString()}</span>
                      {parseFloat(qibSubscription) > 0 && overall.qib.shares_bid_for && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Shares Bid: {parseInt(overall.qib.shares_bid_for).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total Applications:</span> {totalApplications ? parseInt(totalApplications).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Reservation & Lot Size */}
      <div className="space-y-6">
        {/* Share Reservation */}
        {reservation.allocation && reservation.allocation.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Share Reservation</h2>
            <div className="space-y-3">
              {reservation.allocation.map((alloc: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{alloc.investor_category}</span>
                  <span className="font-medium text-gray-800">{alloc.shares_offered}</span>
                </div>
              ))}
            </div>
            {reservation.summary && (
              <div className="mt-4 text-xs text-gray-500 italic">
                {reservation.summary.replace(/<\/?[^>]+(>|$)/g, "")}
              </div>
            )}
          </div>
        )}

        {/* Lot Size */}
        {(lotSize.applications || ipoData.lot_size) && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Lot Size</h2>
            
            {lotSize.applications && (
              <div className="space-y-3">
                {Object.entries(lotSize.applications).map(([key, value]: [string, any]) => 
                  value.application && (
                    <div key={key} className="bg-gray-50 rounded-md p-3">
                      <div className="text-sm text-gray-600 mb-2">{value.application}</div>
                      {value.lots && (
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Lots</span>
                          <span className="text-sm font-medium text-gray-800">{value.lots}</span>
                        </div>
                      )}
                      {value.shares && (
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Shares</span>
                          <span className="text-sm font-medium text-gray-800">{value.shares}</span>
                        </div>
                      )}
                      {value.amount && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount</span>
                          <span className="text-sm font-medium text-gray-800">₹{parseInt(value.amount).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
            
            {!lotSize.applications && ipoData.lot_size && (
              <div className="bg-gray-50 rounded-md p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Lot Size</span>
                  <span className="text-sm font-medium text-gray-800">{ipoData.lot_size} shares</span>
                </div>
                {ipoData.issue_price_numeric && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-sm font-medium text-gray-800">
                      ₹{(ipoData.issue_price_numeric * ipoData.lot_size).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {lotSize.summary && (
              <div className="mt-3 text-xs text-gray-500">
                {lotSize.summary.replace(/<\/?[^>]+(>|$)/g, "")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionTab; 