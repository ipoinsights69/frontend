import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';

interface ListingTabProps {
  data: IPODetailedData;
}

const ListingTab = ({ data }: ListingTabProps) => {
  const issuePrice = Number(data.priceRange?.max) || 0;
  const listingPrice = Number(data.listingPrice) || 0;
  const listingGain = Number(data.listingGainPercentage) || 0;
  const status = data.status || '';
  
  if (status !== 'listed') {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-6 flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Listing data will be available after the IPO is listed.</p>
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
            <p className="text-xs text-gray-500 mt-1">{data.listingDate || 'Listing Date'}</p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-xs text-gray-500">Issue Price</div>
                <div className="text-lg font-medium text-gray-800">₹{issuePrice.toFixed(2)}</div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-xs text-gray-500">Listing Price</div>
                <div className="text-lg font-medium text-green-600">₹{listingPrice.toFixed(2)}</div>
                <div className="text-xs text-green-600">
                  {listingGain > 0 ? '+' : ''}{listingGain.toFixed(2)}%
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-xs text-gray-500">Day High</div>
                <div className="text-lg font-medium text-gray-800">₹{(listingPrice * 1.05).toFixed(2)}</div>
                <div className="text-xs text-green-600">+{(5).toFixed(2)}%</div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <div className="text-xs text-gray-500">Day Low</div>
                <div className="text-lg font-medium text-gray-800">₹{(listingPrice * 0.98).toFixed(2)}</div>
                <div className="text-xs text-green-600">+{(listingGain - 2).toFixed(2)}%</div>
              </div>
            </div>
            
            <div className="h-64 mb-5 flex items-center justify-center bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500">Listing day price chart will appear here</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600">Closing Price</div>
              <div className="text-2xl font-semibold text-green-600">₹{listingPrice.toFixed(2)}</div>
              <div className="text-sm text-green-600">
                {listingGain > 0 ? '+' : ''}{listingGain.toFixed(2)}% from issue price
              </div>
            </div>
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
              <span className="text-sm font-medium text-gray-800">{data.listingDate || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Exchange</span>
              <span className="text-sm font-medium text-gray-800">{data.listingAt || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Script Code</span>
              <span className="text-sm font-medium text-gray-800">{getNestedValue(data, 'listingDetails.scriptCode') || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ISIN</span>
              <span className="text-sm font-medium text-gray-800">{getNestedValue(data, 'listingDetails.isin') || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Lead Managers</h2>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
              {getNestedValue(data, 'leadManagers.0.name')?.charAt(0) || 'LM'}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">{getNestedValue(data, 'leadManagers.0.name') || 'Lead Manager Info Not Available'}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Registrar</h2>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
              {getNestedValue(data, 'registrarDetails.name')?.charAt(0) || 'R'}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">{getNestedValue(data, 'registrarDetails.name') || 'Registrar Info Not Available'}</h3>
              <p className="text-xs text-gray-600 mt-1">{getNestedValue(data, 'registrarDetails.email') || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingTab; 