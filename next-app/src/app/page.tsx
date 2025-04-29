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

// Define interfaces for our API response types
interface ApiIPO {
  ipo_id: string;
  company_name: string;
  ipo_name: string;
  category: string;
  logo_url: string;
  opening_date?: string;
  closing_date?: string;
  listing_date?: string;
  issue_price?: string;
  issue_price_numeric?: number;
  price_band?: string;
  expected_price_band?: string;
  listing_price?: string;
  listing_gain?: number;
  listing_gains?: string;
  listing_gains_numeric?: number;
  listing_gains_by_exchange?: {
    nse?: {
      issuePrice?: number;
      lastTradePrice?: number;
      gain?: number;
    };
    bse?: {
      issuePrice?: number;
      lastTradePrice?: number;
      gain?: number;
    };
    nse_sme?: {
      issuePrice?: number;
      lastTradePrice?: number;
      gain?: number;
    };
    bse_sme?: {
      issuePrice?: number;
      lastTradePrice?: number;
      gain?: number;
    };
  };
}

interface YearSummary {
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
  oversubscribed_ipos: number;
  top_sectors: any[];
  highest_gain: any;
  lowest_gain: any;
}

// Enable ISR with a revalidation period of 1 hour
export const revalidate = 3600;

async function getHomepageData() {
  // First try to fetch from our API endpoint
  try {
    // Use relative URL for compatibility with deployment environments
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const response = await fetch(`${baseUrl}/api/ipos/homepage`, {
      next: { revalidate },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch homepage data: ${response.status}`);
    }
    
    return await response.json();
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

// Helper function to get the listing price from different exchange objects
function getListingPrice(ipo: ApiIPO): number | undefined {
  if (ipo.listing_price) {
    return parseFloat(ipo.listing_price);
  }
  
  const exchanges = ipo.listing_gains_by_exchange || {};
  return exchanges.nse?.lastTradePrice || 
         exchanges.bse?.lastTradePrice || 
         exchanges.nse_sme?.lastTradePrice || 
         exchanges.bse_sme?.lastTradePrice;
}

export default async function Home() {
  // Get data for the homepage
  const data = await getHomepageData();
  
  let trendingIPOs, upcomingIPOs, recentIPOs, closedIPOs, stats;
  
  // Check if we're using the API response or the fallback data
  if (data.current_ipos !== undefined) {
    // Using API data - limit to max 5 items per section
    
    // Process trending/top performing IPOs (all_time)
    trendingIPOs = (data.top_listing_gains?.all_time || []).slice(0, 5).map((ipo: ApiIPO) => {
      const listingPrice = getListingPrice(ipo);
      
      // Get the issue price - either from numeric value or parse from string
      let issuePrice = ipo.issue_price_numeric;
      if (!issuePrice && ipo.issue_price) {
        const priceMatch = ipo.issue_price.match(/₹(\d+(?:\.\d+)?)/);
        if (priceMatch) {
          issuePrice = parseFloat(priceMatch[1]);
        }
      }
      
      return {
        id: ipo.ipo_id,
        companyName: ipo.company_name.replace(' IPO', ''), // Remove duplicate "IPO" if present
        symbol: ipo.ipo_name,
        industry: ipo.category || 'Other',
        logoUrl: ipo.logo_url || '',
        status: 'listed',
        listingDate: ipo.listing_date,
        priceRange: {
          min: issuePrice || 0,
          max: issuePrice || 0
        },
        listingPrice: listingPrice || 0,
        listingGainPercentage: ipo.listing_gain || 0
      };
    });
    
    // Process upcoming IPOs
    upcomingIPOs = (data.upcoming_ipos || []).slice(0, 5).map((ipo: ApiIPO) => {
      // Extract min and max from price band if available
      let min = 0, max = 0;
      if (ipo.expected_price_band && ipo.expected_price_band !== "To be announced") {
        if (ipo.expected_price_band.includes(' to ')) {
          // Format: "₹X to ₹Y per share"
          const matches = ipo.expected_price_band.match(/₹(\d+)(?:\s+to\s+₹(\d+))/);
          if (matches) {
            min = parseInt(matches[1], 10) || 0;
            max = parseInt(matches[2], 10) || min;
          }
        } else if (ipo.expected_price_band.includes('-')) {
          // Format: "₹X-₹Y"
          const matches = ipo.expected_price_band.match(/₹(\d+)-₹(\d+)/);
          if (matches) {
            min = parseInt(matches[1], 10) || 0;
            max = parseInt(matches[2], 10) || min;
          }
        } else {
          // Format: "₹X per share" or just "₹X"
          const priceMatch = ipo.expected_price_band.match(/₹(\d+)/);
          if (priceMatch) {
            min = max = parseInt(priceMatch[1], 10) || 0;
          }
        }
      }
      
      // If we couldn't parse the expected_price_band but have issue_price_numeric, use that
      if (min === 0 && max === 0 && ipo.issue_price_numeric) {
        min = max = ipo.issue_price_numeric;
      }
      
      return {
        id: ipo.ipo_id,
        companyName: ipo.company_name.replace(' IPO', ''),
        symbol: ipo.ipo_name,
        industry: ipo.category || 'Other',
        logoUrl: ipo.logo_url || '',
        status: 'upcoming',
        openDate: ipo.opening_date,
        closeDate: ipo.closing_date,
        priceRange: { min, max }
      };
    });
    
    // Process recently listed IPOs
    recentIPOs = (data.recent_ipos || []).slice(0, 5).map((ipo: ApiIPO) => {
      const listingPrice = getListingPrice(ipo);
      
      // Get the issue price - either from numeric value or parse from string
      let issuePrice = ipo.issue_price_numeric;
      if (!issuePrice && ipo.issue_price) {
        const priceMatch = ipo.issue_price.match(/₹(\d+(?:\.\d+)?)/);
        if (priceMatch) {
          issuePrice = parseFloat(priceMatch[1]);
        }
      }
      
      return {
        id: ipo.ipo_id,
        companyName: ipo.company_name.replace(' IPO', ''),
        symbol: ipo.ipo_name,
        industry: ipo.category || 'Other',
        logoUrl: ipo.logo_url || '',
        status: 'listed',
        listingDate: ipo.listing_date,
        priceRange: {
          min: issuePrice || 0,
          max: issuePrice || 0
        },
        listingPrice: listingPrice || 0,
        listingGainPercentage: ipo.listing_gain || 0
      };
    });
    
    // Process current/open IPOs
    closedIPOs = (data.current_ipos || []).slice(0, 5).map((ipo: ApiIPO) => {
      // Extract min and max from price band
      let min = 0, max = 0;
      if (ipo.price_band) {
        if (ipo.price_band.includes(' to ')) {
          // Format: "₹X to ₹Y per share"
          const matches = ipo.price_band.match(/₹(\d+)(?:\s+to\s+₹(\d+))/);
          if (matches) {
            min = parseInt(matches[1], 10) || 0;
            max = parseInt(matches[2], 10) || min;
          }
        } else if (ipo.price_band.includes('-')) {
          // Format: "₹X-₹Y"
          const matches = ipo.price_band.match(/₹(\d+)-₹(\d+)/);
          if (matches) {
            min = parseInt(matches[1], 10) || 0;
            max = parseInt(matches[2], 10) || min;
          }
        } else if (ipo.price_band.includes('per share')) {
          // Format: "₹X per share"
          const priceMatch = ipo.price_band.match(/₹(\d+)/);
          if (priceMatch) {
            min = max = parseInt(priceMatch[1], 10) || 0;
          }
        }
      }
      
      // If we couldn't parse the price band but have issue_price_numeric, use that
      if (min === 0 && max === 0 && ipo.issue_price_numeric) {
        min = max = ipo.issue_price_numeric;
      }
      
      return {
        id: ipo.ipo_id,
        companyName: ipo.company_name.replace(' IPO', ''),
        symbol: ipo.ipo_name,
        industry: ipo.category || 'Other',
        logoUrl: ipo.logo_url || '',
        status: 'closed',
        openDate: ipo.opening_date,
        closeDate: ipo.closing_date,
        priceRange: { min, max }
      };
    });
    
    // Get year summary data
    const yearSummary: YearSummary = data.current_year_summary || {
      year: new Date().getFullYear(),
      total_ipos: 0,
      open_ipos: 0,
      upcoming_ipos: 0,
      listed_ipos: 0,
      closed_ipos: 0,
      total_raised_crore: 0,
      avg_listing_gain: "0.00%",
      avg_listing_gain_numeric: 0,
      successful_ipos: 0,
      success_rate: "0.00%",
      oversubscribed_ipos: 0,
      top_sectors: [],
      highest_gain: null,
      lowest_gain: null
    };
    
    // Make sure year summary data is available for debugging
    console.log('Year Summary:', yearSummary);
    
    // Process stats with data from current_year_summary as priority
    stats = {
      // Direct mapping from current_year_summary
      totalIPOs: yearSummary.total_ipos,
      activeCount: yearSummary.open_ipos,
      upcomingCount: yearSummary.upcoming_ipos,
      listedIPOs: yearSummary.listed_ipos,
      closedIPOs: yearSummary.closed_ipos,
      totalRaisedCrore: yearSummary.total_raised_crore,
      
      // Other stats
      averageReturn: yearSummary.avg_listing_gain_numeric || data.hero_section?.market_performance?.average_listing_gain || 0,
      successRate: yearSummary.success_rate || "0.00%",
      currentYear: yearSummary.year || new Date().getFullYear(),
      
      // Top sector
      topSector: {
        name: (yearSummary.top_sectors && yearSummary.top_sectors.length > 0) 
              ? yearSummary.top_sectors[0]?.name || 'Technology' 
              : data.top_listing_gains?.all_time?.[0]?.category || 'Technology',
        return: (yearSummary.top_sectors && yearSummary.top_sectors.length > 0) 
                ? yearSummary.top_sectors[0]?.return || 0 
                : data.top_listing_gains?.all_time?.[0]?.listing_gain || 0
      },
    };
  } else {
    // Using fallback data
    trendingIPOs = data.trendingIPOs?.slice(0, 5) || [];
    upcomingIPOs = data.upcomingIPOs?.slice(0, 5) || [];
    recentIPOs = data.recentIPOs?.slice(0, 5) || [];
    closedIPOs = data.closedIPOs?.slice(0, 5) || [];
    stats = data.stats || {
      activeCount: 0,
      averageReturn: 0,
      upcomingCount: 0,
      topSector: { name: 'Technology', return: 0 },
      totalIPOs: 0,
      listedIPOs: 0,
      closedIPOs: 0,
      totalRaisedCrore: 0,
      successRate: "0.00%",
      currentYear: new Date().getFullYear()
    };
  }
  
  // The top performing and losing IPOs are already in the trending and non-trending lists
  const topPerformingIPOs = trendingIPOs || [];
  // For losing IPOs, we can reverse the trending order
  const topLosingIPOs = [...(trendingIPOs || [])].sort((a, b) => 
    (a.listingGainPercentage || 0) - (b.listingGainPercentage || 0)
  );

  return (
    <main>
      <HeroSection 
        trendingIPOs={trendingIPOs || []}
        upcomingIPOs={upcomingIPOs || []}
        recentIPOs={recentIPOs || []}
        closedIPOs={closedIPOs || []}
        stats={stats}
      />
      
      <HomeIPOShowcase
        upcomingIPOs={upcomingIPOs || []}
        topPerformingIPOs={topPerformingIPOs}
        topLosingIPOs={topLosingIPOs}
        recentlyListedIPOs={recentIPOs || []}
        closedIPOs={closedIPOs || []}
      />
    </main>
  );
}
