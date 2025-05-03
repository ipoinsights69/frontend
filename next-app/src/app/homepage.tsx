'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DataProviders from '@/components/common/DataProviders';

// Types for IPO data
interface IPO {
  company_name: string;
  detail_url: string;
  opening_date: string;
  closing_date: string;
  listing_date: string;
  issue_price: string;
  issue_amount: string;
  listing_at: string;
  lead_manager: string;
  year: number;
  _fetched_at: string;
  ipo_id: string;
  issue_price_numeric: number | string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
}

interface IPOSection {
  count: number;
  limit: number;
  data: IPO[];
}

interface YearSummary {
  total_ipos: number;
  all_ipos: number;
  open_ipos: number;
  now_accepting: number;
  upcoming_ipos: number;
  opening_soon: number;
  listed_ipos: number;
  now_trading: number;
  closed_ipos: number;
  allotment_phase: number;
  total_raised_crore: number;
  total_raised_formatted: string;
}

interface YearlyStats {
  year: number;
  total_ipos: number;
  open_ipos: number;
  upcoming_ipos: number;
  listed_ipos: number;
  closed_ipos: number;
  total_raised_crore: number;
  avg_listing_gain: string;
  avg_listing_gain_numeric: number;
  successful_ipos: number;
  success_rate: string;
  success_rate_numeric: number;
  oversubscribed_ipos: number;
  oversubscription_rate: string;
  top_sectors: string[];
  highest_gain: null | number;
  lowest_gain: null | number;
}

interface HomePageData {
  year_summary: YearSummary;
  upcoming_ipos: IPOSection;
  open_ipos: IPOSection;
  closed_ipos: IPOSection;
  recently_listed: IPOSection;
  top_performers: IPOSection;
  trending_ipos: IPOSection;
  yearly_stats: YearlyStats;
  years: number[];
  stats: {
    total: number;
    by_status: {
      upcoming: number;
      open: number;
      closed: number;
      listed: number;
      unknown: number;
    };
    by_listing_type: Record<string, number>;
  };
  last_updated: string;
}

// Helper function to parse dates
const parseDate = (dateString: string): Date => {
  try {
    return new Date(dateString);
  } catch {
    return new Date();
  }
};

// Hero Section with Stats
const HeroSection = ({ yearSummary }: { yearSummary: YearSummary }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight">
            Track <span className="text-blue-600">IPO</span> Investments
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your comprehensive resource for IPO listings, performance analysis, and investment insights.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-6 text-center hover:-translate-y-1 transition-transform duration-200">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Total IPOs</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{yearSummary.total_ipos}</p>
            <p className="mt-1 text-sm text-gray-600">in {new Date().getFullYear()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-6 text-center hover:-translate-y-1 transition-transform duration-200">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Now Accepting</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{yearSummary.open_ipos}</p>
            <p className="mt-1 text-sm text-gray-600">open applications</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-6 text-center hover:-translate-y-1 transition-transform duration-200">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Coming Soon</p>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{yearSummary.upcoming_ipos}</p>
            <p className="mt-1 text-sm text-gray-600">upcoming IPOs</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-6 text-center hover:-translate-y-1 transition-transform duration-200">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Total Raised</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{yearSummary.total_raised_formatted}</p>
            <p className="mt-1 text-sm text-gray-600">in crores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// IPO Card Component
const IPOCard = ({ ipo }: { ipo: IPO }) => {
  // Extract company name without "IPO" suffix if present
  const displayName = ipo.company_name.replace(/\sIPO$/, '');
  
  // Format issue price for display
  const issuePrice = ipo.issue_price_numeric 
    ? (typeof ipo.issue_price_numeric === 'string'
      ? `₹${ipo.issue_price_numeric}`
      : `₹${ipo.issue_price_numeric}`)
    : ipo.issue_price;

  // Calculate days remaining for upcoming IPOs
  const getDaysRemaining = () => {
    if (ipo.status !== 'upcoming' && ipo.status !== 'open') return null;
    const today = new Date();
    const openingDate = parseDate(ipo.opening_date);
    const closingDate = parseDate(ipo.closing_date);
    
    if (ipo.status === 'upcoming') {
      const daysToOpen = Math.ceil((openingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysToOpen > 0 ? `Opens in ${daysToOpen} days` : 'Opening soon';
    } else {
      const daysToClose = Math.ceil((closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysToClose > 0 ? `Closes in ${daysToClose} days` : 'Closing today';
    }
  };

  // Define status badge style based on IPO status
  const getStatusBadge = () => {
    const badgeClasses: Record<string, string> = {
      upcoming: 'bg-indigo-100 text-indigo-800',
      open: 'bg-green-100 text-green-800',
      closed: 'bg-orange-100 text-orange-800',
      listed: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[ipo.status] || 'bg-gray-100 text-gray-800'}`}>
        {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <Link href={`/ipo/${ipo.ipo_id}`} className="block">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2 flex-1">{displayName}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-gray-500">Issue Price</p>
                <p className="font-medium text-gray-900">{issuePrice}</p>
              </div>
              <div>
                <p className="text-gray-500">Issue Size</p>
                <p className="font-medium text-gray-900">₹{ipo.issue_amount} Cr</p>
              </div>
              <div>
                <p className="text-gray-500">Listing At</p>
                <p className="font-medium text-gray-900">{ipo.listing_at}</p>
              </div>
              <div>
                <p className="text-gray-500">{ipo.status === 'listed' ? 'Listed On' : 'Closes On'}</p>
                <p className="font-medium text-gray-900">{ipo.status === 'listed' ? ipo.listing_date : ipo.closing_date}</p>
              </div>
            </div>
            
            {getDaysRemaining() && (
              <div className="mt-2 text-sm font-medium text-blue-600">
                {getDaysRemaining()}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            View Details
          </div>
        </div>
      </Link>
    </div>
  );
};

// IPO Section Component
interface IPOSectionProps {
  title: string;
  data: IPO[];
  viewAllLink?: string | null;
  description?: string | null;
  emptyMessage?: string | null;
}

const IPOSection = ({ title, data, viewAllLink = null, description = null, emptyMessage = null }: IPOSectionProps) => {
  if (!data || data.length === 0) {
    return emptyMessage ? (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    ) : null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && <p className="mt-1 text-gray-500">{description}</p>}
        </div>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((ipo) => (
          <IPOCard key={ipo.ipo_id} ipo={ipo} />
        ))}
      </div>
    </div>
  );
};

// IPO Timeline Component
const IPOTimeline = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-12">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">IPO Process Timeline</h2>
      </div>
      <div className="p-6">
        <div className="relative">
          {/* Timeline Track */}
          <div className="absolute inset-0 flex items-center">
            <div className="h-0.5 w-full bg-gray-200" />
          </div>
          
          {/* Timeline Steps */}
          <div className="relative flex justify-between">
            {[
              { label: 'Announcement', icon: '📢' },
              { label: 'Bidding Period', icon: '📝' },
              { label: 'Allotment', icon: '✅' },
              { label: 'Refund', icon: '💰' },
              { label: 'Demat Credit', icon: '💳' },
              { label: 'Listing', icon: '📈' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white border-2 border-blue-600 z-10">
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900">{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 bg-blue-50 p-4 rounded-md">
          <p>Track IPOs through each stage of the process, from announcement to listing. Get alerts and check your allotment status on our platform.</p>
        </div>
      </div>
    </div>
  );
};

// Homepage Component
const HomePage = () => {
  // This would normally come from an API call
  const ipoData: HomePageData = {
    year_summary: {
      total_ipos: 73,
      all_ipos: 73,
      open_ipos: 2,
      now_accepting: 2,
      upcoming_ipos: 2,
      opening_soon: 2,
      listed_ipos: 66,
      now_trading: 66,
      closed_ipos: 3,
      allotment_phase: 3,
      total_raised_crore: 22955,
      total_raised_formatted: "₹22,955"
    },
    upcoming_ipos: {
      count: 2,
      limit: 10,
      data: [
        {
          company_name: "Manoj Jewellers Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/manoj-jewellers-ipo/2146/",
          opening_date: "May 05, 2025",
          closing_date: "May 07, 2025",
          listing_date: "Not yet listed",
          issue_price: "54",
          issue_amount: "16.20",
          listing_at: "BSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/421/\" title=\"Jawa Capital Services Private Limited Lead Manager Review\">Jawa Capital</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.708Z",
          ipo_id: "2025_manoj_jewellers_limited_ipo",
          issue_price_numeric: 54,
          status: "upcoming"
        },
        {
          company_name: "Srigee DLM Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/srigee-dlm-ipo/2374/",
          opening_date: "May 05, 2025",
          closing_date: "May 07, 2025",
          listing_date: "Not yet listed",
          issue_price: "94-99",
          issue_amount: "16.98",
          listing_at: "BSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/182/\" title=\"GYR Capital Advisors Private Limited Lead Manager Review\">GYR Capital Advisors</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.709Z",
          ipo_id: "2025_srigee_dlm_limited_ipo",
          issue_price_numeric: "94-99",
          status: "upcoming"
        }
      ]
    },
    open_ipos: {
      count: 2,
      limit: 10,
      data: [
        {
          company_name: "Wagons Learning Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/wagons-learning-ipo/2391/",
          opening_date: "May 02, 2025",
          closing_date: "May 06, 2025",
          listing_date: "Not yet listed",
          issue_price: "78-82",
          issue_amount: "38.38",
          listing_at: "BSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/53/\" title=\"Khandwala Securities Limited Lead Manager Review\">Khandwala Securities</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.709Z",
          ipo_id: "2025_wagons_learning_limited_ipo",
          issue_price_numeric: "78-82",
          status: "open"
        },
        {
          company_name: "Kenrik Industries Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/kenrik-industries-ipo/2382/",
          opening_date: "Apr 29, 2025",
          closing_date: "May 06, 2025",
          listing_date: "Not yet listed",
          issue_price: "25",
          issue_amount: "8.75",
          listing_at: "BSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/157/\" title=\"Turnaround Corporate Advisors Private Limited Lead Manager Review\">Turnaround Corporate</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.709Z",
          ipo_id: "2025_kenrik_industries_limited_ipo",
          issue_price_numeric: 25,
          status: "open"
        }
      ]
    },
    closed_ipos: {
      count: 3,
      limit: 10,
      data: [
        {
          company_name: "Arunaya Organics Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/arunaya-organics-ipo/2419/",
          opening_date: "Apr 29, 2025",
          closing_date: "May 02, 2025",
          listing_date: "Not yet listed",
          issue_price: "55-58",
          issue_amount: "33.99",
          listing_at: "NSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/176/\" title=\"Unistone Capital Pvt Ltd Lead Manager Review\">Unistone Capital</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.709Z",
          ipo_id: "2025_arunaya_organics_limited_ipo",
          issue_price_numeric: "55-58",
          status: "closed"
        },
        {
          company_name: "Ather Energy Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/ather-energy-ipo/2357/",
          opening_date: "Apr 28, 2025",
          closing_date: "Apr 30, 2025",
          listing_date: "Not yet listed",
          issue_price: "304-321",
          issue_amount: "2981.06",
          listing_at: "BSE, NSE",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/113/\" title=\"Axis Capital Limited Lead Manager Review\">Axis Capital</a><br><a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/18/\" title=\"Jm Financial Limited Lead Manager Review\">Jm Financial</a><br><a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/69/\" title=\"Hsbc Securities & Capital Markets Pvt Ltd Lead Manager Review\">Hsbc Securities</a><br><a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/72/\" title=\"Nomura Financial Advisory And Securities (India) Pvt Ltd Lead Manager Review\">Nomura</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.709Z",
          ipo_id: "2025_ather_energy_limited_ipo",
          issue_price_numeric: "304-321",
          status: "closed"
        },
        {
          company_name: "Iware Supplychain Services Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/iware-supplychain-services-ipo/2170/",
          opening_date: "Apr 28, 2025",
          closing_date: "Apr 30, 2025",
          listing_date: "Not yet listed",
          issue_price: "95",
          issue_amount: "27.13",
          listing_at: "NSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/451/\" title=\"GetFive Advisors Private Limited Lead Manager Review\">GetFive Advisors</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.709Z",
          ipo_id: "2025_iware_supplychain_services_limited_ipo",
          issue_price_numeric: 95,
          status: "closed"
        }
      ]
    },
    recently_listed: {
      count: 66,
      limit: 10,
      data: [
        {
          company_name: "Tankup Engineers Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/tankup-engineers-ipo/2398/",
          opening_date: "Apr 23, 2025",
          closing_date: "Apr 25, 2025",
          listing_date: "Apr 30, 2025",
          issue_price: "140",
          issue_amount: "19.53",
          listing_at: "NSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/76/\" title=\"Hem Securities Limited Lead Manager Review\">Hem Securities</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.709Z",
          ipo_id: "2025_tankup_engineers_limited_ipo",
          issue_price_numeric: 140,
          status: "listed"
        },
        {
          company_name: "Infonative Solutions Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/infonative-solutions-ipo/2223/",
          opening_date: "Mar 28, 2025",
          closing_date: "Apr 03, 2025",
          listing_date: "Apr 08, 2025",
          issue_price: "79.00",
          issue_amount: "24.71",
          listing_at: "BSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/162/\" title=\"Share India Capital Services Private Limited Lead Manager Review\">Share India Capital Services</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.710Z",
          ipo_id: "2025_infonative_solutions_limited_ipo",
          issue_price_numeric: 79,
          status: "listed"
        },
        {
          company_name: "Spinaroo Commercial Limited IPO",
          detail_url: "https://www.chittorgarh.com/ipo/spinaroo-commercial-ipo/2201/",
          opening_date: "Mar 28, 2025",
          closing_date: "Apr 03, 2025",
          listing_date: "Apr 08, 2025",
          issue_price: "51.00",
          issue_amount: "10.17",
          listing_at: "BSE SME",
          lead_manager: "<a href=\"https://www.chittorgarh.com/report/ipo-lead-manager-review/112/147/\" title=\"Finshore Management Services Limited Lead Manager Review\">Finshore</a>",
          year: 2025,
          _fetched_at: "2025-04-30T16:46:48.710Z",
          ipo_id: "2025_spinaroo_commercial_limited_ipo",
          issue_price_numeric: 51,
          status: "listed"
        }
      ]
    },
    top_performers: {
      count: 0,
      limit: 10,
      data: []
    },
    trending_ipos: {
      count: 0,
      limit: 10,
      data: []
    },
    yearly_stats: {
      year: 2025,
      total_ipos: 73,
      open_ipos: 2,
      upcoming_ipos: 2,
      listed_ipos: 66,
      closed_ipos: 3,
      total_raised_crore: 22955,
      avg_listing_gain: "0.00%",
      avg_listing_gain_numeric: 0,
      successful_ipos: 0,
      success_rate: "0.00%",
      success_rate_numeric: 0,
      oversubscribed_ipos: 0,
      oversubscription_rate: "0.00%",
      top_sectors: [],
      highest_gain: null,
      lowest_gain: null
    },
    years: [2025],
    stats: {
      total: 10,
      by_status: {
        upcoming: 2,
        open: 2,
        closed: 3,
        listed: 3,
        unknown: 0
      },
      by_listing_type: {
        "BSE SME": 6,
        "NSE SME": 3,
        "BSE, NSE": 1
      }
    },
    last_updated: "2025-05-03T21:09:12.678Z"
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection yearSummary={ipoData.year_summary} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* IPO Status Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {[
            { label: 'All IPOs', count: ipoData.year_summary.all_ipos, href: '/ipos', color: 'bg-gray-500' },
            { label: 'Open IPOs', count: ipoData.year_summary.open_ipos, href: '/ipos/open', color: 'bg-green-500' },
            { label: 'Upcoming', count: ipoData.year_summary.upcoming_ipos, href: '/ipos/upcoming', color: 'bg-indigo-500' },
            { label: 'Closed', count: ipoData.year_summary.closed_ipos, href: '/ipos/closed', color: 'bg-orange-500' },
            { label: 'Listed', count: ipoData.year_summary.listed_ipos, href: '/ipos/listed', color: 'bg-blue-500' },
          ].map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <span className={`w-3 h-3 rounded-full ${item.color} mr-2`}></span>
              <span className="font-medium text-gray-900">{item.label}</span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-sm font-medium text-gray-800">{item.count}</span>
            </Link>
          ))}
        </div>
        
        {/* Data Source Information */}
        <DataProviders />
        
        {/* Open IPOs Section */}
        <IPOSection 
          title="Open IPOs"
          description="Currently accepting applications. Apply now before they close."
          data={ipoData.open_ipos.data}
          viewAllLink="/ipos/open"
          emptyMessage="No IPOs are currently open for subscription. Check back soon!"
        />
        
        {/* Upcoming IPOs Section */}
        <IPOSection 
          title="Upcoming IPOs"
          description="IPOs opening soon. Mark your calendar and get ready to invest."
          data={ipoData.upcoming_ipos.data}
          viewAllLink="/ipos/upcoming"
          emptyMessage="No upcoming IPOs at the moment. Check back later for new listings."
        />
        
        {/* Closed IPOs (Allotment Phase) */}
        <IPOSection 
          title="IPOs in Allotment Phase"
          description="IPOs that have closed for subscription and are now in the allotment process."
          data={ipoData.closed_ipos.data}
          viewAllLink="/ipos/closed"
          emptyMessage="No IPOs currently in the allotment phase."
        />
        
        {/* Recently Listed IPOs */}
        <IPOSection 
          title="Recently Listed IPOs"
          description="Latest IPOs that have been listed on the stock exchange."
          data={ipoData.recently_listed.data.slice(0, 6)}
          viewAllLink="/ipos/listed"
          emptyMessage="No recently listed IPOs."
        />
        
        {/* IPO Process Timeline */}
        <IPOTimeline />
        
        {/* Yearly Statistics */}
        <div className="mt-12 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">IPO Market Performance ({ipoData.yearly_stats.year})</h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total IPOs</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{ipoData.yearly_stats.total_ipos}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Raised</dt>
                <dd className="mt-1 text-2xl font-semibold text-green-600">₹{ipoData.yearly_stats.total_raised_crore.toLocaleString()} Cr</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Avg. Listing Gain</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{ipoData.yearly_stats.avg_listing_gain}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Success Rate</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{ipoData.yearly_stats.success_rate}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Newsletter Subscription */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900">Stay Updated with IPO Alerts</h2>
            <p className="mt-3 text-gray-600">Get notified about upcoming IPOs, allotment results, and listing information directly in your inbox.</p>
            
            <div className="mt-6">
              <form className="flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-1 max-w-md"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Subscribe Now
                </button>
              </form>
              <p className="mt-3 text-xs text-gray-500">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage; 