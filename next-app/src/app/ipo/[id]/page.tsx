'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useIPODetails } from "@/lib/hooks/useIPOData";
import { IPODetailedData } from '@/lib/server/ipoDataService';
import SubscriptionChart from '@/components/SubscriptionChart';
import IPOTimeline from '@/components/IPOTimeline';
import FinancialsChart from '@/components/FinancialsChart';
import PricePerformanceChart from '@/components/PricePerformanceChart';

// --- Helper Component for Detail Sections ---
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

// Add TypeScript interface for the various data types
// Extend the existing IPODetailedData interface
interface ExtendedIPODetailedData extends Omit<IPODetailedData, 'faqs' | 'anchorInvestors'> {
  brokerRecommendations?: BrokerRecommendation[];
  anchorInvestors?: AnchorInvestor[];
  faqs?: FAQ[];
}

// Define interfaces for data structures not fully covered in IPODetailedData
interface Strength {
  id?: string | number;
  text: string;
}

interface ObjectOfIssue {
  id?: string | number;
  text: string;
}

interface Financial {
  year: string;
  revenue: number | string;
  profit: number | string;
  assets?: number | string;
}

interface GMPHistoryItem {
  date: string;
  value: string;
}

interface BrokerRecommendation {
  brokerName: string;
  rating: string;
  summary?: string;
  date?: string;
}

interface AnchorInvestor {
  name: string;
  allocation: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// --- Main IPO Detail Page Component ---
export default function IpoDetailPage() {
  const params = useParams();
  const ipoId = params?.id as string;
  const { ipo, loading, error } = useIPODetails(ipoId);
  
  // State to track active section for mobile navigation
  const [activeSection, setActiveSection] = useState('overview');
  
  // Generate data for the timeline
  const getTimelineData = (ipo: IPODetailedData | null) => {
    if (!ipo) return [];
    
    const now = new Date();
    const timelineItems = [
      { 
        label: 'Open Date', 
        date: ipo.tentativeDetails?.openDate,
        isPast: ipo.tentativeDetails?.openDate ? new Date(ipo.tentativeDetails.openDate) < now : false
      },
      { 
        label: 'Close Date', 
        date: ipo.tentativeDetails?.closeDate,
        isPast: ipo.tentativeDetails?.closeDate ? new Date(ipo.tentativeDetails.closeDate) < now : false
      },
      { 
        label: 'Allotment Date', 
        date: ipo.tentativeDetails?.allotmentDate,
        isPast: ipo.tentativeDetails?.allotmentDate ? new Date(ipo.tentativeDetails.allotmentDate) < now : false
      },
      { 
        label: 'Refunds Initiation', 
        date: ipo.tentativeDetails?.refundsInitiation,
        isPast: ipo.tentativeDetails?.refundsInitiation ? new Date(ipo.tentativeDetails.refundsInitiation) < now : false
      },
      { 
        label: 'Shares Credit', 
        date: ipo.tentativeDetails?.sharesCredit,
        isPast: ipo.tentativeDetails?.sharesCredit ? new Date(ipo.tentativeDetails.sharesCredit) < now : false
      },
      { 
        label: 'Listing Date', 
        date: ipo.tentativeDetails?.listingDate,
        isPast: ipo.tentativeDetails?.listingDate ? new Date(ipo.tentativeDetails.listingDate) < now : false
      }
    ];
    
    return timelineItems;
  };
  
  // Mock financial data for demonstration
  // In a real implementation, this would come from the API
  const getFinancialData = (ipo: IPODetailedData | null) => {
    if (!ipo || !ipo.basicDetails?.financials) {
      // Return some mock data
      return [
        { year: 'FY21', revenue: 10500000, profit: 1800000 },
        { year: 'FY22', revenue: 13200000, profit: 2400000 },
        { year: 'FY23', revenue: 16800000, profit: 3100000 },
      ];
    }
    
    // Transform actual data if available
    return ipo.basicDetails.financials;
  };
  
  // Mock price performance data
  // In a real implementation, this would come from the API
  const getPriceData = (ipo: IPODetailedData | null) => {
    if (!ipo || ipo.status !== 'listed') return [];
    
    // Extract issue price if available
    let issuePrice = 0;
    if (ipo.basicDetails?.issuePrice) {
      const priceMatch = ipo.basicDetails.issuePrice.match(/₹\s*(\d+)/);
      if (priceMatch) {
        issuePrice = parseInt(priceMatch[1], 10);
      }
    }
    
    // Create mock data based on listing gains
    const listingGain = ipo.listingDetail?.listingGains || '+5%';
    const gainPercent = parseInt(listingGain.replace(/\+|\-|%/g, ''), 10) / 100;
    const direction = listingGain.includes('-') ? -1 : 1;
    const listingPrice = issuePrice * (1 + (direction * gainPercent));
    
    // Generate some price points 
    return [
      { date: 'Listing Day', price: listingPrice },
      { date: 'Week 1', price: listingPrice * 1.02 },
      { date: 'Week 2', price: listingPrice * 1.05 },
      { date: 'Month 1', price: listingPrice * 1.08 },
      { date: 'Month 3', price: listingPrice * 1.12 },
      { date: 'Month 6', price: listingPrice * 1.15 },
    ];
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="animate-pulse w-full max-w-4xl mx-auto">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !ipo) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Error Loading IPO</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error?.message || 'Could not find details for the requested IPO.'}</p>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get timeline data
  const timelineData = getTimelineData(ipo);
  const financialData = getFinancialData(ipo);
  const priceData = getPriceData(ipo);
  
  // Extract issue price for charts
  const extractIssuePrice = () => {
    if (!ipo?.basicDetails?.issuePrice) return undefined;
    
    const priceMatch = ipo.basicDetails.issuePrice.match(/₹\s*(\d+)/);
    return priceMatch ? parseInt(priceMatch[1], 10) : undefined;
  };
  
  const issuePrice = extractIssuePrice();
  
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
            
            {/* Action buttons for allotment check and application - conditional based on status */}
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
        
        {/* Main Content Section - 3 column layout on large screens */}
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
                  __html: (typeof ipo.about === 'object' && ipo.about !== null && 'details' in ipo.about) 
                    ? ((ipo.about as any).details as string) 
                    : (typeof ipo.about === 'string' ? ipo.about : 'No description available.')
                }} />
                
                {/* Company strengths - if available */}
                {ipo.basicDetails?.strengths && ipo.basicDetails.strengths.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Company Strengths</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {ipo.basicDetails.strengths.map((strength: string | Strength, index: number) => (
                        <li key={index}>{typeof strength === 'string' ? strength : strength.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Objects of Issue - if available */}
                {ipo.basicDetails?.objectsOfIssue && ipo.basicDetails.objectsOfIssue.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Objects of the Issue</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {ipo.basicDetails.objectsOfIssue.map((object: string | ObjectOfIssue, index: number) => (
                        <li key={index}>{typeof object === 'string' ? object : object.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </DetailSection>
            </div>
            
            {/* Key Dates Timeline - visible based on activeSection on mobile */}
            <div className={`${activeSection !== 'dates' && 'hidden lg:block'}`}>
              <DetailSection title="IPO Timeline" id="timeline">
                <IPOTimeline dates={timelineData} />
              </DetailSection>
            </div>
            
            {/* Subscription Status - conditional, visible based on activeSection on mobile */}
            {ipo.subscriptionStatus && Object.keys(ipo.subscriptionStatus).length > 1 && (
              <div className={`${activeSection !== 'subscription' && 'hidden lg:block'}`}>
                <DetailSection title="Subscription Status" id="subscription">
                  <SubscriptionChart data={ipo.subscriptionStatus} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-center border border-indigo-100 dark:border-indigo-800">
                      <div className="text-xs text-gray-500 dark:text-gray-400">QIB</div>
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{ipo.subscriptionStatus?.overall?.qib?.subscription_times || 0}x</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center border border-green-100 dark:border-green-800">
                      <div className="text-xs text-gray-500 dark:text-gray-400">NII</div>
                      <div className="font-bold text-green-600 dark:text-green-400 text-lg">{ipo.subscriptionStatus?.overall?.nii?.subscription_times || 0}x</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center border border-amber-100 dark:border-amber-800">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Retail</div>
                      <div className="font-bold text-amber-600 dark:text-amber-400 text-lg">{ipo.subscriptionStatus?.overall?.retail?.subscription_times || 0}x</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center border border-blue-100 dark:border-blue-800">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Overall</div>
                      <div className="font-bold text-blue-600 dark:text-blue-400 text-lg">{ipo.subscriptionStatus?.overall?.total?.subscription_times || 0}x</div>
                    </div>
                  </div>
                  {/* Show total applications if available - modified to handle different data structures */}
                  {ipo.subscriptionStatus?.overall?.total?.shares_bid_for && (
                    <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
                      Total Applications: <span className="font-semibold">{parseInt(ipo.subscriptionStatus.overall.total.shares_bid_for).toLocaleString()}</span>
                    </div>
                  )}
                </DetailSection>
              </div>
            )}
            
            {/* Performance Section - conditional, visible based on activeSection on mobile */}
            {ipo.status === 'listed' && (
              <div className={`${activeSection !== 'performance' && 'hidden lg:block'}`}>
                <DetailSection title="Listing Performance" id="performance">
                  <PricePerformanceChart data={priceData} issuePrice={issuePrice} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Listing Price</div>
                      <div className="font-semibold">{ipo.listingDetail?.listingPriceNSE || ipo.listingDetail?.listingPriceBSE || 'N/A'}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      ipo.listingDetail?.listingGains?.includes('-') 
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' 
                        : 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'
                    }`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Listing Gains</div>
                      <div className={`font-semibold ${
                        ipo.listingDetail?.listingGains?.includes('-') 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {ipo.listingDetail?.listingGains || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Listing Day Range</div>
                      <div className="font-semibold text-sm">
                        {ipo.listingDayTrading?.lowPrice && ipo.listingDayTrading?.highPrice ? 
                          `${ipo.listingDayTrading.lowPrice} - ${ipo.listingDayTrading.highPrice}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </DetailSection>
              </div>
            )}
            
            {/* Issue Details - visible based on activeSection on mobile */}
            <div className={`${activeSection !== 'details' && 'hidden lg:block'}`}>
              <DetailSection title="Issue Details" id="details">
                <DetailItem label="Issue Type" value={ipo.basicDetails?.issueType} />
                <DetailItem label="Price Band" value={ipo.basicDetails?.issuePrice} />
                <DetailItem label="Issue Size" value={ipo.basicDetails?.issueSize} />
                <DetailItem label="Face Value" value={ipo.basicDetails?.faceValue} />
                <DetailItem label="Lot Size" value={ipo.basicDetails?.lotSize} />
                <DetailItem label="Min. Investment" value={
                  ipo.basicDetails?.lotSize && ipo.basicDetails?.issuePrice ? 
                    `₹${calculateMinInvestment(ipo.basicDetails.lotSize, ipo.basicDetails.issuePrice)}` : 'N/A'
                } />
                <DetailItem label="Listing At" value={
                  Array.isArray(ipo?.basicDetails?.listingAt) 
                    ? ipo.basicDetails.listingAt.join(', ') 
                    : ipo?.basicDetails?.listingAt || 'N/A'
                } />
                
                {/* Promoter Holding - if available */}
                {(ipo.basicDetails?.promoterHolding?.preListing || ipo.basicDetails?.promoterHolding?.postListing) && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Promoter Holding</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center border border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pre-IPO</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{ipo.basicDetails?.promoterHolding?.preListing || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center border border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Post-IPO</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{ipo.basicDetails?.promoterHolding?.postListing || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Reservation/Quota - if available */}
                {ipo.basicDetails?.quota && Object.keys(ipo.basicDetails.quota).length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">IPO Reservation</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {Object.entries(ipo.basicDetails.quota).map((entry, index) => {
                            const [category, percentage] = entry as [string, string];
                            return (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{category}</td>
                                <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100">{percentage}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </DetailSection>
            </div>
            
            {/* Financials Section - visible based on activeSection on mobile */}
            <div className={`${activeSection !== 'financials' && 'hidden lg:block'}`}>
              <DetailSection title="Financial Performance" id="financials">
                {/* Financial Performance Chart */}
                <div className="mb-6">
                  <FinancialsChart data={financialData} />
                </div>
                
                {/* Key Financial Ratios */}
                {ipo.basicDetails?.financialRatios && Object.keys(ipo.basicDetails.financialRatios).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Key Financial Ratios</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(ipo.basicDetails.financialRatios).map((entry, index) => {
                        const [ratio, value] = entry as [string, string | number];
                        return (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{ratio}</div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">{value}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Financial Statements */}
                {ipo.basicDetails?.financials && ipo.basicDetails.financials.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Financial Statements</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assets</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {ipo.basicDetails.financials.map((financial: Financial, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{financial.year}</td>
                              <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100">
                                {typeof financial.revenue === 'number' 
                                  ? `₹${(financial.revenue / 1000000).toFixed(2)}M` 
                                  : financial.revenue || 'N/A'}
                              </td>
                              <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100">
                                {typeof financial.profit === 'number' 
                                  ? `₹${(financial.profit / 1000000).toFixed(2)}M` 
                                  : financial.profit || 'N/A'}
                              </td>
                              <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100">
                                {typeof financial.assets === 'number' 
                                  ? `₹${(financial.assets / 1000000).toFixed(2)}M` 
                                  : financial.assets || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </DetailSection>
            </div>
            
          </div>
          
          {/* Right Column - 5/12 */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            
            {/* Grey Market Premium - Conditional */}
            {ipo.basicDetails?.gmpInfo && Object.keys(ipo.basicDetails.gmpInfo).length > 0 && ipo.status !== 'listed' && (
              <DetailSection title="Grey Market Premium" className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg mb-4">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    <strong>Disclaimer:</strong> Grey Market Premium (GMP) is an unofficial value and not regulated. 
                    It is for informational purposes only and should not be the sole basis for investment decisions.
                  </p>
                </div>
                
                {/* GMP Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current GMP</div>
                    <div className={`font-bold text-xl ${
                      ipo.basicDetails.gmpInfo.latest?.includes('-') 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {ipo.basicDetails.gmpInfo.latest || 'N/A'}
                    </div>
                    {ipo.basicDetails.gmpInfo.date && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        As of {ipo.basicDetails.gmpInfo.date}
                      </div>
                    )}
                  </div>
                  
                  {ipo.basicDetails.gmpInfo.history && ipo.basicDetails.gmpInfo.history.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">GMP Trend</div>
                      <div className="space-y-2 mt-2">
                        {ipo.basicDetails.gmpInfo.history.slice(0, 3).map((item: GMPHistoryItem, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{item.date}</span>
                            <span className={
                              item.value?.includes('-') 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-green-600 dark:text-green-400'
                            }>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DetailSection>
            )}
            
            {/* Broker Recommendations - if available */}
            {(ipo as any)?.brokerRecommendations && (ipo as any).brokerRecommendations.length > 0 && (
              <DetailSection title="Broker Recommendations">
                <div className="space-y-4">
                  {(ipo as any).brokerRecommendations.map((recommendation: BrokerRecommendation, index: number) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{recommendation.brokerName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          recommendation.rating?.toLowerCase().includes('subscribe') 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800' 
                            : recommendation.rating?.toLowerCase().includes('avoid') || recommendation.rating?.toLowerCase().includes('neutral')
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                        }`}>
                          {recommendation.rating}
                        </span>
                      </div>
                      {recommendation.summary && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{recommendation.summary}</p>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {recommendation.date && <span>Published: {recommendation.date}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}
            
            {/* Anchor Investors - if available */}
            {(ipo as any)?.anchorInvestors && (ipo as any).anchorInvestors.length > 0 && (
              <DetailSection title="Anchor Investors">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Investor</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocation</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {(ipo as any).anchorInvestors.map((investor: AnchorInvestor, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                          <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{investor.name}</td>
                          <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100">{investor.allocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DetailSection>
            )}
            
            {/* FAQs Section */}
            <DetailSection title="Frequently Asked Questions">
              <div className="space-y-4">
                {(ipo as any)?.faqs && (ipo as any).faqs.length > 0 ? (
                  (ipo as any).faqs.map((faq: FAQ, index: number) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 font-medium cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <span>{faq.question}</span>
                          <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
                          {faq.answer}
                        </div>
                      </details>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 font-medium cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <span>How can I apply for this IPO?</span>
                          <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
                          You can apply for IPOs through your trading/demat account via your broker's platform. Many brokers like Zerodha, Upstox, and others offer a simple application process through their websites or mobile apps.
                        </div>
                      </details>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 font-medium cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <span>What is the minimum investment amount?</span>
                          <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
                          The minimum investment is based on the lot size. For this IPO, you need to apply for at least {ipo.basicDetails?.lotSize || 'one'} lot, which comes to approximately {
                            ipo.basicDetails?.lotSize && ipo.basicDetails?.issuePrice 
                              ? `₹${calculateMinInvestment(ipo.basicDetails.lotSize, ipo.basicDetails.issuePrice)}` 
                              : 'the price band multiplied by the lot size'}.
                        </div>
                      </details>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 font-medium cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <span>How can I check my IPO allotment status?</span>
                          <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
                          You can check the allotment status on the registrar's website ({ipo.registrarDetails?.name || 'the IPO registrar'}). Usually, you'll need your application number or PAN to check the status.
                          {ipo.registrarDetails?.website && (
                            <div className="mt-2">
                              <a 
                                href={ipo.registrarDetails.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                              >
                                Check Allotment Status
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      </details>
                    </div>
                  </>
                )}
              </div>
            </DetailSection>
            
            {/* Documents and Contacts Section - visible based on activeSection on mobile */}
            <div className={`${activeSection !== 'contacts' && 'hidden lg:block'}`}>
              <DetailSection title="Documents & Contacts" id="contacts">
                {Array.isArray(ipo.prospectusLinks) && ipo.prospectusLinks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Prospectus & Documents</h3>
                    <div className="flex flex-wrap gap-2">
                      {ipo.prospectusLinks.map((link: any, index: number) => (
                        <a 
                          href={link.url} 
                          key={index} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {link.text || link.name || `Document ${index + 1}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Lead Managers */}
                {Array.isArray(ipo.leadManagers) && ipo.leadManagers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Lead Managers</h3>
                    <ul className="space-y-2">
                      {ipo.leadManagers.map((manager: any, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{typeof manager === 'string' ? manager : manager.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Registrar Info */}
                {ipo.registrarDetails && (
                  <>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Registrar Information</h3>
                    <DetailItem label="Name" value={ipo.registrarDetails.name} />
                    {ipo.registrarDetails.website && (
                      <DetailItem 
                        label="Website" 
                        value={
                          <a 
                            href={ipo.registrarDetails.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {ipo.registrarDetails.website.replace(/^https?:\/\//, '')}
                          </a>
                        } 
                      />
                    )}
                    {ipo.registrarDetails.email && (
                      <DetailItem 
                        label="Email" 
                        value={
                          <a 
                            href={`mailto:${ipo.registrarDetails.email}`} 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {ipo.registrarDetails.email}
                          </a>
                        } 
                      />
                    )}
                    {ipo.registrarDetails.phone && (
                      <DetailItem 
                        label="Phone" 
                        value={
                          <a 
                            href={`tel:${ipo.registrarDetails.phone}`} 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {ipo.registrarDetails.phone}
                          </a>
                        } 
                      />
                    )}
                  </>
                )}
              </DetailSection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
