'use client';
import React, { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/app/utils/dateUtils';

// Enable cache revalidation every hour
export const revalidate = 3600;

// Define dynamic metadata based on search query
export async function generateMetadata({ searchParams }: { searchParams: { q: string } }): Promise<Metadata> {
  const { q } = searchParams;
  return {
    title: q ? `Search: ${q} - IPO Insights` : 'Search IPOs - IPO Insights',
    description: q ? `Search results for ${q} - Find IPO details, performance, and more on IPO Insights` : 'Search for IPOs, get detailed information, performance metrics, and more on IPO Insights',
  };
}

interface SearchResult {
  ipo_id: string;
  company_name: string;
  detail_url: string;
  opening_date: string;
  closing_date: string;
  listing_date: string;
  issue_price: number | null;
  issue_amount: string;
  listing_at: string;
  lead_manager: string;
  year: number;
  _fetched_at: string;
  status: string;
}

interface SearchResponse {
  data: SearchResult[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  query: string;
  search_type: string;
  request_parameters: {
    q: string;
    page: number;
    limit: number;
  };
}

// Function to get status color class
function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'bg-purple-100 text-purple-800';
    case 'open':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-blue-100 text-blue-800';
    case 'listed':
      return 'bg-teal-100 text-teal-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

async function getSearchResults(query: string, page = 1, limit = 10) {
  if (!query) {
    return {
      data: [],
      page: 1,
      limit,
      total: 0,
      totalPages: 0,
      query: '',
      search_type: 'text',
      request_parameters: { q: query, page, limit }
    };
  }
  
  try {
    // Use the external API endpoint with correct port 8000
    const response = await fetch(
      `http://localhost:8000/api/ipos/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    return await response.json() as SearchResponse;
  } catch (error) {
    console.error('Error performing search:', error);
    return {
      data: [],
      page: 1,
      limit,
      total: 0,
      totalPages: 0,
      query,
      search_type: 'text',
      request_parameters: { q: query, page, limit },
      error: 'Failed to fetch search results'
    };
  }
}

// Client component for search form
function SearchForm({ defaultQuery }: { defaultQuery: string }) {
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company name, symbol or industry..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: { q: string, page?: string } }) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 10;
  
  const results = await getSearchResults(query, page, limit);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {query ? `Search Results: "${query}"` : 'Search IPOs'}
        </h1>
        <p className="text-gray-600">
          {results.total > 0 
            ? `Found ${results.total} result${results.total === 1 ? '' : 's'}`
            : query 
              ? 'No results found. Try a different search term.'
              : 'Enter a search term to find IPOs.'}
        </p>
      </div>
      
      {/* Search Form */}
      <SearchForm defaultQuery={query} />
      
      {/* Results */}
      {results.data.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200 p-4 font-medium text-gray-600 text-sm hidden md:grid">
            <div className="col-span-2">Company</div>
            <div>Date</div>
            <div>Issue Price</div>
            <div>Issue Size</div>
            <div>Status</div>
          </div>
          
          {/* Table Content */}
          <div className="divide-y divide-gray-200">
            {results.data.map((ipo) => (
              <Link 
                href={`/ipo/${ipo.ipo_id}`} 
                key={ipo.ipo_id}
                className="block hover:bg-blue-50 transition-colors"
              >
                {/* Desktop View */}
                <div className="grid grid-cols-6 p-4 items-center text-sm hidden md:grid">
                  <div className="col-span-2">
                    <div className="font-medium text-gray-900">
                      {ipo.company_name}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      Listed on: {ipo.listing_at}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-800">
                      {ipo.opening_date === 'N/A' ? 'N/A' : formatDate(ipo.opening_date)}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {ipo.opening_date !== 'N/A' && ipo.closing_date !== 'N/A' 
                        ? `to ${formatDate(ipo.closing_date)}`
                        : ''}
                    </div>
                  </div>
                  
                  <div>
                    {ipo.issue_price 
                      ? `₹${ipo.issue_price}` 
                      : 'TBD'}
                  </div>
                  
                  <div>
                    {ipo.issue_amount !== 'N/A'
                      ? `₹${ipo.issue_amount} Cr`
                      : 'N/A'}
                  </div>
                  
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ipo.status)}`}>
                      {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Mobile View */}
                <div className="block p-4 md:hidden">
                  <div className="font-medium text-gray-900 mb-1">
                    {ipo.company_name}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-500">Dates:</div>
                    <div className="text-gray-800">
                      {ipo.opening_date === 'N/A' ? 'N/A' : formatDate(ipo.opening_date)}
                      {ipo.opening_date !== 'N/A' && ipo.closing_date !== 'N/A' 
                        ? ` to ${formatDate(ipo.closing_date)}`
                        : ''}
                    </div>
                    
                    <div className="text-gray-500">Issue Price:</div>
                    <div className="text-gray-800">
                      {ipo.issue_price 
                        ? `₹${ipo.issue_price}` 
                        : 'TBD'}
                    </div>
                    
                    <div className="text-gray-500">Issue Size:</div>
                    <div className="text-gray-800">
                      {ipo.issue_amount !== 'N/A'
                        ? `₹${ipo.issue_amount} Cr`
                        : 'N/A'}
                    </div>
                    
                    <div className="text-gray-500">Listed on:</div>
                    <div className="text-gray-800">{ipo.listing_at}</div>
                    
                    <div className="text-gray-500">Status:</div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(ipo.status)}`}>
                        {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-gray-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-700 mb-2">No results found</h2>
          <p className="text-gray-500 mb-4">
            We couldn't find any IPOs matching "{query}". Please try different keywords.
          </p>
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Home
          </Link>
        </div>
      ) : null}
      
      {/* Pagination */}
      {results.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-1">
            {/* Previous Page */}
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${Math.max(1, page - 1)}`}
              className={`px-4 py-2 text-sm rounded-md ${
                page <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : undefined}
            >
              Previous
            </Link>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(results.totalPages, 5) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (results.totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= results.totalPages - 2) {
                pageNum = results.totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <Link
                  key={pageNum}
                  href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
                  className={`px-4 py-2 text-sm rounded-md ${
                    pageNum === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300`}
                >
                  {pageNum}
                </Link>
              );
            })}
            
            {/* Next Page */}
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${Math.min(results.totalPages, page + 1)}`}
              className={`px-4 py-2 text-sm rounded-md ${
                page >= results.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              aria-disabled={page >= results.totalPages}
              tabIndex={page >= results.totalPages ? -1 : undefined}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </main>
  );
} 