import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';

interface SubscriptionTabProps {
  data: IPODetailedData;
}

const SubscriptionTab = ({ data }: SubscriptionTabProps) => {
  const overallSubscription = Number(data.overallSubscription) || 0;
  const retailSubscription = Number(data.retailSubscription) || 0;
  const niiSubscription = Number(data.niiSubscription) || 0;
  const qibSubscription = Number(data.qibSubscription) || 0;
  const dayWiseData = getNestedValue(data, 'subscription_details.day_wise') || [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Subscription Details */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-800">Subscription Status</h2>
            <p className="text-xs text-gray-500 mt-1">As of {data.closeDate || 'Closing Date'} (Final Day)</p>
          </div>
          
          <div className="p-4">
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Overall Subscription</span>
                <span className="text-sm font-medium text-gray-700">{overallSubscription.toFixed(2)}x</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, overallSubscription * 25)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Retail Individual Investors</span>
                  <span className="text-sm font-medium text-gray-700">{retailSubscription.toFixed(2)}x</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, retailSubscription * 25)}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>Shares Offered: {getNestedValue(data, 'reservation.allocation.0.shares_offered') || 'N/A'}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Non-Institutional Investors</span>
                  <span className="text-sm font-medium text-gray-700">{niiSubscription.toFixed(2)}x</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, niiSubscription * 25)}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>Shares Offered: {getNestedValue(data, 'reservation.allocation.1.shares_offered') || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 h-64 flex items-center justify-center bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Subscription chart will appear here</div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total Applications:</span> {data.totalApplications || 'N/A'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              *Market Maker portion is not included in the calculation.
            </div>
          </div>
        </div>
      </div>

      {/* Reservation & Lot Size */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Share Reservation</h2>
          <div className="h-40 mb-3 flex items-center justify-center bg-gray-50 rounded-md">
            <div className="text-sm text-gray-500">Reservation chart will appear here</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Retail</span>
              <span className="font-medium text-gray-800">{getNestedValue(data, 'reservation.allocation.0.shares_offered') || 'N/A'} (47.49%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Non-Institutional</span>
              <span className="font-medium text-gray-800">{getNestedValue(data, 'reservation.allocation.1.shares_offered') || 'N/A'} (47.49%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Market Maker</span>
              <span className="font-medium text-gray-800">{getNestedValue(data, 'reservation.allocation.2.shares_offered') || 'N/A'} (5.02%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Lot Size</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-2">Retail (Min-Max)</div>
              <div className="bg-gray-50 rounded-md p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Lot Size</span>
                  <span className="text-sm font-medium text-gray-800">1 lot</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Shares</span>
                  <span className="text-sm font-medium text-gray-800">{data.lotSize || 'N/A'} shares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-medium text-gray-800">
                    ₹{((data.priceRange?.max || 0) * (data.lotSize || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab; 