'use client';

import React from 'react';
import { formatDate } from '@/app/utils/dateUtils';

interface DetailsTabProps {
  ipoData: any;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ ipoData }) => {
  // Get IPO details from various sources
  const basicDetails = ipoData.basicDetails || {};
  const tentativeDetails = ipoData.tentativeDetails || {};
  
  // Extract important dates
  const openDate = basicDetails.ipoOpenDate || ipoData.opening_date;
  const closeDate = basicDetails.ipoCloseDate || ipoData.closing_date;
  const allotmentDate = tentativeDetails.tentative_allotment;
  const refundDate = tentativeDetails.initiation_of_refunds || basicDetails.initiationOfRefunds;
  const creditDate = tentativeDetails.credit_of_shares_to_demat || basicDetails.creditOfSharesToDemat;
  const listingDate = basicDetails.ipoListingDate || ipoData.listing_date;
  
  // Extract offering details
  const issuePrice = basicDetails.issuePrice || ipoData.issue_price;
  const faceValue = basicDetails.faceValue;
  const lotSize = basicDetails.lotSize || `${ipoData.lot_size} Shares`;
  const issueSize = basicDetails.issueSize || ipoData.issue_size;
  const freshIssue = basicDetails.freshIssue;
  const offerForSale = basicDetails.offerForSale;
  const issueType = basicDetails.issueType;
  const listingAt = basicDetails.listingAt;
  
  // Additional details
  const promoterHolding = ipoData.promoterHolding || {};
  const prospectusLinks = ipoData.prospectusLinks || [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Basic Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">IPO Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {issueType && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Issue Type</div>
                <div className="text-sm font-medium text-gray-800">{issueType}</div>
              </div>
            )}
            
            {issueSize && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Issue Size</div>
                <div className="text-sm font-medium text-gray-800">{issueSize}</div>
              </div>
            )}
            
            {freshIssue && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Fresh Issue</div>
                <div className="text-sm font-medium text-gray-800">{freshIssue}</div>
              </div>
            )}
            
            {offerForSale && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Offer For Sale</div>
                <div className="text-sm font-medium text-gray-800">{offerForSale}</div>
              </div>
            )}
            
            {faceValue && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Face Value</div>
                <div className="text-sm font-medium text-gray-800">{faceValue}</div>
              </div>
            )}
            
            {issuePrice && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Issue Price</div>
                <div className="text-sm font-medium text-gray-800">{issuePrice}</div>
              </div>
            )}
            
            {lotSize && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Lot Size</div>
                <div className="text-sm font-medium text-gray-800">{lotSize}</div>
              </div>
            )}
            
            {listingAt && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Listing At</div>
                <div className="text-sm font-medium text-gray-800">{listingAt}</div>
              </div>
            )}
          </div>
        </div>

        {/* Promoter Information */}
        {promoterHolding.promoters && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Promoter Information</h2>
            
            <div className="text-sm text-gray-600 mb-3">
              {typeof promoterHolding.promoters === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: promoterHolding.promoters }} />
              ) : (
                Array.isArray(promoterHolding.promoters) ? 
                  promoterHolding.promoters.join(', ') : 
                  'Promoter information available'
              )}
            </div>
            
            {promoterHolding.holdings && (
              <div className="space-y-2">
                {promoterHolding.holdings.share_holding_pre_issue && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pre-Issue Holding</span>
                    <span className="text-sm font-medium text-gray-800">{promoterHolding.holdings.share_holding_pre_issue}</span>
                  </div>
                )}
                
                {promoterHolding.holdings.share_holding_post_issue && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Post-Issue Holding</span>
                    <span className="text-sm font-medium text-gray-800">{promoterHolding.holdings.share_holding_post_issue}</span>
                  </div>
                )}
              </div>
            )}
            
            {basicDetails.shareHoldingPreIssue && (
              <div className="space-y-2 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pre-Issue Shares</span>
                  <span className="text-sm font-medium text-gray-800">{basicDetails.shareHoldingPreIssue}</span>
                </div>
                
                {basicDetails.shareHoldingPostIssue && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Post-Issue Shares</span>
                    <span className="text-sm font-medium text-gray-800">{basicDetails.shareHoldingPostIssue}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contact Information */}
        {ipoData.contactDetails && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Contact Information</h2>
            <div className="space-y-2 text-sm">
              {ipoData.contactDetails.full_address && (
                <div className="flex">
                  <span className="text-gray-400 w-5">📍</span>
                  <span className="text-gray-600 ml-2">{ipoData.contactDetails.full_address}</span>
                </div>
              )}
              
              {ipoData.contactDetails.phone && (
                <div className="flex">
                  <span className="text-gray-400 w-5">📞</span>
                  <span className="text-gray-600 ml-2">{ipoData.contactDetails.phone}</span>
                </div>
              )}
              
              {ipoData.contactDetails.email && (
                <div className="flex">
                  <span className="text-gray-400 w-5">✉️</span>
                  <span className="text-gray-600 ml-2">{ipoData.contactDetails.email}</span>
                </div>
              )}
              
              {ipoData.contactDetails.website && (
                <div className="flex">
                  <span className="text-gray-400 w-5">🌐</span>
                  <a 
                    href={ipoData.contactDetails.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 ml-2"
                  >
                    {ipoData.contactDetails.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Prospectus Links */}
        {prospectusLinks.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Prospectus</h2>
            <div className="space-y-2">
              {prospectusLinks.map((link: any, index: number) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="text-red-500 mr-3">📄</span>
                  <span className="text-sm text-gray-800">{link.text}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Important Dates */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Important Dates</h2>
          <div className="space-y-2">
            {openDate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Open Date</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(openDate)}</span>
              </div>
            )}
            
            {closeDate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Close Date</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(closeDate)}</span>
              </div>
            )}
            
            {allotmentDate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Allotment Date</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(allotmentDate)}</span>
              </div>
            )}
            
            {refundDate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Refund Initiation</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(refundDate)}</span>
              </div>
            )}
            
            {creditDate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Credit of Shares</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(creditDate)}</span>
              </div>
            )}
            
            {listingDate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Listing Date</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(listingDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Registrar Information */}
        {ipoData.registrarDetails && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Registrar Details</h2>
            <div className="space-y-2 text-sm">
              <div className="font-medium text-gray-800">{ipoData.registrarDetails.name}</div>
              
              {ipoData.registrarDetails.phone && (
                <div className="flex">
                  <span className="text-gray-400 w-5">📞</span>
                  <span className="text-gray-600 ml-2">{ipoData.registrarDetails.phone}</span>
                </div>
              )}
              
              {ipoData.registrarDetails.email && (
                <div className="flex">
                  <span className="text-gray-400 w-5">✉️</span>
                  <span className="text-gray-600 ml-2">{ipoData.registrarDetails.email}</span>
                </div>
              )}
              
              {ipoData.registrarDetails.website && (
                <div className="flex">
                  <span className="text-gray-400 w-5">🌐</span>
                  <a 
                    href={ipoData.registrarDetails.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 ml-2"
                  >
                    {ipoData.registrarDetails.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsTab; 