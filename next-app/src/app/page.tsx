'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useIPOData from "@/lib/hooks/useIPOData";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For search redirect
import { useState } from 'react';
import { IPOSummary, IPOStats, YearCount } from '@/lib/server/ipoDataService'; // Import types

// --- Reusable Card Component (Example) ---
const InfoCard = ({ title, children, viewAllLink, viewAllText }: { title: string, children: React.ReactNode, viewAllLink?: string, viewAllText?: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
    <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
    <div className="space-y-4">
      {children}
    </div>
    {viewAllLink && viewAllText && (
      <div className="mt-6 text-right">
        <Link href={viewAllLink} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          {viewAllText} &rarr;
        </Link>
      </div>
    )}
  </div>
);

// --- Main Home Component ---
export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // --- Fetch Data ---
  const { stats, loading: loadingStats, error: statsError } = useIPOData.useIPOStats();
  const { upcomingIpos, loading: loadingUpcoming, error: upcomingError } = useIPOData.useUpcomingIPOs();
  const { bestPerformingIpos, loading: loadingBest, error: bestError } = useIPOData.useBestPerformingIPOs();
  const { worstPerformingIpos, loading: loadingWorst, error: worstError } = useIPOData.useWorstPerformingIPOs();
  const { years, loading: loadingYears, error: yearsError } = useIPOData.useIPOYears();
  // Fetch counts for status links (can be optimized later)
  const { ipos: openIpos } = useIPOData.useIPOsByStatus('open');
  const { ipos: closedIpos } = useIPOData.useIPOsByStatus('closed');
  const { ipos: listedIpos } = useIPOData.useIPOsByStatus('listed');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Helper to display loading/error states
  const renderLoadingError = (loading: boolean, error: Error | null, type: string) => {
    if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading {type}...</p>;
    if (error) return <p className="text-red-500">Error loading {type}.</p>;
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">

        {/* --- Hero Section --- */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Your Go-To Source for Upcoming & Latest IPOs
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
            Track Initial Public Offerings with live data, performance insights, and market statistics.
          </p>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search IPOs by name, company, year..."
                className="w-full px-4 py-3 pr-12 text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
              />
              <button type="submit" className="absolute top-0 right-0 h-full px-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </form>
          {/* CTAs */}
          <div className="space-x-4">
            <Link href="/upcoming" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
              View Upcoming IPOs
            </Link>
            {/* Optional Secondary CTA */}
            {/* <Link href="/performance" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-200">
              Check Performance
            </Link> */}
          </div>
        </section>

        {/* --- Grid Layout for Content Sections --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Upcoming IPOs Section */}
          <InfoCard title="Upcoming IPOs" viewAllLink="/upcoming" viewAllText="View All Upcoming">
            {renderLoadingError(loadingUpcoming, upcomingError, 'upcoming IPOs')}
            {upcomingIpos && upcomingIpos.length > 0 ? (
              upcomingIpos.slice(0, 3).map((ipo: IPOSummary) => (
                <Link href={`/ipo/${ipo.ipo_id}`} key={ipo.ipo_id} className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">{ipo.ipo_name || 'N/A'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Open: {ipo.opening_date || 'TBA'} | Close: {ipo.closing_date || 'TBA'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price: {ipo.issue_price || 'TBA'}</p>
                </Link>
              ))
            ) : (
              !loadingUpcoming && !upcomingError && <p className="text-gray-500 dark:text-gray-400">No upcoming IPOs found.</p>
            )}
          </InfoCard>

          {/* Market Performance Snapshot */}
          <InfoCard title="Recent Performance Highlights" viewAllLink="/performance" viewAllText="Explore Performance Data">
             {renderLoadingError(loadingBest || loadingWorst, bestError || worstError, 'performance data')}
             {bestPerformingIpos && bestPerformingIpos.length > 0 && (
               <div>
                 <h4 className="font-medium mb-1 text-green-600 dark:text-green-400">Top Performers:</h4>
                 {bestPerformingIpos.slice(0, 3).map((ipo: Partial<IPOSummary>) => (
                   <Link href={`/ipo/${ipo.ipo_id}`} key={`best-${ipo.ipo_id}`} className="block text-sm hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                     {ipo.ipo_name || 'N/A'} ({ipo.listing_gains || 'N/A'})
                   </Link>
                 ))}
               </div>
             )}
             {worstPerformingIpos && worstPerformingIpos.length > 0 && (
               <div className="mt-3">
                 <h4 className="font-medium mb-1 text-red-600 dark:text-red-400">Worst Performers:</h4>
                 {worstPerformingIpos.slice(0, 3).map((ipo: Partial<IPOSummary>) => (
                   <Link href={`/ipo/${ipo.ipo_id}`} key={`worst-${ipo.ipo_id}`} className="block text-sm hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                     {ipo.ipo_name || 'N/A'} ({ipo.listing_gains || 'N/A'})
                   </Link>
                 ))}
               </div>
             )}
             {!loadingBest && !loadingWorst && (!bestPerformingIpos || bestPerformingIpos.length === 0) && (!worstPerformingIpos || worstPerformingIpos.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400">No performance data available.</p>
             )}
          </InfoCard>

          {/* Key Market Statistics */}
          <InfoCard title="IPO Market Snapshot" viewAllLink="/stats" viewAllText="View Detailed Statistics">
            {renderLoadingError(loadingStats, statsError, 'statistics')}
            {stats ? (
              <ul className="space-y-2 text-sm">
                <li><strong>Total IPOs Tracked:</strong> {stats.totalCount ?? 'N/A'}</li>
                <li><strong>Currently Open:</strong> {stats.byStatus?.open ?? 'N/A'}</li>
                <li><strong>Upcoming:</strong> {stats.byStatus?.upcoming ?? 'N/A'}</li>
                <li><strong>Listed This Year (Example):</strong> {stats.byStatus?.listed ?? 'N/A'}</li>
                {/* Debug info - remove in production */}
                <li className="text-xs text-gray-400 mt-1">Debug: {JSON.stringify({
                  hasStats: !!stats,
                  totalCount: stats.totalCount,
                  hasStatusInfo: !!stats.byStatus,
                  statusInfo: stats.byStatus
                })}</li>
              </ul>
            ) : (
              !loadingStats && !statsError && <p className="text-gray-500 dark:text-gray-400">No statistics available.</p>
            )}
          </InfoCard>

          {/* Browse IPOs Section */}
          <InfoCard title="Browse IPOs">
             <div className="grid grid-cols-2 gap-4 text-sm">
                <Link href="/status/open" className="text-blue-600 dark:text-blue-400 hover:underline">Open IPOs ({openIpos?.length ?? 0})</Link>
                <Link href="/status/closed" className="text-blue-600 dark:text-blue-400 hover:underline">Closed IPOs ({closedIpos?.length ?? 0})</Link>
                <Link href="/status/upcoming" className="text-blue-600 dark:text-blue-400 hover:underline">Upcoming IPOs ({upcomingIpos?.length ?? 0})</Link>
                <Link href="/status/listed" className="text-blue-600 dark:text-blue-400 hover:underline">Listed IPOs ({listedIpos?.length ?? 0})</Link>
             </div>
             <div className="mt-4">
                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">By Year:</h4>
                {renderLoadingError(loadingYears, yearsError, 'years')}
                {years && years.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {years.slice(0, 5).map((y: YearCount) => ( // Show recent years
                       <Link href={`/stats/year/${y.year}`} key={y.year} className="text-blue-600 dark:text-blue-400 hover:underline text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                         {y.year} ({y.count})
                       </Link>
                    ))}
                     <Link href="/years" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">View All Years</Link> {/* Link to a potential years index page */}
                  </div>
                ) : (
                   !loadingYears && !yearsError && <p className="text-gray-500 dark:text-gray-400 text-sm">No yearly data available.</p>
                )}
             </div>
          </InfoCard>

        </div>
      </main>
      <Footer />
    </div>
  );
}
