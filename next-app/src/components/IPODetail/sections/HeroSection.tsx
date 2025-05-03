import { IPODetailedData } from '@/app/types/IPO';
import { IPO_MAPPINGS } from '@/constants/ipoMappings';
import { getNestedValue } from '@/utils/getNestedValue';

interface HeroSectionProps {
  data: IPODetailedData & Record<string, any>; // Allow any additional properties
}

const HeroSection = ({ data }: HeroSectionProps) => {
  // Log the entire raw data object to ensure we see everything
  console.log('Complete IPO data object:', data);
  
  const logo = data.logoUrl;
  const title = data.companyName || 'IPO';
  const status = data.status || 'unknown';
  
  // Get initials for the logo placeholder
  const initials = title
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Performance snapshot data
  const issuePrice = data.priceRange?.max ? `₹${data.priceRange.max}` : 
                    getNestedValue(data, 'basicDetails.issuePrice') ? 
                    getNestedValue(data, 'basicDetails.issuePrice') : 
                    getNestedValue(data, 'issue_price') ? 
                    `₹${getNestedValue(data, 'issue_price')}` : 
                    'TBA';
                    
  // Get listing price and gains from any exchange in listing_gains_by_exchange
  let listingPrice = 'TBA';
  let listingGain = null;
  
  // Try multiple paths to get listing price
  const listingGainsByExchange = getNestedValue(data, 'listing_gains_by_exchange');
  const listingDayTrading = getNestedValue(data, 'listingDayTrading.data');
  
  console.log('Listing data sources:', { 
    listingGainsByExchange, 
    listingDayTrading,
    listingGain: data.listing_gain,
    listingGains: data.listing_gains
  });
  
  if (listingGainsByExchange) {
    // Get the first exchange key (could be nse_sme or something else)
    const exchangeKey = Object.keys(listingGainsByExchange)[0];
    if (exchangeKey) {
      const exchangeData = listingGainsByExchange[exchangeKey];
      if (exchangeData) {
        if (exchangeData.lastTradePrice) {
          listingPrice = `₹${exchangeData.lastTradePrice}`;
        }
        if (exchangeData.gain !== undefined) {
          const gainValue = parseFloat(exchangeData.gain);
          listingGain = `${gainValue > 0 ? '+' : ''}${gainValue.toFixed(2)}% gain`;
        }
      }
    }
  } 
  // Try alternate location for listing price
  else if (listingDayTrading) {
    const exchangeKey = Object.keys(listingDayTrading.last_trade || {})[0];
    if (exchangeKey && listingDayTrading.last_trade) {
      const lastTradePrice = listingDayTrading.last_trade[exchangeKey];
      if (lastTradePrice) {
        listingPrice = `₹${lastTradePrice}`;
        
        // Calculate gain if we have issue price
        if (listingDayTrading.final_issue_price && listingDayTrading.final_issue_price[exchangeKey]) {
          const issueValue = parseFloat(listingDayTrading.final_issue_price[exchangeKey]);
          const listingValue = parseFloat(lastTradePrice);
          if (!isNaN(issueValue) && !isNaN(listingValue)) {
            const gainValue = ((listingValue - issueValue) / issueValue) * 100;
            listingGain = `${gainValue > 0 ? '+' : ''}${gainValue.toFixed(2)}% gain`;
          }
        }
      }
    }
  }
  
  // Try direct listing gain value
  if (getNestedValue(data, 'listing_gain') !== undefined && listingGain === null) {
    const gainValue = parseFloat(getNestedValue(data, 'listing_gain'));
    if (!isNaN(gainValue)) {
      listingGain = `${gainValue > 0 ? '+' : ''}${gainValue.toFixed(2)}% gain`;
    }
  }
  
  // Get subscription data - try multiple paths
  let subscription = 'TBA';
  let subscriptionColor = 'text-gray-800';
  
  // Try multiple paths to get subscription data
  const overallSubscription = getNestedValue(data, 'subscriptionHistory.overall_subscription.total.subscription_times');
  const totalSubscription = getNestedValue(data, 'subscription_details.status.overall');
  
  console.log('Subscription data paths:', {
    overallSubscription,
    totalSubscription,
    subscriptionHistory: data.subscriptionHistory,
    subscription_details: data.subscription_details
  });
  
  if (overallSubscription) {
    const subValue = parseFloat(overallSubscription);
    if (!isNaN(subValue)) {
      subscription = `${subValue}x`;
      subscriptionColor = subValue > 0 ? 'text-green-600' : 'text-red-600';
    }
  } else if (totalSubscription) {
    subscription = `${totalSubscription}x`;
    subscriptionColor = totalSubscription > 0 ? 'text-green-600' : 'text-red-600';
  } else if (data.overallSubscription) {
    subscription = `${data.overallSubscription}x`;
    subscriptionColor = data.overallSubscription > 0 ? 'text-green-600' : 'text-red-600';
  }
  
  const issueSize = data.issueSize ? `₹${data.issueSize} Cr` : 
                    getNestedValue(data, 'issue_amount') ? 
                    `₹${getNestedValue(data, 'issue_amount')} Cr` : 
                    'TBA';
                    
  const sharesOffered = data.sharesOffered ? `${data.sharesOffered.toLocaleString()} shares` : null;

  return (
    <>
      {/* IPO Header with Status */}
      <div className="flex items-start mb-4">
        <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-lg mr-4 flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">{title} IPO</h1>
            <span className={`ml-3 bg-${status === 'listed' ? 'green' : status === 'open' ? 'blue' : status === 'upcoming' ? 'yellow' : 'gray'}-50 text-${status === 'listed' ? 'green' : status === 'open' ? 'blue' : status === 'upcoming' ? 'yellow' : 'gray'}-600 text-xs font-medium px-2.5 py-0.5 rounded-full`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-md p-3 transition-all hover:shadow-md">
          <div className="text-xs text-gray-500">Issue Price</div>
          <div className="text-lg font-medium text-gray-800">{issuePrice}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md p-3 transition-all hover:shadow-md">
          <div className="text-xs text-gray-500">Listing Price</div>
          <div className="text-lg font-medium text-green-600">{listingPrice}</div>
          {listingGain && <div className="text-xs text-green-600">{listingGain}</div>}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md p-3 transition-all hover:shadow-md">
          <div className="text-xs text-gray-500">Subscription</div>
          <div className={`text-lg font-medium ${subscriptionColor}`}>{subscription}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md p-3 transition-all hover:shadow-md">
          <div className="text-xs text-gray-500">Issue Size</div>
          <div className="text-lg font-medium text-gray-800">{issueSize}</div>
          {sharesOffered && <div className="text-xs text-gray-600">{sharesOffered}</div>}
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">IPO Journey</h3>
        <div className="relative">
          <div className="absolute left-0 ml-2.5 h-full w-0.5 bg-gray-200"></div>
          <div className="space-y-5">
            {data.openDate && (
              <div className="relative flex items-center">
                <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                </div>
                <div className="ml-4 flex justify-between w-full">
                  <div>
                    <div className="text-xs font-medium text-gray-700">Open Date</div>
                    <div className="text-xs text-gray-600">{data.openDate}</div>
                  </div>
                  {data.openDate && <div className="text-xs text-gray-500">{getDaysAgo(data.openDate)}</div>}
                </div>
              </div>
            )}
            
            {data.closeDate && (
              <div className="relative flex items-center">
                <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                </div>
                <div className="ml-4 flex justify-between w-full">
                  <div>
                    <div className="text-xs font-medium text-gray-700">Close Date</div>
                    <div className="text-xs text-gray-600">{data.closeDate}</div>
                  </div>
                  {data.closeDate && <div className="text-xs text-gray-500">{getDaysAgo(data.closeDate)}</div>}
                </div>
              </div>
            )}
            
            {data.allotmentDate && (
              <div className="relative flex items-center">
                <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                </div>
                <div className="ml-4 flex justify-between w-full">
                  <div>
                    <div className="text-xs font-medium text-gray-700">Allotment Date</div>
                    <div className="text-xs text-gray-600">{data.allotmentDate}</div>
                  </div>
                  {data.allotmentDate && <div className="text-xs text-gray-500">{getDaysAgo(data.allotmentDate)}</div>}
                </div>
              </div>
            )}
            
            {getNestedValue(data, 'basicDetails.creditOfSharesToDemat') && (
              <div className="relative flex items-center">
                <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                </div>
                <div className="ml-4 flex justify-between w-full">
                  <div>
                    <div className="text-xs font-medium text-gray-700">Credit of Shares</div>
                    <div className="text-xs text-gray-600">{getNestedValue(data, 'basicDetails.creditOfSharesToDemat')}</div>
                  </div>
                  {getNestedValue(data, 'basicDetails.creditOfSharesToDemat') && (
                    <div className="text-xs text-gray-500">{getDaysAgo(getNestedValue(data, 'basicDetails.creditOfSharesToDemat'))}</div>
                  )}
                </div>
              </div>
            )}
            
            {data.listingDate && (
              <div className="relative flex items-center">
                <div className={`h-5 w-5 rounded-full border-2 ${status === 'listed' ? 'border-green-600 bg-green-600' : 'border-blue-600 bg-white'} z-10 flex items-center justify-center`}>
                  {status === 'listed' ? (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                  )}
                </div>
                <div className="ml-4 flex justify-between w-full">
                  <div>
                    <div className="text-xs font-medium text-gray-700">Listing Date</div>
                    <div className="text-xs text-gray-600">{data.listingDate}</div>
                  </div>
                  {data.listingDate && <div className="text-xs text-gray-500">{getDaysAgo(data.listingDate)}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to calculate days ago
const getDaysAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  } catch (e) {
    return '';
  }
};

export default HeroSection; 