'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faSearch, 
  faBars,
  faTimes,
  faAngleRight
} from '@fortawesome/free-solid-svg-icons';

// Navigation menu type
interface MenuItem {
  name: string;
  path: string;
  active: boolean;
}

// IPO search result type
interface SearchResult {
  ipo_id: string;
  company_name: string;
  ipo_name: string;
  year: number;
  status?: string;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Load menu items from JSON file
  useEffect(() => {
    async function loadMenuItems() {
      try {
        const response = await fetch('/data/navigation.json');
        if (!response.ok) {
          throw new Error(`Failed to load navigation data: ${response.status}`);
        }
        const data = await response.json();
        
        // Update active state based on current URL
        const updatedData = data.map((item: MenuItem) => ({
          ...item,
          active: pathname === item.path
        }));
        
        setMenuItems(updatedData);
      } catch (error) {
        console.error('Error loading navigation data:', error);
        // Fallback menu items if JSON fails to load
        setMenuItems([
          { name: 'Home', path: '/', active: pathname === '/' },
          { name: 'Market', path: '/market', active: pathname === '/market' },
          { name: 'IPO Calendar', path: '/calendar', active: pathname === '/calendar' },
          { name: 'Performance', path: '/performance', active: pathname === '/performance' },
          { name: 'Insights', path: '/insights', active: pathname === '/insights' }
        ]);
      }
    }
    
    loadMenuItems();
  }, [pathname]);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (value: string) => {
      if (value.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      
      try {
        // Call the external API directly
        const response = await fetch(`http://localhost:8000/api/ipos/search?q=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          // Map the response data to match the expected format
          setSearchResults(data.data.map((item: any) => ({
            ipo_id: item.ipo_id,
            company_name: item.company_name,
            ipo_name: item.company_name,
            year: item.year,
            status: item.status
          })));
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );
  
  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.length >= 2);
    
    const timer = setTimeout(() => {
      debouncedSearch(value);
    }, 300);
    
    return () => clearTimeout(timer);
  };
  
  // Handle click on search result
  const handleResultClick = (ipoId: string) => {
    router.push(`/ipo/${ipoId}`);
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
    setMobileMenuOpen(false);
  };
  
  // Handle click outside search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) &&
        (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node))
      ) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-600";
    
    switch (status.toLowerCase()) {
      case 'upcoming': return "bg-blue-50 text-blue-600";
      case 'open': return "bg-green-50 text-green-600";
      case 'closed': return "bg-orange-50 text-orange-600";
      case 'listed': return "bg-purple-50 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 transition-opacity hover:opacity-80">
            <div className="h-9 w-9 bg-blue-600 text-white rounded-md flex items-center justify-center mr-2 shadow-sm">
              <FontAwesomeIcon icon={faChartLine} className="text-sm" />
            </div>
            <span className="text-lg font-medium text-gray-800">
              IPO<span className="text-blue-600 font-semibold">Insight</span>
            </span>
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className={`text-sm font-medium pb-5 border-b-2 transition duration-150 ${
                  item.active
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* User actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div ref={desktopSearchRef} className="hidden md:block relative">
              <div className={`flex items-center bg-gray-50 rounded-md pl-3 pr-2 py-2 border ${showResults && searchResults.length > 0 ? 'border-blue-200 shadow-md' : 'border-gray-200'} transition-all duration-200 hover:border-blue-200 focus-within:border-blue-300 focus-within:shadow-md`}>
                <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-xs mr-2" />
                <input 
                  type="text" 
                  placeholder="Search IPOs..." 
                  className="bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400 w-48"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-gray-600 ml-1 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                )}
              </div>
              
              {/* Search Results */}
              {showResults && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                        IPO Results
                      </div>
                      {searchResults.map((result) => (
                        <div 
                          key={result.ipo_id}
                          className="px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors flex justify-between items-center"
                          onClick={() => handleResultClick(result.ipo_id)}
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-800">{result.company_name}</div>
                            <div className="text-xs text-gray-500 mt-0.5 flex gap-2 items-center">
                              <span>{result.year}</span>
                              {result.status && (
                                <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${getStatusColor(result.status)}`}>
                                  {result.status}
                                </span>
                              )}
                            </div>
                          </div>
                          <FontAwesomeIcon icon={faAngleRight} className="text-gray-400 text-xs" />
                        </div>
                      ))}
                      <div className="px-4 py-2 bg-gray-50 text-xs text-center text-blue-600 font-medium hover:text-blue-800 cursor-pointer">
                        <Link href={`/search?q=${encodeURIComponent(searchTerm)}`}>
                          View all results
                        </Link>
                      </div>
                    </div>
                  ) : searchTerm.length >= 2 ? (
                    <div className="p-6 text-center text-sm text-gray-500">
                      <div className="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      No IPOs found matching "{searchTerm}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition duration-150"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden border-t border-gray-200 bg-white shadow-lg ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div className="py-3 space-y-2 px-4">
          {/* Mobile Search */}
          <div ref={mobileSearchRef} className="relative mb-4">
            <div className={`flex items-center bg-gray-50 rounded-md pl-3 pr-2 py-2.5 border ${showResults && searchResults.length > 0 ? 'border-blue-200 shadow-md' : 'border-gray-200'}`}>
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search IPOs..." 
                className="bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 ml-1 p-1.5 rounded-full hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            
            {/* Mobile Search Results */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                      IPO Results
                    </div>
                    {searchResults.map((result) => (
                      <div 
                        key={result.ipo_id}
                        className="px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 flex justify-between items-center"
                        onClick={() => handleResultClick(result.ipo_id)}
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-800">{result.company_name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 flex gap-2 items-center">
                            <span>{result.year}</span>
                            {result.status && (
                              <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${getStatusColor(result.status)}`}>
                                {result.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <FontAwesomeIcon icon={faAngleRight} className="text-gray-400 text-xs" />
                      </div>
                    ))}
                  </div>
                ) : searchTerm.length >= 2 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    <div className="mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    No IPOs found matching "{searchTerm}"
                  </div>
                ) : null}
              </div>
            )}
          </div>
          
          {/* Mobile Navigation */}
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              href={item.path}
              className={`block px-4 py-2.5 text-sm font-medium rounded-md ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
} 