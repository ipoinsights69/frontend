'use client';

import { useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useIPOData from "@/lib/hooks/useIPOData";
import { IPOSummary } from '@/lib/server/ipoDataService';
import Link from 'next/link';
import { Suspense } from 'react'; // Import Suspense

// --- Search Results Component ---
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || ''; // Get query from URL

  // Fetch search results using the hook
  const { results, loading, error } = useIPOData.useSearchIPOs(query);

  const pageTitle = `Search Results for "${query}"`;

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-gray-200">
        {pageTitle}
      </h1>

      {loading && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 dark:text-gray-400">Searching IPOs...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-xl text-red-500">Error performing search: {error.message}</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      )}

      {!loading && !error && results && results.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Issue Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Listing Gains</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((ipo: IPOSummary) => (
                <tr key={ipo.ipo_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <Link href={`/ipo/${ipo.ipo_id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {ipo.ipo_name || ipo.company_name || 'N/A'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ipo.year || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ipo.issue_price || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                       ipo.status === 'open' ? 'bg-green-100 text-green-800' :
                       ipo.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                       ipo.status === 'listed' ? 'bg-purple-100 text-purple-800' :
                       'bg-gray-100 text-gray-800'
                     }`}>
                       {ipo.status?.toUpperCase() || 'Unknown'}
                     </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ipo.listing_gains || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && (!results || results.length === 0) && (
         <div className="text-center py-10">
           <p className="text-xl text-gray-600 dark:text-gray-400">No IPOs found matching your query: "{query}"</p>
           <Link href="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
             &larr; Back to Home
           </Link>
         </div>
      )}
    </>
  );
}

// --- Main Search Page Component (using Suspense) ---
export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* Wrap SearchResults in Suspense for client-side data fetching */}
        <Suspense fallback={<div className="text-center py-10"><p className="text-xl text-gray-600 dark:text-gray-400">Loading search results...</p></div>}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
