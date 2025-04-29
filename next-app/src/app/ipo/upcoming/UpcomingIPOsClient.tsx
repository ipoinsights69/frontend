'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faChartLine, 
  faSearch, 
  faArrowUp, 
  faCalendarWeek,
  faChevronRight,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { IPODataProps, IPOSummary } from './ipoData';

function formatDate() {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ', ' + now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short'
  });
}

export default function UpcomingIPOsClient({ ipoData }: { ipoData: IPODataProps }) {
  const { upcomingIPOs, stats } = ipoData;
  const formattedDate = formatDate();
  const [activeCategory, setActiveCategory] = useState('All Categories');

  // Get IPOs opening this week and next week
  const now = new Date();
  const nextWeekStart = new Date(now);
  nextWeekStart.setDate(now.getDate() + 7);
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

  const openingThisWeek = upcomingIPOs.filter(ipo => {
    if (!ipo.opening_date) return false;
    const openDate = new Date(ipo.opening_date);
    return openDate >= now && openDate < nextWeekStart;
  });

  const openingNextWeek = upcomingIPOs.filter(ipo => {
    if (!ipo.opening_date) return false;
    const openDate = new Date(ipo.opening_date);
    return openDate >= nextWeekStart && openDate <= nextWeekEnd;
  });

  const comingSoon = upcomingIPOs.filter(ipo => {
    if (!ipo.opening_date) return true; // IPOs without opening date go to "Coming Soon"
    const openDate = new Date(ipo.opening_date);
    return openDate > nextWeekEnd;
  });

  // Featured IPO (assume first upcoming IPO is featured)
  const featuredIPO = upcomingIPOs.length > 0 ? upcomingIPOs[0] : null;

  // Add sample GMP data (since we don't have actual GMP data in our schema)
  const getRandomGMP = () => {
    const values = ['+₹85-90', '+₹20-25', '+₹15-20', '+₹40-45', '-₹5-10'];
    return values[Math.floor(Math.random() * values.length)];
  };

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Upcoming IPOs</h1>
              <p className="text-sm text-gray-600 mt-1">{formattedDate}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
              <div className="relative">
                <select 
                  className="text-sm border border-gray-300 rounded-md py-1.5 pl-3 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Mainboard</option>
                  <option>SME</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FontAwesomeIcon icon={faChevronRight} className="text-xs rotate-90" />
                </div>
              </div>
              <Link href="/ipo/calendar" className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md text-sm transition-colors duration-200 flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1.5 text-xs" />
                IPO Calendar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* IPO Summary Stats */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Upcoming IPOs</div>
              <div className="text-xl font-semibold text-gray-900">{stats.upcomingCount}</div>
              <div className="text-xs text-blue-600 mt-1 flex items-center">
                <FontAwesomeIcon icon={faCalendarWeek} className="text-xs mr-1" />
                Next 30 days
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Expected Fundraise</div>
              <div className="text-xl font-semibold text-gray-900">₹4,500+ Cr</div>
              <div className="text-xs text-green-600 mt-1 flex items-center">
                <FontAwesomeIcon icon={faArrowUp} className="text-xs mr-1" />
                15% from last month
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Average GMP</div>
              <div className="text-xl font-semibold text-gray-900">+₹42</div>
              <div className="text-xs text-green-600 mt-1 flex items-center">
                <FontAwesomeIcon icon={faArrowUp} className="text-xs mr-1" />
                8% from last week
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Top Sector</div>
              <div className="text-xl font-semibold text-gray-900">{stats.topSector.name}</div>
              <div className="text-xs text-blue-600 mt-1 flex items-center">
                <FontAwesomeIcon icon={faChartLine} className="text-xs mr-1" />
                {Math.ceil(stats.upcomingCount / 4)} upcoming IPOs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Upcoming IPO */}
          {featuredIPO && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Featured Upcoming IPO</h2>
              <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-5 border-r border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-lg mr-3">
                        {featuredIPO.company_name.split(' ').slice(0, 2).map(word => word[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-800">{featuredIPO.company_name}</h3>
                        <p className="text-xs text-gray-500">{featuredIPO.issue_type?.includes('SME') ? 'SME' : 'Mainboard'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {featuredIPO.company_name} is preparing for its initial public offering on the {featuredIPO.listing_at || 'BSE/NSE'} 
                      with an issue size of {featuredIPO.issue_size || 'TBA'}.
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faCalendar} className="text-gray-400 mr-2" />
                      <span>Expected: {featuredIPO.opening_date || 'Coming Soon'}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 border-r border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Key Highlights</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expected Issue Size</span>
                        <span className="text-sm font-medium text-gray-800">{featuredIPO.issue_size || 'TBA'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expected Price Range</span>
                        <span className="text-sm font-medium text-gray-800">{featuredIPO.issue_price || 'TBA'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Lot Size</span>
                        <span className="text-sm font-medium text-gray-800">{featuredIPO.lot_size ? `${featuredIPO.lot_size} Shares` : 'TBA'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Listing At</span>
                        <span className="text-sm font-medium text-gray-800">{featuredIPO.listing_at || 'TBA'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Market Sentiment</h4>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600">Investor Interest</span>
                        <span className="text-xs font-medium text-gray-800">Very High</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{width: '95%'}}></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600">Expected GMP</span>
                        <span className="text-xs font-medium text-gray-800">Strong</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{width: '80%'}}></div>
                      </div>
                    </div>
                    <Link href={`/ipo/${featuredIPO.ipo_id}`} className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                      View detailed analysis
                      <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-xs" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Upcoming IPOs List */}
          <div>
            {/* Opening This Week */}
            {openingThisWeek.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Opening This Week</h2>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
                    {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                
                {/* IPO Table */}
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Band</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Size</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Size</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Date</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close Date</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GMP</th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {openingThisWeek.map((ipo, idx) => {
                          const randomGmp = getRandomGMP();
                          // Generate a random color for the company icon
                          const colors = ['green', 'blue', 'orange', 'red', 'purple', 'yellow'];
                          const randomColor = colors[Math.floor(Math.random() * colors.length)];
                          const initials = ipo.company_name.split(' ').slice(0, 2).map(word => word[0]).join('');
                          
                          return (
                            <tr key={ipo.ipo_id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`h-8 w-8 bg-${randomColor}-100 rounded-md flex items-center justify-center text-${randomColor}-600 font-semibold text-sm mr-3`}>
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{ipo.company_name}</div>
                                    <div className="text-xs text-gray-500">{ipo.issue_type?.includes('SME') ? 'SME' : 'Mainboard'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.issue_price || 'TBA'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.issue_size || 'TBA'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.lot_size ? `${ipo.lot_size} shares` : 'TBA'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.opening_date}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.closing_date}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${randomGmp.includes('-') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                  {randomGmp}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/ipo/${ipo.ipo_id}`} className="text-blue-600 hover:text-blue-900">
                                  Apply
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            
            {/* Opening Next Week */}
            {openingNextWeek.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Opening Next Week</h2>
                  <div className="text-sm text-gray-500">
                    {nextWeekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
                    {nextWeekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Band</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Size</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Size</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Date</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close Date</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GMP</th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {openingNextWeek.map((ipo, idx) => {
                          // Generate a random color for the company icon
                          const colors = ['green', 'blue', 'orange', 'red', 'purple', 'yellow'];
                          const randomColor = colors[Math.floor(Math.random() * colors.length)];
                          const initials = ipo.company_name.split(' ').slice(0, 2).map(word => word[0]).join('');
                          
                          return (
                            <tr key={ipo.ipo_id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`h-8 w-8 bg-${randomColor}-100 rounded-md flex items-center justify-center text-${randomColor}-600 font-semibold text-sm mr-3`}>
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{ipo.company_name}</div>
                                    <div className="text-xs text-gray-500">{ipo.issue_type?.includes('SME') ? 'SME' : 'Mainboard'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.issue_price || 'TBA'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.issue_size || 'TBA'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.lot_size ? `${ipo.lot_size} shares` : 'TBA'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.opening_date}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ipo.closing_date}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="text-xs font-medium px-2 py-1 rounded bg-gray-50 text-gray-600">
                                  NA
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/ipo/${ipo.ipo_id}`} className="text-blue-600 hover:text-blue-900">
                                  Set Reminder
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            
            {/* Coming Soon IPOs */}
            {comingSoon.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Coming Soon</h2>
                  <div className="text-sm text-gray-500">
                    {new Date(nextWeekEnd.getTime() + 86400000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} and beyond
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {comingSoon.slice(0, 4).map((ipo, idx) => {
                    // Generate a random color for the company icon
                    const colors = ['green', 'blue', 'orange', 'red', 'purple', 'yellow'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    const initials = ipo.company_name.split(' ').slice(0, 2).map(word => word[0]).join('');
                    
                    return (
                      <div key={ipo.ipo_id} className="bg-white border border-gray-200 rounded-md overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <div className={`h-8 w-8 bg-${randomColor}-100 rounded-md flex items-center justify-center text-${randomColor}-600 font-semibold text-sm mr-2.5`}>
                              {initials}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-800">{ipo.company_name}</h3>
                              <p className="text-xs text-gray-500">{ipo.issue_type?.includes('SME') ? 'SME' : 'Mainboard'}</p>
                            </div>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Price Band</span>
                              <span className="text-xs font-medium text-gray-800">{ipo.issue_price || 'TBA'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Issue Size</span>
                              <span className="text-xs font-medium text-gray-800">{ipo.issue_size || 'TBA'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Expected Date</span>
                              <span className="text-xs font-medium text-gray-800">
                                {ipo.opening_date 
                                  ? new Date(ipo.opening_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                  : 'TBA'}
                              </span>
                            </div>
                          </div>
                          <Link href={`/ipo/${ipo.ipo_id}`} className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                            View Details
                            <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-[10px]" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Load More Button */}
                {comingSoon.length > 4 && (
                  <div className="text-center">
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md text-sm transition-colors duration-200">
                      Load More Upcoming IPOs
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* IPO Notifications */}
      <section className="bg-blue-50 border-t border-blue-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Never Miss an IPO</h2>
            <p className="text-sm text-gray-600 mb-4">Get notified when new IPOs are announced or when applications open</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition-colors duration-200">
                Get Notified
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 