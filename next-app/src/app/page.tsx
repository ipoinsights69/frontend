import React from 'react';
import HeroSection from './components/HeroSection';
import HomeIPOShowcase from './components/HomeIPOShowcase';
import { 
  getTrendingIPOs, 
  getUpcomingIPOs, 
  getRecentlyListedIPOs, 
  getClosedIPOs, 
  getIPOStats,
  getTopPerformingIPOs,
  getTopLosingIPOs
} from '@/lib/ipoDataService';

// Enable ISR with a revalidation period of 1 hour
export const revalidate = 3600;

export default function Home() {
  // Get data for the hero section
  const trendingIPOs = getTrendingIPOs();
  const upcomingIPOs = getUpcomingIPOs();
  const recentIPOs = getRecentlyListedIPOs();
  const closedIPOs = getClosedIPOs();
  const stats = getIPOStats();
  
  // Get data for the IPO showcase section
  const topPerformingIPOs = getTopPerformingIPOs();
  const topLosingIPOs = getTopLosingIPOs();

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
