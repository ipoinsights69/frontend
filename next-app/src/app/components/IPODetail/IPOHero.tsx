import React from 'react';
import { formatDate, getDaysDiff } from '@/app/utils/dateUtils';
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faChartLine, faRupeeSign, faBriefcase, faBullseye, faBuilding, faFileContract, faPercentage, faChartSimple, faCheckCircle, faArrowRight, faStopwatch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Badge } from "@/app/components/ui/badge";

interface IPOHeroProps {
  ipoData: any;
}

const IPOHero: React.FC<IPOHeroProps> = ({ ipoData }) => {
  // Extract the first letter of company name for logo placeholder
  const logoPlaceholder = ipoData.company_name?.substring(0, 2) || 'IP';
  
  // Calculate listing gains
  const listingGains = ipoData.listing_gains_numeric || 0;
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
  
  const statusColor = statusColors[ipoData.status as keyof typeof statusColors] || statusColors.unknown;
  
  // Get important dates from various sources
  const basicDetails = ipoData.basicDetails || {};
  const tentativeDetails = ipoData.tentativeDetails || {};
  const importantDates = ipoData.important_dates || {};
  
  // Format dates for timeline
  const currentDate = new Date();
  const timelineDates = [
    { 
      type: 'Open Date', 
      date: ipoData.opening_date || basicDetails.ipoOpenDate || importantDates?.open_date, 
      passed: ipoData.opening_date && new Date(ipoData.opening_date) < currentDate,
      icon: 'fa-calendar-check'
    },
    { 
      type: 'Close Date', 
      date: ipoData.closing_date || basicDetails.ipoCloseDate || importantDates?.close_date,
      passed: ipoData.closing_date && new Date(ipoData.closing_date) < currentDate,
      icon: 'fa-calendar-xmark'
    },
    { 
      type: 'Allotment Date', 
      date: ipoData.allotment_date || tentativeDetails.tentative_allotment || importantDates?.allotment_date,
      passed: ipoData.allotment_date && new Date(ipoData.allotment_date) < currentDate,
      icon: 'fa-file-circle-check'
    },
    { 
      type: 'Refund Initiation', 
      date: ipoData.refund_date || tentativeDetails.initiation_of_refunds || basicDetails.initiationOfRefunds || importantDates?.refund_date,
      passed: ipoData.refund_date && new Date(ipoData.refund_date) < currentDate,
      icon: 'fa-money-bill-transfer'
    },
    { 
      type: 'Credit of Shares', 
      date: ipoData.credit_of_shares || tentativeDetails.credit_of_shares_to_demat || basicDetails.creditOfSharesToDemat || importantDates?.credit_date,
      passed: ipoData.credit_of_shares && new Date(ipoData.credit_of_shares) < currentDate,
      icon: 'fa-share-nodes'
    },
    { 
      type: 'Listing Date', 
      date: ipoData.listing_date || basicDetails.ipoListingDate || importantDates?.listing_date,
      passed: ipoData.listing_date && new Date(ipoData.listing_date) < currentDate,
      isListing: true,
      icon: 'fa-chart-line'
    }
  ].filter(item => item.date);

  // Get listing data from various sources
  const listingDayTrading = ipoData.listingDayTrading || {};
  const tradingData = listingDayTrading.data || {};
  const listingPrice = tradingData.open?.nse || tradingData.open?.bse || 
                      ipoData.listing_price || 
                      (ipoData.listing_price_numeric ? `₹${ipoData.listing_price_numeric}` : null);

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
                {ipoData.logo_url ? (
                  <img 
                    src={ipoData.logo_url} 
                    alt={`${ipoData.company_name} Logo`} 
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  logoPlaceholder
                )}
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-2xl font-semibold text-gray-800">{ipoData.company_name}</h1>
                  {statusColor && (
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor}`}>
                      {ipoData.status.charAt(0).toUpperCase() + ipoData.status.slice(1)}
                    </span>
                  )}
                </div>
                <p className="text-base text-gray-600 mt-1">{ipoData.ipoName || ipoData.ipo_name}</p>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <span className="flex items-center">
                    <i className="fas fa-building mr-1 text-gray-400"></i>
                    {ipoData.listing_at || basicDetails.listingAt || 'BSE/NSE'}
                  </span>
                  {ipoData.sector && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="flex items-center">
                        <i className="fas fa-industry mr-1 text-gray-400"></i>
                        {ipoData.sector}
                      </span>
                    </>
                  )}
                  {ipoData.listing_date && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="flex items-center">
                        <i className="fas fa-calendar mr-1 text-gray-400"></i>
                        Listed on {formatDate(ipoData.listing_date)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {ipoData.issue_price && (
                <div className="bg-white border border-gray-200 rounded-md p-4 transition-all hover:shadow-md">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <i className="fas fa-tag mr-1"></i>
                    Issue Price
                  </div>
                  <div className="text-lg font-medium text-gray-800">{ipoData.issue_price || basicDetails.issuePrice}</div>
                  {(ipoData.face_value || basicDetails.faceValue) && (
                    <div className="text-xs text-gray-600">Face Value: {ipoData.face_value || basicDetails.faceValue}</div>
                  )}
                </div>
              )}
              
              {(ipoData.status === 'listed' || listingPrice) && (
                <div className="bg-white border border-gray-200 rounded-md p-4 transition-all hover:shadow-md">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <i className="fas fa-chart-line mr-1"></i>
                    Listing Price
                  </div>
                  <div className={`text-lg font-medium ${listingGainsClass}`}>{listingPrice}</div>
                  <div className={`text-xs ${listingGainsClass} flex items-center`}>
                    <i className={`fas fa-${listingGains >= 0 ? 'caret-up' : 'caret-down'} mr-1`}></i>
                    {listingGainsText}
                  </div>
                </div>
              )}
              
              {(ipoData.overall_subscription || ipoData.subscription_details?.status?.status?.overall || 
                (ipoData.subscriptionStatus && ipoData.subscriptionStatus.overall)) && (
                <div className="bg-white border border-gray-200 rounded-md p-4 transition-all hover:shadow-md">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <i className="fas fa-users mr-1"></i>
                    Subscription
                  </div>
                  <div className="text-lg font-medium text-gray-800">
                    {ipoData.overall_subscription_numeric ? 
                      `${ipoData.overall_subscription_numeric.toFixed(2)}x` : 
                      ipoData.overall_subscription || 
                      ipoData.subscriptionStatus?.overall?.total?.subscription_times ||
                      `${ipoData.subscription_details?.status?.status?.overall?.toFixed(2)}x` || '0x'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {(ipoData.nii_subscription || ipoData.subscriptionStatus?.overall?.nii?.subscription_times || 
                      ipoData.subscription_details?.status?.status?.nii) && (
                      <span>
                        NII: {ipoData.nii_subscription || 
                            ipoData.subscriptionStatus?.overall?.nii?.subscription_times ||
                            `${ipoData.subscription_details?.status?.status?.nii?.toFixed(2)}x` || '0x'}
                      </span>
                    )}
                    {(ipoData.retail_subscription || ipoData.subscriptionStatus?.overall?.retail?.subscription_times || 
                      ipoData.subscription_details?.status?.retail) && (
                      <>
                        <span className="mx-1">|</span>
                        <span>
                          Retail: {ipoData.retail_subscription || 
                                  ipoData.subscriptionStatus?.overall?.retail?.subscription_times ||
                                  `${ipoData.subscription_details?.status?.retail?.toFixed(2)}x` || '0x'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {(ipoData.issue_size || basicDetails.issueSize) && (
                <div className="bg-white border border-gray-200 rounded-md p-4 transition-all hover:shadow-md">
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <i className="fas fa-coins mr-1"></i>
                    Issue Size
                  </div>
                  <div className="text-lg font-medium text-gray-800">{ipoData.issue_size || basicDetails.issueSize}</div>
                  {(ipoData.lot_size || basicDetails.lotSize) && (
                    <div className="text-xs text-gray-600">
                      Min. Lot: {ipoData.lot_size || basicDetails.lotSize.replace(/[^\d]/g, '')} shares
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Summary Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-md shadow-sm">
              {/* Listing Day Performance */}
              {ipoData.status === 'listed' && (ipoData.listing_performance || listingPrice) && (
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <i className="fas fa-chart-bar mr-2 text-blue-500"></i>
                    Listing Day Performance
                  </h3>
                  <div className="text-center mb-3">
                    <div className={`text-3xl font-semibold ${listingGainsClass}`}>
                      {listingGains > 0 ? '+' : ''}{listingGains.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-600">
                      Listed at {listingPrice || ipoData.listing_price} vs Issue Price {ipoData.issue_price || basicDetails.issuePrice}
                    </div>
                  </div>
                  
                  {/* Chart placeholder - could implement Chart.js here */}
                  <div className="h-28 bg-gray-50 rounded-md mb-3 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Listing day chart data</span>
                  </div>
                  
                  {(ipoData.listing_performance || listingDayTrading.data) && (
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                      <div>
                        <div className="text-gray-500 flex items-center justify-center">
                          <i className="fas fa-arrow-right-from-bracket mr-1"></i> Open
                        </div>
                        <div className={`font-medium ${listingGainsClass}`}>
                          {tradingData.open?.nse || tradingData.open?.bse || 
                           ipoData.listing_performance?.listing_price_open || 
                           listingPrice || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 flex items-center justify-center">
                          <i className="fas fa-arrow-trend-up mr-1"></i> High
                        </div>
                        <div className={`font-medium ${listingGainsClass}`}>
                          {tradingData.high?.nse || tradingData.high?.bse || 
                           ipoData.listing_performance?.day_high || 
                           ipoData.listing_performance?.listing_price_high || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 flex items-center justify-center">
                          <i className="fas fa-arrow-trend-down mr-1"></i> Low
                        </div>
                        <div className={`font-medium ${listingGainsClass}`}>
                          {tradingData.low?.nse || tradingData.low?.bse || 
                           ipoData.listing_performance?.day_low || 
                           ipoData.listing_performance?.listing_price_low || 'N/A'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Subscription Status */}
              {(ipoData.status === 'closed' || ipoData.status === 'listed') && 
               (ipoData.overall_subscription_numeric || 
                ipoData.subscription_details?.status?.status || 
                (ipoData.subscriptionStatus && ipoData.subscriptionStatus.overall)) && (
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <i className="fas fa-users mr-2 text-blue-500"></i>
                    Subscription Status
                  </h3>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600 flex items-center">
                        <i className="fas fa-layer-group mr-1"></i> Overall
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {ipoData.overall_subscription_numeric?.toFixed(2) || 
                         ipoData.subscriptionStatus?.overall?.total?.subscription_times ||
                         ipoData.subscription_details?.status?.status?.toFixed(2) || 1}x
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (ipoData.overall_subscription_numeric || 
                                              ipoData.subscriptionStatus?.overall?.total?.subscription_times ||
                                              ipoData.subscription_details?.status?.status || 1) * 10)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600 flex items-center">
                          <i className="fas fa-user mr-1"></i> Retail
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {ipoData.retail_subscription_numeric?.toFixed(2) || 
                           ipoData.subscriptionStatus?.overall?.retail?.subscription_times ||
                           ipoData.subscription_details?.status?.retail?.toFixed(2) || 1}x
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (ipoData.retail_subscription_numeric || 
                                                 ipoData.subscriptionStatus?.overall?.retail?.subscription_times ||
                                                 ipoData.subscription_details?.status?.retail || 1) * 10)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600 flex items-center">
                          <i className="fas fa-briefcase mr-1"></i> NII
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {ipoData.nii_subscription_numeric?.toFixed(2) || 
                           ipoData.subscriptionStatus?.overall?.nii?.subscription_times ||
                           ipoData.subscription_details?.status?.status?.toFixed(2) || 1}x
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-purple-600 h-1.5 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (ipoData.nii_subscription_numeric || 
                                                 ipoData.subscriptionStatus?.overall?.nii?.subscription_times ||
                                                 ipoData.subscription_details?.status?.status || 1) * 10)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {ipoData.total_applications && (
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      <i className="fas fa-file-signature mr-1"></i>
                      Total Applications: {ipoData.total_applications.toLocaleString()}
                    </div>
                  )}
                </div>
              )}
              
              {/* Key Metrics */}
              {ipoData.financials?.ratios && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <i className="fas fa-chart-pie mr-2 text-blue-500"></i>
                    Key Metrics
                  </h3>
                  <div className="space-y-2">
                    {ipoData.financials.ratios.roe && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 flex items-center">
                          <i className="fas fa-percent mr-1 text-gray-400"></i> ROE
                        </span>
                        <span className="text-xs font-medium text-gray-800">{ipoData.financials.ratios.roe.toFixed(2)}%</span>
                      </div>
                    )}
                    {ipoData.financials.ratios.roce && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 flex items-center">
                          <i className="fas fa-percent mr-1 text-gray-400"></i> ROCE
                        </span>
                        <span className="text-xs font-medium text-gray-800">{ipoData.financials.ratios.roce.toFixed(2)}%</span>
                      </div>
                    )}
                    {ipoData.financials.eps?.pe_post && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 flex items-center">
                          <i className="fas fa-calculator mr-1 text-gray-400"></i> P/E (Post IPO)
                        </span>
                        <span className="text-xs font-medium text-gray-800">{ipoData.financials.eps.pe_post.toFixed(2)}x</span>
                      </div>
                    )}
                    {ipoData.financials.eps?.post && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 flex items-center">
                          <i className="fas fa-indian-rupee-sign mr-1 text-gray-400"></i> EPS (Post IPO)
                        </span>
                        <span className="text-xs font-medium text-gray-800">₹{ipoData.financials.eps.post.toFixed(2)}</span>
                      </div>
                    )}
                    {ipoData.lot_size && ipoData.minimum_amount && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 flex items-center">
                          <i className="fas fa-layer-group mr-1 text-gray-400"></i> Lot Size
                        </span>
                        <span className="text-xs font-medium text-gray-800">
                          {ipoData.lot_size} shares (₹{ipoData.minimum_amount.toLocaleString()})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline below hero section */}
      {validDates.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-2">
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <i className="fas fa-calendar-days mr-2 text-blue-500"></i>
              IPO Journey
            </h3>
            <div className="relative">
              <div className="absolute left-0 ml-2.5 h-full w-0.5 bg-gray-200"></div>
              <div className="space-y-5">
                {validDates.map((item, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className={`h-5 w-5 rounded-full border-2 ${item.isListing && item.passed ? 'border-green-600 bg-green-600' : 'border-blue-600 bg-white'} z-10 flex items-center justify-center`}>
                      {item.isListing && item.passed ? (
                        <i className="fas fa-check text-white text-xs"></i>
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                    <div className="ml-4 flex justify-between w-full">
                      <div>
                        <div className="text-xs font-medium text-gray-700 flex items-center">
                          <i className={`fas ${item.icon} mr-1.5 text-blue-500`}></i>
                          {item.type}
                        </div>
                        <div className="text-xs text-gray-600">{formatDate(item.date)}</div>
                      </div>
                      {item.date && (
                        <div className="text-xs text-gray-500">
                          {Math.abs(getDaysDiff(item.date, currentDate))} days 
                          {getDaysDiff(item.date, currentDate) > 0 ? ' from now' : ' ago'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default IPOHero; 