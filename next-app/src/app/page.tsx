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

// Enable ISR with a revalidation period of 1 hour
export const revalidate = 3600;

export default async function Home() {
  // Get data for the hero section
  const trendingIPOs = await fetchTrendingIPOs();
  const upcomingIPOs = await fetchUpcomingIPOs();
  const recentIPOs = await fetchRecentlyListedIPOs();
  const closedIPOs = await fetchClosedIPOs();
  const stats = await fetchIPOStats();
  
  // The top performing and losing IPOs are already in the trending and non-trending lists
  const topPerformingIPOs = trendingIPOs;
  // For losing IPOs, we can reverse the trending order
  const topLosingIPOs = [...trendingIPOs].sort((a, b) => 
    (a.listingGainPercentage || 0) - (b.listingGainPercentage || 0)
  );

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
