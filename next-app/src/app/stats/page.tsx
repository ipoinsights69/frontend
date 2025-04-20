'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useIPOData from "@/lib/hooks/useIPOData";
import { IPOStats, YearCount, IPOSummary } from '@/lib/server/ipoDataService';
import Link from 'next/link';

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, description }: { title: string, value: string | number, description?: string }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center">
    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{title}</div>
    {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
  </div>
);

// --- Main Statistics Page Component ---
export default function StatsPage() {
  const { stats, loading: loadingStats, error: statsError } = useIPOData.useIPOStats();
  const { years, loading: loadingYears, error: yearsError } = useIPOData.useIPOYears();
  const { bestPerformingIpos, loading: loadingBest, error: bestError } = useIPOData.useBestPerformingIPOs();
  const { worstPerformingIpos, loading: loadingWorst, error: worstError } = useIPOData.useWorstPerformingIPOs();

  const pageTitle = "IPO Market Statistics & Performance";

  // Helper to display loading/error states
  const renderLoadingError = (loading: boolean, error: Error | null, type: string) => {
    if (loading) return <p className="text-gray-500 dark:text-gray-400 text-center py-4">Loading {type}...</p>;
    if (error) return <p className="text-red-500 text-center py-4">Error loading {type}.</p>;
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-gray-200 text-center">
          {pageTitle}
        </h1>

        {/* --- Overall Stats Section --- */}
        <section className="mb-8 md:mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Overall Market Snapshot</h2>
          {renderLoadingError(loadingStats, statsError, 'overall statistics')}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              <StatCard title="Total IPOs Tracked" value={stats.totalCount ?? 'N/A'} />
              <StatCard title="Upcoming" value={stats.byStatus?.upcoming ?? 'N/A'} />
              <StatCard title="Currently Open" value={stats.byStatus?.open ?? 'N/A'} />
              <StatCard title="Listed" value={stats.byStatus?.listed ?? 'N/A'} />
              <StatCard title="Closed" value={stats.byStatus?.closed ?? 'N/A'} />
            </div>
          )}
        </section>

        {/* --- Performance Highlights Section --- */}
         <section className="mb-8 md:mb-10">
           <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Performance Highlights</h2>
           {renderLoadingError(loadingBest || loadingWorst, bestError || worstError, 'performance data')}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
             {/* Best Performers */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
               <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">Top 5 Best Performers (Listing Gains)</h3>
               {bestPerformingIpos && bestPerformingIpos.length > 0 ? (
                 <ul className="space-y-2 text-sm">
                   {bestPerformingIpos.slice(0, 5).map((ipo: Partial<IPOSummary>) => (
                     <li key={`best-${ipo.ipo_id}`} className="flex justify-between items-center">
                       <Link href={`/ipo/${ipo.ipo_id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                         {ipo.ipo_name || 'N/A'}
                       </Link>
                       <span className="font-medium text-green-700 dark:text-green-300">{ipo.listing_gains || 'N/A'}</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-500 dark:text-gray-400 text-sm">No best performer data available.</p>
               )}
             </div>
             {/* Worst Performers */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
               <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">Top 5 Worst Performers (Listing Gains)</h3>
               {worstPerformingIpos && worstPerformingIpos.length > 0 ? (
                 <ul className="space-y-2 text-sm">
                   {worstPerformingIpos.slice(0, 5).map((ipo: Partial<IPOSummary>) => (
                     <li key={`worst-${ipo.ipo_id}`} className="flex justify-between items-center">
                       <Link href={`/ipo/${ipo.ipo_id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                         {ipo.ipo_name || 'N/A'}
                       </Link>
                       <span className="font-medium text-red-700 dark:text-red-300">{ipo.listing_gains || 'N/A'}</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-500 dark:text-gray-400 text-sm">No worst performer data available.</p>
               )}
             </div>
           </div>
           {/* Link to a potential dedicated performance page */}
           {/* <div className="text-center mt-6">
              <Link href="/performance" className="text-blue-600 dark:text-blue-400 hover:underline">
                View More Performance Details &rarr;
              </Link>
           </div> */}
         </section>

        {/* --- Yearly Statistics Section --- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Statistics by Year</h2>
          {renderLoadingError(loadingYears, yearsError, 'yearly data')}
          {years && years.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {years
                .sort((a, b) => b.year - a.year) // Sort years descending
                .map((y: YearCount) => (
                <Link
                  href={`/stats/year/${y.year}`}
                  key={y.year}
                  className="block bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 font-medium px-4 py-2 rounded-lg transition duration-200"
                >
                  {y.year} ({y.count} IPOs)
                </Link>
              ))}
            </div>
          ) : (
             !loadingYears && !yearsError && <p className="text-gray-500 dark:text-gray-400 text-center">No yearly statistics available.</p>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}
