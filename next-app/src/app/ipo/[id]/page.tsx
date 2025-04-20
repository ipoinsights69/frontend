'use server';

import { Suspense } from 'react';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionChart from '@/components/SubscriptionChart';
import IPOTimeline from '@/components/IPOTimeline';
import FinancialsChart from '@/components/FinancialsChart';
import PricePerformanceChart from '@/components/PricePerformanceChart';
import { getIPODetailByIdSSR } from "@/lib/server/serverFetch";
import { IPODetailedData } from '@/lib/server/ipoDataService';
import IPODetailClientWrapper from './IPODetailClientWrapper';

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
export default async function IpoDetailPage({ params }: { params: { id: string } }) {
  const ipoId = params?.id as string;
  const ipo = await getIPODetailByIdSSR(ipoId);
  
  if (!ipo) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Error Loading IPO</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Could not find details for the requested IPO.</p>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Generate data for the timeline
  const timelineData = getTimelineData(ipo);
  const financialData = getFinancialData(ipo);
  const priceData = getPriceData(ipo);
  
  // Extract issue price for charts
  const issuePrice = extractIssuePrice();
  
  // These functions stay the same
  function getTimelineData(ipo: IPODetailedData | null) {
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
  }
  
  function getFinancialData(ipo: IPODetailedData | null) {
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
  }
  
  function getPriceData(ipo: IPODetailedData | null) {
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
  }
  
  function extractIssuePrice() {
    if (!ipo?.basicDetails?.issuePrice) return undefined;
    
    const priceMatch = ipo.basicDetails.issuePrice.match(/₹\s*(\d+)/);
    return priceMatch ? parseInt(priceMatch[1], 10) : undefined;
  }
  
  // Pass all the data to a client component that will handle interactivity
  return (
    <IPODetailClientWrapper 
      ipo={ipo}
      timelineData={timelineData}
      financialData={financialData}
      priceData={priceData}
      issuePrice={issuePrice}
    />
  );
}
