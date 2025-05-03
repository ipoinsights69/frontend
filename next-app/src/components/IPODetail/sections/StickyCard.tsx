import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StickyCardProps {
  data: IPODetailedData;
}

const StickyCard = ({ data }: StickyCardProps) => {
  // Get IPO status and dates
  const status = data.status || '';
  const isOpen = status === 'open';
  const isClosed = status === 'closed' || status === 'listed';
  const isUpcoming = status === 'upcoming';
  
  const openDate = data.openDate || '';
  const closeDate = data.closeDate || '';
  const allotmentDate = data.allotmentDate || '';
  const listingDate = data.listingDate || '';
  
  // Price information
  const minPrice = data.priceRange?.min || '';
  const maxPrice = data.priceRange?.max || '';
  const priceRange = minPrice && maxPrice && minPrice !== maxPrice 
    ? `₹${minPrice} - ₹${maxPrice}`
    : maxPrice ? `₹${maxPrice}` : '';
  
  // Basic IPO information
  const issueSize = data.issueSize ? `₹${data.issueSize} Cr` : '';
  const lotSize = data.lotSize || '';
  const minInvestment = lotSize && maxPrice 
    ? `₹${(parseInt(lotSize.toString()) * parseInt(maxPrice.toString())).toLocaleString()}`
    : '';
  const faceValue = getNestedValue(data, 'basicDetails.faceValue') || '';
  
  // Subscription data - only show if available
  const overallSubscription = data.overallSubscription || '';
  const retailSubscription = data.retailSubscription || '';
  const niiSubscription = data.niiSubscription || '';
  const qibSubscription = data.qibSubscription || '';
  
  // GMP data
  const gmpValue = data.gmp || '';
  const gmpPercent = data.gmpPercentage ? `${data.gmpPercentage > 0 ? '+' : ''}${data.gmpPercentage}%` : '';
  
  // Document URL - may not exist on all IPOs
  const drhpUrl = getNestedValue(data, 'documents.drhp') || '';
  
  // Get bidding details
  const cutOffPrice = getNestedValue(data, 'basicDetails.cutOffPrice') || 'Yes';
  const bidSize = getNestedValue(data, 'basicDetails.bidSize') || '';
  
  // Get anchor investors if available
  const anchorInvestors = getNestedValue(data, 'anchorInvestors') || [];
  const hasAnchorInvestors = Array.isArray(anchorInvestors) && anchorInvestors.length > 0;
  
  // Get allotment URL
  const allotmentUrl = getNestedValue(data, 'links.allotmentStatus') || 'https://ipo.bigshareonline.com/IPO_Status.html';
  
  // Calculate expected listing gain
  const expectedListingGain = gmpValue && maxPrice ? 
    `${(((parseInt(gmpValue.toString()) + parseInt(maxPrice.toString())) / parseInt(maxPrice.toString()) - 1) * 100).toFixed(2)}%` : '';
  
  // Calculate current IPO phase and progress
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  
  useEffect(() => {
    if (!openDate || !closeDate || !allotmentDate || !listingDate) return;
    
    const now = new Date();
    const openD = new Date(openDate);
    const closeD = new Date(closeDate);
    const allotD = new Date(allotmentDate);
    const listD = new Date(listingDate);
    
    if (now < openD) {
      setCurrentPhase('Upcoming');
      // Calculate days until open
      const total = (openD.getTime() - now.getTime()) / (1000 * 3600 * 24);
      setProgress(0);
    } else if (now >= openD && now <= closeD) {
      setCurrentPhase('Bidding');
      // Calculate progress within bidding period
      const total = (closeD.getTime() - openD.getTime());
      const current = (now.getTime() - openD.getTime());
      setProgress(Math.min(Math.round((current / total) * 100), 100));
    } else if (now > closeD && now <= allotD) {
      setCurrentPhase('Allotment');
      setProgress(50);
    } else if (now > allotD && now <= listD) {
      setCurrentPhase('Pre-Listing');
      setProgress(75);
    } else {
      setCurrentPhase('Listed');
      setProgress(100);
    }
  }, [openDate, closeDate, allotmentDate, listingDate]);

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm sticky top-4">
      {/* Status Banner */}
      <div className={`px-4 py-3 border-b border-gray-200 ${
        isOpen ? 'bg-blue-50' : isClosed ? 'bg-green-50' : isUpcoming ? 'bg-yellow-50' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isOpen ? 'bg-blue-500' : isClosed ? 'bg-green-500' : isUpcoming ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              isOpen ? 'text-blue-700' : isClosed ? 'text-green-700' : isUpcoming ? 'text-yellow-700' : 'text-gray-700'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          {priceRange && <div className="text-sm font-medium text-gray-800">{priceRange}</div>}
        </div>
        
        {/* IPO Progress Bar */}
        {openDate && closeDate && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{currentPhase}</span>
              <span>{progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  currentPhase === 'Listed' ? 'bg-green-500' : 
                  currentPhase === 'Pre-Listing' ? 'bg-blue-500' : 
                  currentPhase === 'Allotment' ? 'bg-purple-500' : 
                  currentPhase === 'Bidding' ? 'bg-blue-600' : 'bg-yellow-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Key Dates */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-center">
          {openDate && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Opens</div>
              <div className="text-sm font-medium text-gray-800">{openDate.split(',')[0]}</div>
            </div>
          )}
          
          {closeDate && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Closes</div>
              <div className="text-sm font-medium text-gray-800">{closeDate.split(',')[0]}</div>
            </div>
          )}
          
          {listingDate && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Listing</div>
              <div className="text-sm font-medium text-gray-800">{listingDate.split(',')[0]}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Issue Overview */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Issue Overview</h3>
        <div className="space-y-2">
          {issueSize && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Issue Size</span>
              <span className="text-sm font-medium text-gray-800">{issueSize}</span>
            </div>
          )}
          
          {lotSize && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Lot Size</span>
              <span className="text-sm font-medium text-gray-800">{lotSize} shares</span>
            </div>
          )}
          
          {minInvestment && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Min Investment</span>
              <span className="text-sm font-medium text-gray-800">{minInvestment}</span>
            </div>
          )}
          
          {faceValue && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Face Value</span>
              <span className="text-sm font-medium text-gray-800">₹{faceValue}</span>
            </div>
          )}
          
          {/* Bidding details */}
          {cutOffPrice && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cut-off Option</span>
              <span className="text-sm font-medium text-gray-800">{cutOffPrice}</span>
            </div>
          )}
          
          {bidSize && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Bid Size</span>
              <span className="text-sm font-medium text-gray-800">{bidSize}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Anchor Investors - only show if available */}
      {hasAnchorInvestors && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Key Anchor Investors</h3>
          <div className="space-y-2">
            {anchorInvestors.slice(0, 3).map((investor: any, index: number) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-800">{investor.name || investor}</span>
              </div>
            ))}
            {anchorInvestors.length > 3 && (
              <div className="text-xs text-gray-500 mt-1">
                +{anchorInvestors.length - 3} more investors
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Subscription Status - only show if there's data */}
      {overallSubscription && (isOpen || isClosed) && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Subscription Status</h3>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Overall</span>
              <span className="text-sm font-medium text-gray-800">{overallSubscription}x</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min(parseFloat(overallSubscription.toString()) * 25, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            {retailSubscription && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Retail</div>
                <div className="text-sm font-medium text-green-600">{retailSubscription}x</div>
              </div>
            )}
            
            {niiSubscription && (
              <div>
                <div className="text-xs text-gray-500 mb-1">NII</div>
                <div className="text-sm font-medium text-blue-600">{niiSubscription}x</div>
              </div>
            )}
            
            {qibSubscription && (
              <div>
                <div className="text-xs text-gray-500 mb-1">QIB</div>
                <div className="text-sm font-medium text-purple-600">{qibSubscription}x</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* GMP & Expected Listing Gain */}
      {(gmpValue || expectedListingGain) && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Market Sentiment</h3>
          
          {gmpValue && gmpPercent && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-xs text-gray-600">Grey Market Premium:</div>
              <div className="text-sm font-medium text-green-600">₹{gmpValue}</div>
              <div className="text-xs text-green-600">({gmpPercent})</div>
            </div>
          )}
          
          {expectedListingGain && (
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <div className="text-xs text-gray-600">Expected Listing Gain</div>
                <div className="text-sm font-medium text-green-600">{expectedListingGain}</div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="px-4 py-3">
        {/* For listed/closed IPOs, show only Check Allotment button */}
        {isClosed ? (
          <Link 
            href={`/ipo/${data.id}/allotment`}
            className="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-center font-medium rounded-md shadow-sm"
          >
            Check Allotment Status
          </Link>
        ) : (
          /* For open IPOs, show Apply Now button */
          /* For upcoming IPOs, show Get IPO Updates button instead of Set Reminder */
          <button 
            className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white shadow-sm ${
              isOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {isOpen ? 'Apply Now' : 'Get IPO Updates'}
          </button>
        )}
        
        {/* Quick links - only show DRHP for all IPOs */}
        {drhpUrl && (
          <div className="mt-3 text-center">
            <a 
              href={drhpUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Prospectus
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyCard; 