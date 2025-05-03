import React from 'react';
import HeroSection from './components/HeroSection';
import HomeIPOShowcase from './components/HomeIPOShowcase';
import { 
  fetchTrendingIPOs, 
  fetchUpcomingIPOs, 
  fetchRecentlyListedIPOs, 
  fetchClosedIPOs, 
  fetchIPOStats
} from '@/app/api/ipos/handlers';
import { getApiUrl } from '@/config/apiConfig';

// Define interfaces for our API response types
interface IPOData {
  company_name: string;
  detail_url: string;
  opening_date?: string;
  closing_date?: string;
  listing_date?: string;
  issue_price?: string | null;
  issue_amount?: string;
  listing_at?: string;
  lead_manager?: string;
  year?: number;
  _fetched_at?: string;
  ipo_id: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
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

interface IPOCategory {
  count: number;
  limit: number;
  data: IPOData[];
}

interface HomeAPIResponse {
  year_summary: YearSummary;
  upcoming_ipos: IPOCategory;
  open_ipos: IPOCategory;
  closed_ipos: IPOCategory;
  recently_listed: IPOCategory;
  top_performers: IPOCategory;
  trending_ipos: IPOCategory;
  yearly_stats: {
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
  };
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

// Enable ISR with a revalidation period of 1 hour
export const revalidate = 3600;

async function getHomepageData() {
  // First try to fetch from our API endpoint
  try {
    // Use the external API endpoint from configuration
    const response = await fetch(getApiUrl('api/ipos/homepage'), {
      next: { revalidate },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch homepage data: ${response.status}`);
    }
    
    return await response.json() as HomeAPIResponse;
  } catch (error) {
    console.error('Error fetching from API, falling back to direct data fetchers:', error);
    
    // Fallback to direct data fetching if API fails
    const trendingIPOs = await fetchTrendingIPOs();
    const upcomingIPOs = await fetchUpcomingIPOs();
    const recentIPOs = await fetchRecentlyListedIPOs();
    const closedIPOs = await fetchClosedIPOs();
    const stats = await fetchIPOStats();
    
    return {
      trendingIPOs,
      upcomingIPOs,
      recentIPOs,
      closedIPOs,
      stats
    };
  }
}

export default async function Home() {
  // Get data for the homepage
  const data = await getHomepageData();
  
  let trendingIPOs = [], upcomingIPOs = [], recentIPOs = [], closedIPOs = [], stats;
  
  // Check if we're using the API response or the fallback data
  if ('year_summary' in data) {
    // Using new API data format
    const apiData = data as HomeAPIResponse;
    
    // Map upcoming IPOs - limit to 5
    upcomingIPOs = apiData.upcoming_ipos.data.slice(0, 5).map(ipo => ({
      id: ipo.ipo_id,
      companyName: ipo.company_name.replace(' IPO', ''),
      symbol: ipo.company_name,
      industry: ipo.listing_at,
      logoUrl: '',
      status: 'upcoming' as const,
      openDate: ipo.opening_date,
      closeDate: ipo.closing_date,
      issueSize: ipo.issue_amount ? parseFloat(ipo.issue_amount) : undefined,
      lotSize: 10, // Default lot size
      listingAt: ipo.listing_at
    }));
    
    // Map open IPOs - limit to 5
    closedIPOs = apiData.open_ipos.data.slice(0, 5).map(ipo => ({
      id: ipo.ipo_id,
      companyName: ipo.company_name.replace(' IPO', ''),
      symbol: ipo.company_name,
      industry: ipo.listing_at,
      logoUrl: '',
      status: 'open' as const,
      openDate: ipo.opening_date,
      closeDate: ipo.closing_date,
      issueSize: ipo.issue_amount ? parseFloat(ipo.issue_amount) : undefined,
      lotSize: 10, // Default lot size
      listingAt: ipo.listing_at
    }));
    
    // Map closed IPOs
    const allotmentIPOs = apiData.closed_ipos.data.slice(0, 5).map(ipo => ({
      id: ipo.ipo_id,
      companyName: ipo.company_name.replace(' IPO', ''),
      symbol: ipo.company_name,
      industry: ipo.listing_at,
      logoUrl: '',
      status: 'closed' as const,
      openDate: ipo.opening_date,
      closeDate: ipo.closing_date,
      issueSize: ipo.issue_amount ? parseFloat(ipo.issue_amount) : undefined,
      lotSize: 10, // Default lot size
      listingAt: ipo.listing_at
    }));

    // Map recently listed IPOs
    recentIPOs = apiData.recently_listed.data.slice(0, 5).map(ipo => ({
      id: ipo.ipo_id,
      companyName: ipo.company_name.replace(' IPO', ''),
      symbol: ipo.company_name,
      industry: ipo.listing_at,
      logoUrl: '',
      status: 'listed' as const,
      listingDate: ipo.listing_date,
      issueSize: ipo.issue_amount ? parseFloat(ipo.issue_amount) : undefined,
      lotSize: 10, // Default lot size
      listingAt: ipo.listing_at
    }));
    
    // Use top performers as trending IPOs
    trendingIPOs = apiData.top_performers.data.slice(0, 5).map(ipo => ({
      id: ipo.ipo_id,
      companyName: ipo.company_name.replace(' IPO', ''),
      symbol: ipo.company_name,
      industry: ipo.listing_at,
      logoUrl: '',
      status: 'listed' as const,
      listingDate: ipo.listing_date,
      issueSize: ipo.issue_amount ? parseFloat(ipo.issue_amount) : undefined,
      lotSize: 10, // Default lot size
      listingAt: ipo.listing_at
    }));
    
    if (trendingIPOs.length === 0) {
      // If no top performers, use recently listed as trending
      trendingIPOs = recentIPOs;
    }
    
    // Create stats for hero section
    stats = {
      activeCount: apiData.year_summary.total_ipos,
      averageReturn: apiData.yearly_stats.avg_listing_gain_numeric || 0,
      upcomingCount: apiData.year_summary.upcoming_ipos,
      topSector: {
        name: apiData.yearly_stats.top_sectors?.[0] || 'N/A',
        return: apiData.yearly_stats.highest_gain || 0
      },
      totalIPOs: apiData.year_summary.total_ipos,
      listedIPOs: apiData.year_summary.listed_ipos, 
      closedIPOs: apiData.year_summary.closed_ipos,
      openIPOs: apiData.year_summary.open_ipos,
      totalRaisedCrore: apiData.year_summary.total_raised_crore,
      totalRaisedFormatted: apiData.year_summary.total_raised_formatted,
      successRate: apiData.yearly_stats.success_rate,
      currentYear: apiData.yearly_stats.year
    };
  } else {
    // Using fallback data
    trendingIPOs = data.trendingIPOs || [];
    upcomingIPOs = data.upcomingIPOs || [];
    recentIPOs = data.recentIPOs || [];
    closedIPOs = data.closedIPOs || [];
    stats = data.stats || {
      activeCount: 0,
      averageReturn: 0,
      upcomingCount: 0,
      topSector: { name: 'Technology', return: 0 }
    };
  }
  
  // The top performing and losing IPOs are already in the trending and non-trending lists
  const topPerformingIPOs = trendingIPOs || [];
  // For losing IPOs, we can reverse the trending order - make sure there's an array to spread
  const topLosingIPOs = Array.isArray(trendingIPOs) && trendingIPOs.length > 0 
    ? [...trendingIPOs].sort((a, b) => {
        // Handle cases where listingGainPercentage may not exist
        const aGain = ('listingGainPercentage' in a) ? (a.listingGainPercentage || 0) : 0;
        const bGain = ('listingGainPercentage' in b) ? (b.listingGainPercentage || 0) : 0;
        return aGain - bGain;
      })
    : [];

  return (
    <main>
      <HeroSection 
        trendingIPOs={trendingIPOs.slice(0, 3)}
        upcomingIPOs={upcomingIPOs.slice(0, 3)}
        recentIPOs={recentIPOs.slice(0, 3)}
        closedIPOs={closedIPOs.slice(0, 3)}
        stats={stats}
      />
      
      <HomeIPOShowcase
        upcomingIPOs={upcomingIPOs}
        topPerformingIPOs={topPerformingIPOs}
        topLosingIPOs={topLosingIPOs}
        recentlyListedIPOs={recentIPOs}
        closedIPOs={closedIPOs}
      />
    </main>
  );
}
