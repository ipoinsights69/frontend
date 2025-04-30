'use client';

import React from 'react';
import { formatDate } from '@/app/utils/dateUtils';

interface ListingTabProps {
  ipoData: any;
}

const ListingTab: React.FC<ListingTabProps> = ({ ipoData }) => {
  // Get listing data from various sources
  const listingDayTrading = ipoData.listingDayTrading || {};
  const listingDetails = ipoData.listingDetails || {};
  const listingPerformance = ipoData.listing_performance || {};
  
  // Extract values from various locations in the data structure
  const listingDate = listingDetails.ipo_date || ipoData.listing_date;
  const issuePrice = ipoData.issue_price || listingDetails.final_issue_price;
  const issuePrice_numeric = ipoData.issue_price_numeric || 
                           parseFloat(issuePrice?.replace(/[^\d.]/g, '')) || 0;
  
  // Get listing day trading data from BSE/NSE
  const tradingData = listingDayTrading.data || {};
  
  // Determine if listing data is available
  const hasListingData = listingDayTrading.data || listingDetails.bse_script_code || 
                         listingDetails.nse_symbol || listingPerformance.listing_price;
                         
  // Get listing gains
  const listingGains = ipoData.listing_gains_numeric || 
                       (tradingData.last_trade?.nse &&
                        ((parseFloat(tradingData.last_trade.nse.replace(/[^\d.]/g, '')) / issuePrice_numeric - 1) * 100)) || 0;
  
  // Handle listing price data
  const listingPrice = tradingData.open?.nse || tradingData.open?.bse || ipoData.listing_price;
  const dayHigh = tradingData.high?.nse || tradingData.high?.bse;
  const dayLow = tradingData.low?.nse || tradingData.low?.bse;
  const closingPrice = tradingData.last_trade?.nse || tradingData.last_trade?.bse;
  
  // Determine text color based on performance
  const gainTextClass = listingGains >= 0 ? 'text-green-600' : 'text-red-600';
  const gainText = listingGains >= 0 ? `+${listingGains.toFixed(2)}%` : `${listingGains.toFixed(2)}%`;

  if (!hasListingData) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Listing information not available</h3>
        <p className="text-gray-600">
          {ipoData.status === 'upcoming' || ipoData.status === 'open' ? 
            `This IPO is not yet listed. Expected listing date: ${formatDate(listingDate || 'TBD')}` : 
            'Listing details for this IPO will be added soon.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Listing Day Performance */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-800">Listing Day Performance</h2>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(listingDate || ipoData.listing_date || 'Listing Date')}
            </p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-xs text-gray-500">Issue Price</div>
                <div className="text-lg font-medium text-gray-800">
                  {issuePrice || 'N/A'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-xs text-gray-500">Listing Price</div>
                <div className={`text-lg font-medium ${gainTextClass}`}>
                  {listingPrice || 'N/A'}
                </div>
                <div className={`text-xs ${gainTextClass}`}>{gainText}</div>
              </div>
              
              {dayHigh && (
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="text-xs text-gray-500">Day High</div>
                  <div className="text-lg font-medium text-gray-800">{dayHigh}</div>
                </div>
              )}
              
              {dayLow && (
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="text-xs text-gray-500">Day Low</div>
                  <div className="text-lg font-medium text-gray-800">{dayLow}</div>
                </div>
              )}
            </div>
            
            {closingPrice && (
              <div className="text-center mt-6">
                <div className="text-sm text-gray-600">Closing Price</div>
                <div className={`text-2xl font-semibold ${gainTextClass}`}>
                  {closingPrice}
                </div>
                <div className={`text-sm ${gainTextClass}`}>
                  {listingGains > 0 ? '+' : ''}{listingGains.toFixed(2)}% from issue price
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Listing Details */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Listing Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Listing Date</span>
              <span className="text-sm font-medium text-gray-800">
                {formatDate(listingDate || ipoData.listing_date || 'N/A')}
              </span>
            </div>
            
            {listingDetails.final_issue_price && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Final Issue Price</span>
                <span className="text-sm font-medium text-gray-800">{listingDetails.final_issue_price}</span>
              </div>
            )}
            
            {listingDetails.bse_script_code && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">BSE Script Code</span>
                <span className="text-sm font-medium text-gray-800">{listingDetails.bse_script_code}</span>
              </div>
            )}
            
            {listingDetails.nse_symbol && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">NSE Symbol</span>
                <span className="text-sm font-medium text-gray-800">{listingDetails.nse_symbol}</span>
              </div>
            )}
            
            {listingDetails.isin && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ISIN</span>
                <span className="text-sm font-medium text-gray-800">{listingDetails.isin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lead Managers */}
        {ipoData.leadManagers && ipoData.leadManagers.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Lead Managers</h2>
            <div className="space-y-3">
              {ipoData.leadManagers.map((manager: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
                    {manager.abbr || manager.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{manager.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registrar */}
        {(ipoData.registrar || ipoData.registrarDetails) && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Registrar</h2>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
                {(ipoData.registrar?.abbr || ipoData.registrarDetails?.name?.substring(0, 2) || 'RG').toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  {ipoData.registrar?.name || ipoData.registrarDetails?.name || ipoData.registrar_name}
                </h3>
                {(ipoData.registrar?.email || ipoData.registrarDetails?.email) && (
                  <p className="text-xs text-gray-600 mt-1">
                    {ipoData.registrar?.email || ipoData.registrarDetails?.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Recommendation Summary */}
        {ipoData.recommendationSummary && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Recommendation Summary</h2>
            
            {ipoData.recommendationSummary.recommendations && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-50 rounded-md p-2 text-center">
                  <div className="text-xs text-gray-500">Subscribe</div>
                  <div className="text-lg font-medium text-gray-800">
                    {ipoData.recommendationSummary.recommendations.brokersbrokers?.subscribe || 
                     ipoData.recommendationSummary.recommendations.membersmembers?.subscribe || 
                     '0'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-md p-2 text-center">
                  <div className="text-xs text-gray-500">Neutral</div>
                  <div className="text-lg font-medium text-gray-800">
                    {ipoData.recommendationSummary.recommendations.brokersbrokers?.neutral || 
                     ipoData.recommendationSummary.recommendations.membersmembers?.neutral || 
                     '0'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-md p-2 text-center">
                  <div className="text-xs text-gray-500">Avoid</div>
                  <div className="text-lg font-medium text-gray-800">
                    {ipoData.recommendationSummary.recommendations.brokersbrokers?.avoid || 
                     ipoData.recommendationSummary.recommendations.membersmembers?.avoid || 
                     '0'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingTab; 