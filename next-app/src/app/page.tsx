'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IPOList from "@/components/IPOList";
import IPOStats from "@/components/IPOStats";
import useIPOData from "@/lib/hooks/useIPOData";

export default function Home() {
  // Add state to track client-side hydration
  const [isClient, setIsClient] = useState(false);
  
  // Get IPO data using our hooks
  const { stats, loading: loadingStats, error: statsError } = useIPOData.useIPOStats();
  const { upcomingIpos, loading: loadingUpcoming, error: upcomingError } = useIPOData.useUpcomingIPOs();
  const { openIpos, loading: loadingOpen, error: openError } = useIPOData.useOpenIPOs();
  const { bestPerformingIpos, loading: loadingBest, error: bestError } = useIPOData.useBestPerformingIPOs();
  
  // Use effect to update client state after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        <div className="container mx-auto px-4 py-12">
          {/* Only render data-dependent components after hydration */}
          {isClient && (
            <>
              {/* IPO Market Overview */}
              <IPOStats stats={stats} loading={loadingStats} error={statsError} />
              
              {/* Tables of IPO data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming IPOs */}
                <IPOList 
                  ipos={upcomingIpos || []} 
                  title="Upcoming IPOs" 
                  loading={loadingUpcoming} 
                  error={upcomingError}
                  viewAllLink="/ipos/upcoming"
                  limit={5}
                />
                
                {/* Open IPOs */}
                <IPOList 
                  ipos={openIpos || []} 
                  title="Currently Open for Subscription" 
                  loading={loadingOpen} 
                  error={openError}
                  viewAllLink="/ipos/open"
                  limit={5}
                />
              </div>
              
              {/* Best Performers */}
              <IPOList 
                // Convert partial IPOSummary to IPOSummary by type assertion
                ipos={bestPerformingIpos as any || []} 
                title="Best Performing IPOs" 
                loading={loadingBest} 
                error={bestError}
                viewAllLink="/ipos/performance"
                limit={5}
              />
            </>
          )}
          
          {/* Show skeleton loading state before hydration */}
          {!isClient && (
            <div className="animate-pulse space-y-8">
              <div className="h-48 bg-gray-200 rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
