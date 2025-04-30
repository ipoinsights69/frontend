import React from 'react';
import { formatDate, getDaysDiff } from '@/app/utils/dateUtils';
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faChartLine, faRupeeSign, faBriefcase, faBullseye, faBuilding, faFileContract, faPercentage, faChartSimple, faCheckCircle, faArrowRight, faStopwatch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Badge } from "@/app/components/ui/badge";
import { IPODetailedData } from '@/app/types/IPO';

interface IPOHeroProps {
  ipoData: IPODetailedData;
  formattedData?: Record<string, any>;
  config?: {
    sections: Record<string, boolean>;
    fieldsMapping: Record<string, Record<string, string>>;
    formatConfig: Record<string, any>;
  };
}

const IPOHero: React.FC<IPOHeroProps> = ({ ipoData, formattedData = {}, config }) => {
  // Use the formatted data or fallback to direct access
  const heroData = formattedData?.hero || {};
  
  // Extract the first letter of company name for logo placeholder
  const companyName = heroData.title || ipoData.companyName || '';
  const logoPlaceholder = companyName.substring(0, 2) || 'IP';
  const logoUrl = heroData.logoUrl || ipoData.logoUrl;
  
  // Get status data
  const status = heroData.status || ipoData.status || 'unknown';
  
  // Calculate listing gains
  const listingGains = ipoData.listingGainPercentage || 0;
  const listingGainsText = listingGains > 0 
    ? `+${listingGains.toFixed(2)}% gain` 
    : `${listingGains.toFixed(2)}% loss`;
  const listingGainsClass = listingGains >= 0 ? 'text-green-600' : 'text-red-600';
  
  // Determine status and color
  const statusColors = {
    upcoming: 'bg-blue-50 text-blue-600',
    open: 'bg-green-50 text-green-600',
    closed: 'bg-yellow-50 text-yellow-600',
    listed: 'bg-green-50 text-green-600',
    unknown: 'bg-gray-50 text-gray-600'
  };
  
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.unknown;
  
  // Get dates from formatted data or fallback to direct fields
  const datesData = formattedData?.dates || {};
  const openDate = datesData.openDate || ipoData.openDate;
  const closeDate = datesData.closeDate || ipoData.closeDate;
  const allotmentDate = datesData.allotmentDate || ipoData.allotmentDate;
  const refundDate = datesData.refundDate || ipoData.refundDate;
  const listingDate = datesData.listingDate || ipoData.listingDate;
  
  // Format dates for timeline
  const currentDate = new Date();
  const timelineDates = [
    { 
      type: 'Open Date', 
      date: openDate, 
      passed: openDate && new Date(openDate) < currentDate,
      icon: 'fa-calendar-check'
    },
    { 
      type: 'Close Date', 
      date: closeDate,
      passed: closeDate && new Date(closeDate) < currentDate,
      icon: 'fa-calendar-xmark'
    },
    { 
      type: 'Allotment Date', 
      date: allotmentDate,
      passed: allotmentDate && new Date(allotmentDate) < currentDate,
      icon: 'fa-file-circle-check'
    },
    { 
      type: 'Refund Initiation', 
      date: refundDate,
      passed: refundDate && new Date(refundDate) < currentDate,
      icon: 'fa-money-bill-transfer'
    },
    { 
      type: 'Listing Date', 
      date: listingDate,
      passed: listingDate && listingDate !== 'Not yet listed' && new Date(listingDate) < currentDate,
      isListing: true,
      icon: 'fa-chart-line'
    }
  ].filter(item => item.date);

  // Get pricing information
  const priceRange = heroData.priceRange || ipoData.priceRange;
  const issueType = heroData.issueType || ipoData.issueType;
  const issueSize = heroData.issueSize || ipoData.issueSize;
  const listingAt = heroData.listingAt || ipoData.listingAt;

  // Get listing price
  const listingPrice = ipoData.listingPrice ? `₹${ipoData.listingPrice}` : null;

  // Filter out dates that don't have a value
  const validDates = timelineDates.filter(date => date.date);

  // Get the status badge color based on the current status
  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-2">
          <FontAwesomeIcon icon={faStopwatch} className="h-3 w-3" />
          {status}
        </Badge>;
      case 'open':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-2">
          <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
          {status}
        </Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3" />
          {status}
        </Badge>;
      case 'listed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 flex items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} className="h-3 w-3" />
          {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get icon for the timeline item
  const getTimelineIcon = (displayName: string) => {
    const name = displayName.toLowerCase();
    if (name.includes('open')) return faCalendarCheck;
    if (name.includes('list')) return faChartLine;
    if (name.includes('close')) return faStopwatch;
    if (name.includes('allot')) return faFileContract;
    return faCalendarCheck; // Default
  };

  // Get subscription details
  const subData = formattedData?.subscription || {};
  const overallSubscription = subData.overall || ipoData.overallSubscription;
  const retailSubscription = subData.retail || ipoData.retailSubscription;
  const niiSubscription = subData.nii || ipoData.niiSubscription;

  return (
    <section className="bg-white border-b border-gray-200">
      {/* Main IPO Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {/* IPO Header with Status */}
            <div className="flex items-start mb-4">
              <div className="h-16 w-16 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-xl mr-5 flex-shrink-0">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={`${companyName} Logo`} 
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  logoPlaceholder
                )}
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-2xl font-semibold text-gray-800">{companyName}</h1>
                  {statusColor && (
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  )}
                </div>
                <p className="text-base text-gray-600 mt-1">{ipoData.symbol}</p>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <span className="flex items-center">
                    <i className="fas fa-building mr-1 text-gray-400"></i>
                    {listingAt || 'BSE/NSE'}
                  </span>
                  {ipoData.industry && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="flex items-center">
                        <i className="fas fa-industry mr-1 text-gray-400"></i>
                        {ipoData.industry}
                      </span>
                    </>
                  )}
                  {listingDate && listingDate !== 'Not yet listed' && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="flex items-center">
                        <i className="fas fa-calendar mr-1 text-gray-400"></i>
                        Listed on {formatDate(listingDate)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {priceRange && (
                <div className="bg-white border border-gray-200 rounded-md p-4 transition-all hover:shadow-md">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <FontAwesomeIcon icon={faRupeeSign} className="mr-1" />
                    Issue Price
                  </div>
                  <div className="text-lg font-medium text-gray-800">
                    ₹{priceRange.min === priceRange.max ? priceRange.min : `${priceRange.min}-${priceRange.max}`}
                  </div>
                  {issueType && (
                    <div className="text-xs text-gray-600">{issueType}</div>
                  )}
                </div>
              )}
              
              {(status === 'listed' || listingPrice) && (
                <div className="bg-white border border-gray-200 rounded-md p-4 transition-all hover:shadow-md">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                    Listing Price
                  </div>
                  <div className={`text-lg font-medium ${listingGainsClass}`}>{listingPrice}</div>
                  <div className={`text-xs ${listingGainsClass} flex items-center`}>
                    <i className={`fas fa-${listingGains >= 0 ? 'caret-up' : 'caret-down'} mr-1`}></i>
                    {listingGainsText}
                  </div>
                </div>
              )}
              
              {(overallSubscription || overallSubscription === 0) && (
                <div className="bg-white border border-gray-200 rounded-md p-4 transition-all hover:shadow-md">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <FontAwesomeIcon icon={faChartSimple} className="mr-1" />
                    Subscription
                  </div>
                  <div className="text-lg font-medium text-gray-800">
                    {typeof overallSubscription === 'number' ? `${overallSubscription.toFixed(2)}x` : overallSubscription || '0x'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {(niiSubscription || niiSubscription === 0) && (
                      <span>
                        NII: {typeof niiSubscription === 'number' ? `${niiSubscription.toFixed(2)}x` : niiSubscription || '0x'}
                      </span>
                    )}
                    {(retailSubscription || retailSubscription === 0) && (
                      <>
                        <span className="mx-1">|</span>
                        <span>
                          Retail: {typeof retailSubscription === 'number' ? `${retailSubscription.toFixed(2)}x` : retailSubscription || '0x'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {issueSize && (
                <div className="bg-white border border-gray-200 rounded-md p-4 transition-all hover:shadow-md">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <FontAwesomeIcon icon={faBriefcase} className="mr-1" />
                    Issue Size
                  </div>
                  <div className="text-lg font-medium text-gray-800">₹{issueSize} Cr</div>
                  {ipoData.lotSize && (
                    <div className="text-xs text-gray-600">Lot Size: {ipoData.lotSize} shares</div>
                  )}
                </div>
              )}
            </div>

            {/* Important Dates / Timeline */}
            {validDates.length > 0 && (
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-800 mb-3">
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-2 text-blue-600" />
                  Important Dates
                </h2>
                <div className="overflow-x-auto">
                  <div className="flex border-t border-b border-gray-200 py-3 min-w-max">
                    {validDates.map((date, index) => (
                      <div key={index} className="px-4 flex-1 flex flex-col items-center text-center">
                        <FontAwesomeIcon 
                          icon={getTimelineIcon(date.type)} 
                          className={`mb-2 h-5 w-5 ${date.passed ? 'text-green-600' : 'text-gray-400'}`} 
                        />
                        <div className="text-xs text-gray-500">{date.type}</div>
                        <div className={`text-sm mt-1 font-medium ${date.passed ? 'text-green-600' : 'text-gray-700'}`}>
                          {formatDate(date.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link 
                href={`/ipo/${ipoData.id}/allotment`} 
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Check Allotment Status
              </Link>
              
              {ipoData.prospectus_links && ipoData.prospectus_links.length > 0 && (
                <a 
                  href={ipoData.prospectus_links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faFileContract} className="mr-2" />
                  View Prospectus
                </a>
              )}
              
              <a 
                href="#subscription"
                className="bg-green-50 hover:bg-green-100 text-green-600 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faChartSimple} className="mr-2" />
                View Subscription Details
              </a>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary</h2>
              
              <div className="space-y-3">
                {issueType && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Issue Type</span>
                    <span className="font-medium text-gray-800">{issueType}</span>
                  </div>
                )}
                
                {priceRange && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Price Range</span>
                    <span className="font-medium text-gray-800">
                      ₹{priceRange.min === priceRange.max ? priceRange.min : `${priceRange.min}-${priceRange.max}`}
                    </span>
                  </div>
                )}
                
                {ipoData.lotSize && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Lot Size</span>
                    <span className="font-medium text-gray-800">{ipoData.lotSize} shares</span>
                  </div>
                )}
                
                {ipoData.lotSize && priceRange && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-medium text-gray-800">
                      ₹{(ipoData.lotSize * priceRange.min).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                
                {issueSize && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Issue Size</span>
                    <span className="font-medium text-gray-800">₹{issueSize} Cr</span>
                  </div>
                )}

                {openDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Open Date</span>
                    <span className="font-medium text-gray-800">{formatDate(openDate)}</span>
                  </div>
                )}
                
                {closeDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Close Date</span>
                    <span className="font-medium text-gray-800">{formatDate(closeDate)}</span>
                  </div>
                )}
                
                {listingDate && listingDate !== 'Not yet listed' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Listing Date</span>
                    <span className="font-medium text-gray-800">{formatDate(listingDate)}</span>
                  </div>
                )}
                
                {listingAt && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Listing At</span>
                    <span className="font-medium text-gray-800">{listingAt}</span>
                  </div>
                )}
                
                {openDate && closeDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Issue Duration</span>
                    <span className="font-medium text-gray-800">
                      {getDaysDiff(openDate, closeDate)} days
                    </span>
                  </div>
                )}
                
                {ipoData.registrarDetails && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Registrar</span>
                    <span className="font-medium text-gray-800 truncate max-w-[200px]">
                      {ipoData.registrarDetails.name}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Allotment Link Button */}
              <Link 
                href={`/ipo/${ipoData.id}/allotment`} 
                className="mt-5 block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium text-center"
              >
                Check Allotment Status <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IPOHero; 