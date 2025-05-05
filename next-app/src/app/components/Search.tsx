'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type SearchResult = {
  company_name: string;
  detail_url: string;
  opening_date: string;
  closing_date: string;
  listing_date: string;
  issue_price: string | null;
  issue_amount: string;
  listing_at: string;
  lead_manager: string;
  status: string;
  ipo_id: string;
};

type SearchResponse = {
  data: SearchResult[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  query: string;
};

// Direct API URL for search
const API_URL = 'http://localhost:8000/api/ipos/search';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Search function
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    setIsLoading(true);
    setShowResults(true);
    
    try {
      // Direct call to the backend API instead of going through Next.js API route
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(searchQuery)}`);
      const data: SearchResponse = await response.json();
      setResults(data.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debounce search for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [query]);
  
  // Format the status for better display
  const formatStatus = (status: string) => {
    switch(status) {
      case 'upcoming':
        return { label: 'Upcoming', class: 'bg-blue-100 text-blue-800' };
      case 'open':
        return { label: 'Open', class: 'bg-green-100 text-green-800' };
      case 'closed':
        return { label: 'Closed', class: 'bg-yellow-100 text-yellow-800' };
      case 'listed':
        return { label: 'Listed', class: 'bg-purple-100 text-purple-800' };
      default:
        return { label: status, class: 'bg-gray-100 text-gray-800' };
    }
  };
  
  return (
    <div className="relative w-full max-w-lg mx-auto" ref={searchRef}>
      <div className="bg-white rounded-full py-2 px-4 flex items-center justify-between shadow-md border border-gray-200">
        <input 
          type="text" 
          placeholder="Search for any IPO..." 
          className="w-full text-gray-800 bg-transparent border-none focus:outline-none text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query && results.length > 0) {
              setShowResults(true);
            }
          }}
        />
        <button 
          className="bg-blue-600 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition-colors"
          onClick={() => handleSearch(query)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto border border-gray-200">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {results.map((result) => {
                const status = formatStatus(result.status);
                return (
                  <li key={result.ipo_id} className="p-3 hover:bg-gray-50 transition-colors">
                    <a href={`/ipo/${result.ipo_id}`} className="block" onClick={() => setShowResults(false)}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-sm text-gray-900">{result.company_name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.class}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="text-gray-500">Dates: </span>
                          {result.opening_date ? `${result.opening_date} to ${result.closing_date}` : 'N/A'}
                        </div>
                        <div>
                          <span className="text-gray-500">Issue Size: </span>
                          ₹{result.issue_amount} Cr
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : query ? (
            <div className="p-4 text-center text-gray-500">
              <p>No IPOs found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 