import React from 'react';
import HeroSection from './components/HeroSection';
import { 
  getTrendingIPOs, 
  getUpcomingIPOs, 
  getRecentlyListedIPOs, 
  getClosedIPOs, 
  getIPOStats 
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

  return (
    <main>
      <HeroSection 
        trendingIPOs={trendingIPOs}
        upcomingIPOs={upcomingIPOs}
        recentIPOs={recentIPOs}
        closedIPOs={closedIPOs}
        stats={stats}
      />
      {/* Other homepage sections can be added here */}
    </main>
  );
}
