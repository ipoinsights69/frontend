import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';

interface DetailsTabProps {
  data: IPODetailedData;
}

const DetailsTab = ({ data }: DetailsTabProps) => {
  const issueSize = data.issueSize ? `₹${data.issueSize} Cr` : 'N/A';
  const issueType = data.issueType || 'IPO';
  const faceValue = getNestedValue(data, 'basicDetails.faceValue') || 'N/A';
  const issuePrice = data.priceRange?.max ? `₹${data.priceRange.max}` : 'N/A';
  const lotSize = data.lotSize || 'N/A';
  const listingAt = data.listingAt || 'N/A';
  
  // Calculate pre-issue and post-issue percentages for charts
  const preIssuePromoterPercentage = parseFloat(getNestedValue(data, 'promoterHolding.holdings.share_holding_pre_issue') || '0');
  const postIssuePromoterPercentage = parseFloat(getNestedValue(data, 'promoterHolding.holdings.share_holding_post_issue') || '0');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Basic Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">IPO Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Issue Type</div>
              <div className="text-sm font-medium text-gray-800">{issueType}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Issue Size</div>
              <div className="text-sm font-medium text-gray-800">{issueSize}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Fresh Issue</div>
              <div className="text-sm font-medium text-gray-800">{issueSize}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Face Value</div>
              <div className="text-sm font-medium text-gray-800">₹{faceValue} per share</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Issue Price</div>
              <div className="text-sm font-medium text-gray-800">{issuePrice}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Lot Size</div>
              <div className="text-sm font-medium text-gray-800">{lotSize} Shares</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Market Maker Portion</div>
              <div className="text-sm font-medium text-gray-800">{getNestedValue(data, 'reservation.allocation.2.shares_offered') || 'N/A'} shares</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Listing At</div>
              <div className="text-sm font-medium text-gray-800">{listingAt}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Share Holding Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Pre-Issue</h3>
              <div className="h-40 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-sm text-gray-500">Pre-issue shareholding chart will appear here</div>
              </div>
              <div className="mt-2 text-center text-sm text-gray-600">
                Promoters: {preIssuePromoterPercentage}%, Others: {100 - preIssuePromoterPercentage}%
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Post-Issue</h3>
              <div className="h-40 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-sm text-gray-500">Post-issue shareholding chart will appear here</div>
              </div>
              <div className="mt-2 text-center text-sm text-gray-600">
                Promoters: {postIssuePromoterPercentage}%, Public: {100 - postIssuePromoterPercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prospectus Links & Dates */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Prospectus</h2>
          <div className="space-y-2">
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-800">{data.companyName} IPO DRHP</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-800">{data.companyName} IPO RHP</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Important Dates</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Open Date</span>
              <span className="text-sm font-medium text-gray-800">{data.openDate || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Close Date</span>
              <span className="text-sm font-medium text-gray-800">{data.closeDate || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Allotment Date</span>
              <span className="text-sm font-medium text-gray-800">{data.allotmentDate || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Refund Initiation</span>
              <span className="text-sm font-medium text-gray-800">{getNestedValue(data, 'basicDetails.refundDate') || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Credit of Shares</span>
              <span className="text-sm font-medium text-gray-800">{getNestedValue(data, 'basicDetails.creditOfSharesToDemat') || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Listing Date</span>
              <span className="text-sm font-medium text-gray-800">{data.listingDate || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab; 