'use client';

import { useParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useIPOData from "@/lib/hooks/useIPOData";
import { IPOYearlyStats, IPOSummary } from '@/lib/server/ipoDataService';
import Link from 'next/link';

// --- Reusable Stat Card Component (from stats page) ---
const StatCard = ({ title, value, description }: { title: string, value: string | number, description?: string }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center">
    <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{title}</div>
    {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
  </div>
);

// --- Main Yearly Stats Page Component ---
export default function YearlyStatsPage() {
  const params = useParams();
  const yearParam = params?.year as string;
  const year = parseInt(yearParam, 10); // Convert param to number

  // Fetch yearly stats
  const { yearlyStats, loading: loadingStats, error: statsError } = useIPOData.useIPOYearlyStats(year);
  // Fetch IPOs for this year using the filter hook
  const { filteredResults: iposForYear, loading: loadingIpos, error: iposError } = useIPOData.useFilterIPOs({ year });

  const pageTitle = `${year} IPO Statistics & List`;

  // Combined loading and error handling
  const isLoading = loadingStats || loadingIpos;
  const hasError = statsError || iposError;
  const errorMessage = statsError?.message || iposError?.message;

  // Helper to display loading/error states for sections
  const renderLoadingError = (loading: boolean, error: Error | null, type: string) => {
    if (loading) return <p className="text-gray-500 dark:text-gray-400 text-center py-4">Loading {type}...</p>;
    if (error) return <p className="text-red-500 text-center py-4">Error loading {type}.</p>;
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 md:mb-8">
           <Link href="/stats" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
             &larr; Back to All Statistics
           </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-gray-200 text-center">
          {isNaN(year) ? 'Invalid Year' : pageTitle}
        </h1>

        {isNaN(year) && (
          <p className="text-center text-red-500">The year provided in the URL is not valid.</p>
        )}

        {!isNaN(year) && isLoading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600 dark:text-gray-400">Loading {year} IPO Data...</p>
          </div>
        )}

        {!isNaN(year) && hasError && (
          <div className="text-center py-10">
            <p className="text-xl text-red-500">Error loading data for {year}: {errorMessage}</p>
          </div>
        )}

        {!isNaN(year) && !isLoading && !hasError && (
          <>
            {/* --- Yearly Stats Summary --- */}
            <section className="mb-8 md:mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">{year} Market Summary</h2>
              {renderLoadingError(loadingStats, statsError, 'yearly statistics')}
              {yearlyStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <StatCard title="Total IPOs" value={yearlyStats.totalCount ?? 'N/A'} description={`in ${year}`} />
                  <StatCard title="Avg. Listing Gain" value={yearlyStats.averageListingGain !== null ? `${yearlyStats.averageListingGain.toFixed(2)}%` : 'N/A'} description={`for ${year}`} />
                  {/* Add more yearly stats cards if available in the API response */}
                </div>
              ) : (
                 !loadingStats && !statsError && <p className="text-gray-500 dark:text-gray-400 text-center">No specific statistics found for {year}.</p>
              )}
              {/* Display Best/Worst for the year if available */}
              {yearlyStats?.bestPerformer && (
                 <div className="mt-4 text-center text-sm">
                    <strong>Best Performer ({year}): </strong>
                    <Link href={`/ipo/${yearlyStats.bestPerformer.ipo_id}`} className="text-green-600 dark:text-green-400 hover:underline">
                       {yearlyStats.bestPerformer.ipo_name} ({yearlyStats.bestPerformer.listing_gains})
                    </Link>
                 </div>
              )}
               {yearlyStats?.worstPerformer && (
                 <div className="mt-1 text-center text-sm">
                    <strong>Worst Performer ({year}): </strong>
                    <Link href={`/ipo/${yearlyStats.worstPerformer.ipo_id}`} className="text-red-600 dark:text-red-400 hover:underline">
                       {yearlyStats.worstPerformer.ipo_name} ({yearlyStats.worstPerformer.listing_gains})
                    </Link>
                 </div>
              )}
            </section>

            {/* --- List of IPOs for the Year --- */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">IPOs Listed in {year}</h2>
              {renderLoadingError(loadingIpos, iposError, `IPOs for ${year}`)}
              {iposForYear && iposForYear.length > 0 ? (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Listing Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Issue Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Listing Gains</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {iposForYear.map((ipo: IPOSummary) => (
                        <tr key={ipo.ipo_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            <Link href={`/ipo/${ipo.ipo_id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                              {ipo.ipo_name || ipo.company_name || 'N/A'}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ipo.listing_date || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ipo.issue_price || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ipo.listing_gains || 'N/A'}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                               ipo.status === 'listed' ? 'bg-purple-100 text-purple-800' :
                               'bg-gray-100 text-gray-800' // Should mostly be listed here
                             }`}>
                               {ipo.status?.toUpperCase() || 'Unknown'}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                 !loadingIpos && !iposError && <p className="text-gray-500 dark:text-gray-400 text-center">No IPOs found listed in {year}.</p>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
