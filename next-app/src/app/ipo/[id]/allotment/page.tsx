import React from 'react';
import { notFound } from 'next/navigation';
import AllotmentForm from './components/AllotmentForm';
import IPOTimeline from './components/IPOTimeline';
import Link from 'next/link';
import { formatDate } from '@/app/utils/dateUtils';
import { getIPOById } from '@/lib/ipoDetailService';
import { IPO } from '@/app/types/IPO';

// Define the PageProps type for dynamic route params
interface PageProps {
  params: {
    id: string;
  };
}

// Set revalidation time to 1 hour (3600 seconds)
export const revalidate = 3600;

// Function to convert IPODetailedData to IPO
const mapToIPO = (ipoDetailedData: Record<string, any>): IPO => {
  // Debug logging
  console.log('Raw IPO Detailed Data keys:', Object.keys(ipoDetailedData));
  console.log('Company Name:', ipoDetailedData.company_name);
  console.log('IPO Name:', ipoDetailedData.ipo_name);
  console.log('Status:', ipoDetailedData.status);
  console.log('Registrar Details:', ipoDetailedData.registrarDetails);
  
  // Helper to parse numeric values from strings with currency symbols
  const parseNumericValue = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    
    // Remove all non-numeric characters except decimal points
    const numericString = value.toString().replace(/[^\d.]/g, '');
    return parseFloat(numericString) || 0;
  };
  
  // Convert dates to standard format if needed
  const formatDateForDisplay = (dateStr: string | undefined | null): string | undefined => {
    if (!dateStr) return undefined;
    
    try {
      // Handle various date formats
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      return dateStr;
    } catch (_) {
      return dateStr;
    }
  };
  
  // Get company name
  const companyName = 
    ipoDetailedData.company_name || 
    ipoDetailedData.ipo_name || 
    ipoDetailedData.basicDetails?.companyName ||
    // Convert from id format like "company_name_ipo" to "Company Name"
    ipoDetailedData.ipo_id?.replace(/_ipo$/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

  return {
    id: ipoDetailedData.ipo_id || ipoDetailedData.original_ipo_id,
    companyName: companyName,
    symbol: ipoDetailedData.symbol,
    industry: ipoDetailedData.industry,
    logoUrl: ipoDetailedData.logo_url,
    description: ipoDetailedData.about?.details || typeof ipoDetailedData.about === 'string' ? ipoDetailedData.about : undefined,
    status: ipoDetailedData.status || 'unknown',
    
    // Dates
    openDate: formatDateForDisplay(ipoDetailedData.opening_date || ipoDetailedData.basicDetails?.ipoOpenDate),
    closeDate: formatDateForDisplay(ipoDetailedData.closing_date || ipoDetailedData.basicDetails?.ipoCloseDate),
    allotmentDate: formatDateForDisplay(ipoDetailedData.allotment_date || ipoDetailedData.basicDetails?.initiationOfRefunds),
    refundDate: formatDateForDisplay(ipoDetailedData.refund_date || ipoDetailedData.basicDetails?.initiationOfRefunds),
    listingDate: formatDateForDisplay(ipoDetailedData.listing_date || ipoDetailedData.basicDetails?.ipoListingDate),
    
    // Price information
    priceRange: {
      min: ipoDetailedData.issue_price_numeric || 
           parseNumericValue(ipoDetailedData.issue_price || ipoDetailedData.basicDetails?.issuePrice),
      max: ipoDetailedData.issue_price_numeric || 
           parseNumericValue(ipoDetailedData.issue_price || ipoDetailedData.basicDetails?.issuePrice)
    },
    cutOffPrice: ipoDetailedData.issue_price_numeric || 
                 parseNumericValue(ipoDetailedData.issue_price),
    lotSize: ipoDetailedData.lot_size || parseInt((ipoDetailedData.basicDetails?.lotSize || '0').split(' ')[0]) || 0,
    issueSize: ipoDetailedData.issue_size_numeric || 
               parseNumericValue(ipoDetailedData.issue_size || ipoDetailedData.basicDetails?.issueSize),
    issueType: ipoDetailedData.issue_type || ipoDetailedData.basicDetails?.issueType,
    
    // Listing details
    listingPrice: ipoDetailedData.listing_price_numeric || 
                  parseNumericValue(ipoDetailedData.listing_price),
    listingGain: ipoDetailedData.listing_gains_numeric || 0,
    listingGainPercentage: ipoDetailedData.listing_gains_numeric || 0,
    
    // Subscription details
    overallSubscription: ipoDetailedData.overall_subscription_numeric || 0,
    retailSubscription: ipoDetailedData.retail_subscription_numeric || 0,
    qibSubscription: ipoDetailedData.qib_subscription_numeric || 0,
    niiSubscription: ipoDetailedData.nii_subscription_numeric || 0,
    
    // GMP
    gmp: 0,
    gmpPercentage: 0,
    
    // Registrar information
    registrarDetails: ipoDetailedData.registrarDetails || undefined
  };
};

export async function generateMetadata({ params }: PageProps) {
  const ipoData = await getIPOById(params.id);
  
  if (!ipoData) {
    return {
      title: 'IPO Not Found | IPO Insights',
      description: 'The requested IPO information could not be found.',
    };
  }

  return {
    title: `${ipoData.company_name} IPO Allotment Status | IPO Insights`,
    description: `Check your application status for ${ipoData.company_name} IPO. Find out if you've been allotted shares in this IPO.`,
  };
}

export default async function AllotmentPage({ params }: PageProps) {
  const ipoDetailedData = await getIPOById(params.id);
  
  if (!ipoDetailedData) {
    notFound();
  }

  console.log('IPO Detailed Data:', JSON.stringify({
    id: ipoDetailedData.ipo_id,
    company_name: ipoDetailedData.company_name,
    ipo_name: ipoDetailedData.ipo_name,
    status: ipoDetailedData.status
  }));

  // Map the detailed data to the format expected by the components
  const ipoData = mapToIPO(ipoDetailedData);
  
  console.log('Mapped IPO Data:', JSON.stringify({
    id: ipoData.id,
    companyName: ipoData.companyName,
    status: ipoData.status
  }));

  // Current date for display
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = currentDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 text-white rounded-md flex items-center justify-center mr-2">
                <i className="fas fa-chart-line text-sm"></i>
              </div>
              <span className="text-base font-medium text-gray-800">IPO<span className="text-blue-600">Insight</span></span>
            </div>
            <div className="text-sm font-medium text-gray-800">
              {formattedDate}, {formattedTime} IST
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">IPO Allotment Status Checker</h1>
              <p className="text-gray-600 max-w-2xl">Check your {ipoData.companyName || 'IPO'} application status instantly using your PAN, Application Number, or Demat Account details</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <i className="fas fa-info-circle text-blue-600"></i>
                <span>Status available up to 1 week after issue close</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IPO Timeline */}
      <IPOTimeline ipoData={ipoData} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Allotment Checker */}
          <div className="lg:col-span-2 space-y-6">
            {/* Allotment Checker Card */}
            <AllotmentForm ipoData={ipoData} />

            {/* How to Check IPO Allotment Status */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">How to Check IPO Allotment Status</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">There are multiple ways to check your IPO allotment status. Follow these simple steps based on your preferred method:</p>
                </div>

                {/* Method 1: Using PAN */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Check Using PAN Number</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-1">
                        <li>Select the IPO name from the dropdown</li>
                        <li>Enter your 10-digit PAN number (e.g., ABCDE1234F)</li>
                        <li>Click on &quot;Check Allotment Status&quot;</li>
                        <li>Your allotment status will be displayed instantly</li>
                      </ol>
                      <div className="mt-2 text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i> Using PAN will show all applications made with that PAN
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method 2: Using Application Number */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Check Using Application Number</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-1">
                        <li>Select the IPO name from the dropdown</li>
                        <li>Enter your application number from your IPO application receipt</li>
                        <li>Click on &quot;Check Allotment Status&quot;</li>
                        <li>The status of that specific application will be displayed</li>
                      </ol>
                      <div className="mt-2 text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i> Application number is provided in your IPO application confirmation
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method 3: Using DPID/Client ID */}
                <div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Check Using DPID/Client ID</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-1">
                        <li>Select the IPO name from the dropdown</li>
                        <li>Enter your Depository Participant ID (DPID)</li>
                        <li>Enter your Client ID</li>
                        <li>Click on &quot;Check Allotment Status&quot;</li>
                        <li>All applications made with that demat account will be displayed</li>
                      </ol>
                      <div className="mt-2 text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i> DPID and Client ID can be found on your demat account statement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* IPO Details Card */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">{ipoData.companyName || 'IPO'} IPO</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-lg mr-3">
                    {(ipoData.companyName || '').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{ipoData.companyName || 'Unknown Company'}</h3>
                    <p className="text-xs text-gray-500">{ipoData.industry || "Various Industries"}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Issue Price</span>
                    <span className="text-sm font-medium text-gray-800">₹{ipoData.priceRange?.max || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lot Size</span>
                    <span className="text-sm font-medium text-gray-800">{ipoData.lotSize || "N/A"} shares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Issue Size</span>
                    <span className="text-sm font-medium text-gray-800">₹{ipoData.issueSize ? `${ipoData.issueSize} Cr` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Listing Date</span>
                    <span className="text-sm font-medium text-gray-800">{ipoData.listingDate ? formatDate(ipoData.listingDate) : "TBA"}</span>
                  </div>
                  {ipoData.status === 'listed' && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Listing Price</span>
                      <span className={`text-sm font-medium ${ipoData.listingGainPercentage && ipoData.listingGainPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{ipoData.listingPrice} 
                        {ipoData.listingGainPercentage && (
                          <span> ({ipoData.listingGainPercentage > 0 ? '+' : ''}{ipoData.listingGainPercentage}%)</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href={`/ipo/${params.id}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center">
                    View Complete IPO Details
                    <i className="fas fa-chevron-right ml-1 text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Official Websites Section - Simplified UI */}
            <div className="p-4 rounded-lg border bg-white shadow-sm">
              <h2 className="text-lg font-medium text-gray-800 mb-3">
                IPO Registrar
              </h2>
              <div className="space-y-4">
                {ipoData.registrarDetails ? (
                  <div className="space-y-2">
                    <div className="font-medium text-gray-800">
                      {ipoData.registrarDetails.name}
                    </div>
                    
                    {ipoData.registrarDetails.website && (
                      <div className="text-sm">
                        <span className="text-gray-600">Website: </span>
                        <a
                          href={ipoData.registrarDetails.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {ipoData.registrarDetails.website}
                        </a>
                      </div>
                    )}
                    
                    {ipoData.registrarDetails.email && (
                      <div className="text-sm text-gray-600">
                        <span>Email: </span>
                        <span className="text-gray-800">{ipoData.registrarDetails.email}</span>
                      </div>
                    )}
                    
                    {ipoData.registrarDetails.phone && (
                      <div className="text-sm text-gray-600">
                        <span>Phone: </span>
                        <span className="text-gray-800">{ipoData.registrarDetails.phone}</span>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 pt-2 mt-2 border-t border-gray-100">
                      Visit the registrar&apos;s website to check your IPO allotment status directly.
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No registrar information available for this IPO.</p>
                )}
              </div>
            </div>

            {/* Recent IPO Allotments */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">Recent IPO Allotments</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <Link href="/allotment" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="flex items-center">
                      <div className="w-7 h-7 bg-yellow-100 rounded-md flex items-center justify-center text-yellow-600 font-semibold text-xs mr-2">
                        NE
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">NeoEdu Platform</h3>
                        <p className="text-xs text-gray-500">Apr 15, 2023</p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                  </Link>
                  
                  <Link href="/allotment" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="flex items-center">
                      <div className="w-7 h-7 bg-purple-100 rounded-md flex items-center justify-center text-purple-600 font-semibold text-xs mr-2">
                        MH
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">MediHealth Inc</h3>
                        <p className="text-xs text-gray-500">Mar 30, 2023</p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                  </Link>
                  
                  <Link href="/allotment" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="flex items-center">
                      <div className="w-7 h-7 bg-green-100 rounded-md flex items-center justify-center text-green-600 font-semibold text-xs mr-2">
                        GE
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">GreenEnergy Ltd</h3>
                        <p className="text-xs text-gray-500">Mar 25, 2023</p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                  </Link>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link href="/allotment" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center">
                    View All IPO Allotments
                    <i className="fas fa-chevron-right ml-1 text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">If you&apos;re having trouble checking your IPO allotment status, our support team is here to help.</p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                <i className="fas fa-headset mr-1.5"></i>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-blue-600 text-white rounded-md flex items-center justify-center mr-2">
                  <i className="fas fa-chart-line text-sm"></i>
                </div>
                <span className="text-base font-medium text-gray-800">IPO<span className="text-blue-600">Insight</span></span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive tracking and analysis of initial public offerings worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Upcoming IPOs</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">IPO Calendar</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Market Analysis</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/allotment" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Allotment Checker</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Lot Size Calculator</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">IPO Performance Tracker</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Subscription Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">support@ipoinsight.com</li>
                <li className="text-sm text-gray-600">+91 98765 43210</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} IPO Insight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 