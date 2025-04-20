'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionChart from '@/components/SubscriptionChart';
import IPOTimeline from '@/components/IPOTimeline';
import FinancialsChart from '@/components/FinancialsChart';
import PricePerformanceChart from '@/components/PricePerformanceChart';
import { IPODetailedData } from '@/lib/server/ipoDataService';

// Helper Components
const DetailSection = ({ 
  title, 
  children, 
  className = "",
  id = ""
}: { 
  title: string, 
  children: React.ReactNode,
  className?: string,
  id?: string
}) => (
  <div id={id} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 md:mb-8 ${className}`}>
    <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
      {title}
    </h2>
    <div className="space-y-4 text-sm md:text-base text-gray-700 dark:text-gray-300">
      {children}
    </div>
  </div>
);

// --- Helper for Key-Value Pairs with improved styling ---
const DetailItem = ({ label, value, highlight = false }: { label: string, value: React.ReactNode, highlight?: boolean }) => (
  <div className={`flex flex-col sm:flex-row border-b border-gray-100 dark:border-gray-700 pb-3 pt-1 ${highlight ? 'bg-blue-50 dark:bg-blue-900/20 p-2 rounded' : ''}`}>
    <span className="font-medium text-gray-600 dark:text-gray-400 w-full sm:w-1/3 mb-1 sm:mb-0">{label}</span>
    <span className="w-full sm:w-2/3">{value || 'N/A'}</span>
  </div>
);

// --- Status Badge Component ---
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch(status?.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
      case 'listed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800';
      case 'closed':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}>
      {status?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
};

// --- Helper function to calculate minimum investment ---
const calculateMinInvestment = (lotSize: string, issuePrice: string): string => {
  try {
    const lot = parseInt(lotSize.replace(/,/g, ''), 10);
    
    // Extract numeric price value - can handle formats like "₹900-₹950" or "₹900"
    let price = 0;
    const priceMatch = issuePrice.match(/₹\s*(\d+(?:,\d+)*)/g);
    
    if (priceMatch && priceMatch.length > 0) {
      // If price range, take the upper value
      const lastPrice = priceMatch[priceMatch.length - 1];
      price = parseInt(lastPrice.replace(/₹\s*|,/g, ''), 10);
    }
    
    const minInvestment = lot * price;
    return minInvestment.toLocaleString('en-IN');
  } catch (e) {
    return 'N/A';
  }
};

// Client component wrapper
export default function IPODetailClientWrapper({
  ipo,
  timelineData,
  financialData,
  priceData,
  issuePrice
}: {
  ipo: IPODetailedData,
  timelineData: any[],
  financialData: any[],
  priceData: any[],
  issuePrice?: number
}) {
  // State to track active section for mobile navigation
  const [activeSection, setActiveSection] = useState('overview');
  
  // --- Render Page Content ---
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      {/* Sticky desktop section navigation */}
      <div className="hidden lg:block sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto">
          <div className="flex py-3 px-4 justify-center">
            <a href="#overview" className="px-4 py-2 mx-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Overview</a>
            <a href="#timeline" className="px-4 py-2 mx-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Key Dates</a>
            {(ipo.subscriptionStatus && Object.keys(ipo.subscriptionStatus).length > 1) && (
              <a href="#subscription" className="px-4 py-2 mx-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Subscription</a>
            )}
            {ipo.status === 'listed' && (
              <a href="#performance" className="px-4 py-2 mx-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Performance</a>
            )}
            <a href="#details" className="px-4 py-2 mx-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Company</a>
            <a href="#financials" className="px-4 py-2 mx-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Financials</a>
            <a href="#contacts" className="px-4 py-2 mx-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Documents</a>
          </div>
        </div>
      </div>
      
      {/* Mobile Section Navigation */}
      <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto overflow-x-auto">
          <div className="flex whitespace-nowrap py-3 px-4">
            <button 
              onClick={() => setActiveSection('overview')}
              className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
                activeSection === 'overview' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveSection('dates')}
              className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
                activeSection === 'dates' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Key Dates
            </button>
            {(ipo.subscriptionStatus && Object.keys(ipo.subscriptionStatus).length > 1) && (
              <button 
                onClick={() => setActiveSection('subscription')}
                className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
                  activeSection === 'subscription' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Subscription
              </button>
            )}
            {ipo.status === 'listed' && (
              <button 
                onClick={() => setActiveSection('performance')}
                className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
                  activeSection === 'performance' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Performance
              </button>
            )}
            <button 
              onClick={() => setActiveSection('details')}
              className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
                activeSection === 'details' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Company
            </button>
            <button 
              onClick={() => setActiveSection('financials')}
              className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
                activeSection === 'financials' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Financials
            </button>
            <button 
              onClick={() => setActiveSection('contacts')}
              className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
                activeSection === 'contacts' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Documents
            </button>
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* --- Main Info Section --- */}
        <section className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center mb-2 text-sm">
                <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/status/listed" className="text-blue-600 dark:text-blue-400 hover:underline">IPOs</Link>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-600 dark:text-gray-400">{ipo.ipoName}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                {ipo.ipoName || ipo.basicDetails?.companyName || 'IPO'}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <StatusBadge status={ipo.status} />
                {ipo.basicDetails?.industry && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                    {ipo.basicDetails.industry}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions buttons */}
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              {ipo.status === 'open' && (
                <Link 
                  href={ipo.basicDetails?.applicationLink || '#'} 
                  target="_blank"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors duration-200">
                  Apply Now
                </Link>
              )}
              {ipo.registrarDetails?.website && (
                <Link 
                  href={ipo.registrarDetails.website} 
                  target="_blank"
                  className="px-6 py-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-center font-medium transition-colors duration-200">
                  Check Allotment
                </Link>
              )}
              {Array.isArray(ipo.prospectusLinks) && ipo.prospectusLinks.length > 0 && (
                <Link 
                  href={ipo.prospectusLinks[0]?.url || '#'} 
                  target="_blank"
                  className="px-6 py-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-center font-medium transition-colors duration-200">
                  Prospectus
                </Link>
              )}
            </div>
          </div>
          
          {/* Key metrics cards - compact, clean layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 my-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price Band</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{ipo.basicDetails?.issuePrice || 'N/A'}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Issue Size</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{ipo.basicDetails?.issueSize || 'N/A'}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lot Size</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{ipo.basicDetails?.lotSize || 'N/A'}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min. Investment</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {ipo.basicDetails?.lotSize && ipo.basicDetails?.issuePrice ? 
                  `₹${calculateMinInvestment(ipo.basicDetails.lotSize, ipo.basicDetails.issuePrice)}` : 'N/A'}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Listing At</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {Array.isArray(ipo?.basicDetails?.listingAt) 
                  ? ipo.basicDetails.listingAt.join(', ') 
                  : ipo?.basicDetails?.listingAt || 'N/A'}
              </div>
            </div>
            {ipo.status === 'listed' && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Listing Gains</div>
                <div className={`font-semibold ${
                  ipo.listingDetail?.listingGains?.includes('-') 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {ipo.listingDetail?.listingGains || 'N/A'}
                </div>
              </div>
            )}
            {ipo.basicDetails?.gmpInfo?.latest && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">GMP <span className="text-xs opacity-75">(Unofficial)</span></div>
                <div className={`font-semibold ${
                  ipo.basicDetails.gmpInfo.latest.includes('-') 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {ipo.basicDetails.gmpInfo.latest || 'N/A'}
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column - 7/12 */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            
            {/* Overview Section - visible based on activeSection on mobile */}
            <div className={`${activeSection !== 'overview' && 'hidden lg:block'}`}>
              <DetailSection title="Company Overview" id="overview">
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                  {ipo.basicDetails?.companyLogo && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                      <img 
                        src={ipo.basicDetails.companyLogo} 
                        alt={`${ipo.basicDetails?.companyName || 'Company'} logo`} 
                        className="w-full h-full object-contain p-1" 
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                      {ipo.basicDetails?.companyName || ipo.ipoName || 'Company Name'}
                    </h3>
                    {ipo.basicDetails?.companyWebsite && (
                      <a 
                        href={ipo.basicDetails.companyWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
                      >
                        {ipo.basicDetails.companyWebsite.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {ipo.basicDetails?.industry && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Industry: {ipo.basicDetails.industry}
                      </p>
                    )}
                  </div>
                </div>
                
                <p className="whitespace-pre-wrap mb-4 leading-relaxed" dangerouslySetInnerHTML={{ 
                  __html: (() => {
                    // Force TypeScript to treat this as a non-null value
                    const aboutContent = ipo.about as string | Record<string, any> | null | undefined;
                    if (!aboutContent) return 'No description available.';
                    
                    if (typeof aboutContent === 'object' && 'details' in aboutContent) {
                      return aboutContent.details as string;
                    }
                    
                    return typeof aboutContent === 'string' ? aboutContent : 'No description available.';
                  })()
                }} />
                
                {/* Rest of the component stays the same... */}
              </DetailSection>
            </div>
            
            {/* Continue with the rest of the sections */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 