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
  issue_price_numeric?: number;
  price_band?: string;
  listing_gain?: number;
  listing_gains_by_exchange?: {
    nse?: {
      lastTradePrice: number;
    };
    bse?: {
      lastTradePrice: number;
    };
  };
}

// Enable ISR with a revalidation period of 1 hour
export const revalidate = 3600;

async function getHomepageData() {
  // First try to fetch from our API endpoint
  try {
    // Use the external API endpoint
    const response = await fetch(`http://localhost:8000/api/ipos/homepage`, {
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

export default async function Home() {
  // Get data for the homepage
  const data = await getHomepageData();
  
  let trendingIPOs = [], upcomingIPOs = [], recentIPOs = [], closedIPOs = [], stats;
  
  // Check if we're using the API response or the fallback data
  if (data.current_ipos !== undefined) {
    // Using API data
    if (data.top_listing_gains?.all_time) {
      trendingIPOs = data.top_listing_gains.all_time.map((ipo: ApiIPO) => ({
        id: ipo.ipo_id,
        companyName: ipo.company_name,
        symbol: ipo.ipo_name,
        industry: ipo.category,
        logoUrl: ipo.logo_url,
        status: 'listed',
        listingDate: ipo.listing_date,
        priceRange: {
          min: ipo.issue_price_numeric,
          max: ipo.issue_price_numeric
        },
        listingPrice: ipo.listing_gains_by_exchange?.nse?.lastTradePrice,
        listingGainPercentage: ipo.listing_gain
      })) || [];
    }
    
    if (data.upcoming_ipos) {
      upcomingIPOs = data.upcoming_ipos.map((ipo: ApiIPO) => ({
        id: ipo.ipo_id,
        companyName: ipo.company_name,
        symbol: ipo.ipo_name,
        industry: ipo.category,
        logoUrl: ipo.logo_url,
        status: 'upcoming',
        openDate: ipo.opening_date,
        closeDate: ipo.closing_date
      })) || [];
    }
    
    if (data.recent_ipos) {
      recentIPOs = data.recent_ipos.map((ipo: ApiIPO) => ({
        id: ipo.ipo_id,
        companyName: ipo.company_name,
        symbol: ipo.ipo_name,
        industry: ipo.category,
        logoUrl: ipo.logo_url,
        status: 'listed',
        listingDate: ipo.listing_date,
        priceRange: {
          min: ipo.issue_price_numeric,
          max: ipo.issue_price_numeric
        },
        listingPrice: ipo.listing_gains_by_exchange?.nse?.lastTradePrice,
        listingGainPercentage: ipo.listing_gain
      })) || [];
    }
    
    if (data.current_ipos) {
      closedIPOs = data.current_ipos.map((ipo: ApiIPO) => {
        // Safely parse price band
        let minPrice = 0;
        let maxPrice = 0;
        
        if (ipo.price_band) {
          const parts = ipo.price_band.split('-');
          if (parts.length > 0 && parts[0]) {
            minPrice = parseInt(parts[0].replace(/[^\d]/g, '') || '0');
          }
          if (parts.length > 1 && parts[1]) {
            maxPrice = parseInt(parts[1].replace(/[^\d]/g, '') || '0');
          }
        }
        
        return {
          id: ipo.ipo_id,
          companyName: ipo.company_name,
          symbol: ipo.ipo_name,
          industry: ipo.category,
          logoUrl: ipo.logo_url,
          status: 'closed',
          openDate: ipo.opening_date,
          closeDate: ipo.closing_date,
          priceRange: {
            min: minPrice,
            max: maxPrice
          }
        };
      }) || [];
    }
    
    stats = {
      activeCount: data.hero_section?.total_ipos || 0,
      averageReturn: data.hero_section?.market_performance?.average_listing_gain || 0,
      upcomingCount: data.upcoming_ipos?.length || 0,
      topSector: {
        name: data.top_listing_gains?.all_time?.[0]?.category || 'Technology',
        return: data.top_listing_gains?.all_time?.[0]?.listing_gain || 0
      }
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
    ? [...trendingIPOs].sort((a, b) => (a.listingGainPercentage || 0) - (b.listingGainPercentage || 0))
    : [];

  return (
    <main>
      <HeroSection 
        trendingIPOs={trendingIPOs}
        upcomingIPOs={upcomingIPOs}
        recentIPOs={recentIPOs}
        closedIPOs={closedIPOs}
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
