'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IPO, IPOStats } from '@/app/types/IPO';
import Search from '@/app/components/Search';

interface HomeLayoutProps {
  stats: IPOStats;
  upcomingIPOs: IPO[];
  openIPOs: IPO[];
  closedIPOs: IPO[];
  recentIPOs: IPO[];
  trendingIPOs: IPO[];
}

export default function HomeLayout({
  stats,
  upcomingIPOs,
  openIPOs,
  closedIPOs,
  recentIPOs,
  trendingIPOs
}: HomeLayoutProps) {
  // Format a number with a + sign if positive
  const formatNumber = (num?: number) => {
    if (num === undefined || isNaN(Number(num))) return '--';
    return num >= 0 ? `+${num.toFixed(1)}%` : `${num.toFixed(1)}%`;
  };

  // Format currency in a readable way
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || isNaN(Number(amount))) return '--';
    return `₹${amount.toLocaleString('en-IN')} Cr`;
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '--';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  // Get appropriate color for returns
  const getReturnColor = (value?: number) => {
    if (value === undefined) return 'text-gray-500';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with Value Proposition */}
      <section className="bg-blue-600 text-white py-6 md:py-10 border-b border-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-xl md:text-3xl font-bold mb-2">
              India's Hub for IPO Information, Analysis & Tracking
            </h1>
            <p className="text-blue-100 mb-6 text-sm md:text-base">
              Get real-time insights on ongoing, upcoming, and listed IPOs in the Indian market
            </p>
            
            <Search />
          </div>
        </div>
      </section>

      {/* Market Overview Stats */}
      <section className="border-b border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="container mx-auto py-4 px-4 overflow-x-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 min-w-[600px] md:min-w-0">
            <div className="text-center p-2">
              <p className="text-xs md:text-sm text-gray-500 mb-1">Total IPOs ({stats.currentYear})</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">{stats.totalIPOs || stats.activeCount || '--'}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-xs md:text-sm text-gray-500 mb-1">Open IPOs</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">{stats.openIPOs || '--'}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-xs md:text-sm text-gray-500 mb-1">Upcoming IPOs</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">{stats.upcomingCount || '--'}</p>
            </div>
            <div className="text-center p-2">
              <p className="text-xs md:text-sm text-gray-500 mb-1">Average Return</p>
              <p className={`text-lg md:text-xl font-bold ${getReturnColor(stats.averageReturn)}`}>
                {formatNumber(stats.averageReturn)}
              </p>
            </div>
            <div className="text-center p-2">
              <p className="text-xs md:text-sm text-gray-500 mb-1">Capital Raised</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">
                {stats.totalRaisedFormatted || formatCurrency(stats.totalRaisedCrore)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto py-6 px-4">
        {/* Live/Currently Open IPOs Section */}
        {openIPOs.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Current Open IPOs
              </h2>
              {openIPOs.length > 5 && (
                <Link href="/open-ipos" className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View All
                </Link>
              )}
            </div>
            
            {/* Mobile version - cards */}
            <div className="md:hidden space-y-4">
              {openIPOs.slice(0, 3).map((ipo) => (
                <Link key={ipo.id} href={`/ipo/${ipo.id}`}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden p-4">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium">
                        {ipo.companyName.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{ipo.companyName}</p>
                        {ipo.industry && <p className="text-xs text-gray-500 truncate">{ipo.industry}</p>}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Open
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Price Band</p>
                        <p className="text-sm font-medium text-gray-800">
                          {ipo.priceRange ? `₹${ipo.priceRange.min} - ₹${ipo.priceRange.max}` : 
                           ipo.cutOffPrice ? `₹${ipo.cutOffPrice}` : 
                           ipo.issuePrice ? ipo.issuePrice : '--'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Issue Size</p>
                        <p className="text-sm font-medium text-gray-800">{ipo.issueSize ? `₹${ipo.issueSize} Cr` : '--'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Closes On</p>
                        <p className="text-sm font-medium text-gray-800">{formatDate(ipo.closeDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Lot Size</p>
                        <p className="text-sm font-medium text-gray-800">{ipo.lotSize || '--'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Desktop version - table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Band (₹)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Size</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Size</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close Date</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {openIPOs.slice(0, 5).map((ipo) => (
                      <tr key={ipo.id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                              {ipo.companyName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{ipo.companyName}</div>
                              {ipo.industry && <div className="text-xs text-gray-500">{ipo.industry}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ipo.priceRange ? `₹${ipo.priceRange.min} - ₹${ipo.priceRange.max}` : 
                             ipo.cutOffPrice ? `₹${ipo.cutOffPrice}` : 
                             ipo.issuePrice ? ipo.issuePrice : '--'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{ipo.issueSize ? `₹${ipo.issueSize} Cr` : '--'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{ipo.lotSize || '--'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(ipo.closeDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link 
                            href={`/ipo/${ipo.id}`} 
                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming IPOs Section */}
        {upcomingIPOs.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Upcoming IPOs
              </h2>
              {upcomingIPOs.length > 6 && (
                <Link href="/upcoming-ipos" className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View All
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingIPOs.slice(0, 6).map((ipo) => (
                <Link key={ipo.id} href={`/ipo/${ipo.id}`}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden h-full">
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                          {ipo.companyName.charAt(0)}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{ipo.companyName}</p>
                          {ipo.industry && <p className="text-xs text-gray-500 truncate">{ipo.industry}</p>}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {ipo.openDate && (
                          <div>
                            <p className="text-xs text-gray-500">Opens On</p>
                            <p className="text-sm font-medium text-gray-800">{formatDate(ipo.openDate)}</p>
                          </div>
                        )}
                        {ipo.issueSize && (
                          <div>
                            <p className="text-xs text-gray-500">Issue Size</p>
                            <p className="text-sm font-medium text-gray-800">{`₹${ipo.issueSize} Cr`}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recently Listed IPOs Section */}
        {recentIPOs.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                Recently Listed IPOs
              </h2>
              {recentIPOs.length > 5 && (
                <Link href="/recent-ipos" className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View All
                </Link>
              )}
            </div>
            
            {/* Mobile version - cards */}
            <div className="md:hidden space-y-4">
              {recentIPOs.slice(0, 3).map((ipo) => (
                <Link key={ipo.id} href={`/ipo/${ipo.id}`}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden p-4">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                        {ipo.companyName.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{ipo.companyName}</p>
                        {ipo.industry && <p className="text-xs text-gray-500 truncate">{ipo.industry}</p>}
                      </div>
                      {ipo.listingGainPercentage !== undefined && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ipo.listingGainPercentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {ipo.listingGainPercentage >= 0 ? '+' : ''}{ipo.listingGainPercentage.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Listed On</p>
                        <p className="text-sm font-medium text-gray-800">{formatDate(ipo.listingDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Issue Price</p>
                        <p className="text-sm font-medium text-gray-800">
                          {ipo.issuePrice || (ipo.priceRange ? `₹${ipo.priceRange.max}` : '--')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Issue Size</p>
                        <p className="text-sm font-medium text-gray-800">{ipo.issueSize ? `₹${ipo.issueSize} Cr` : '--'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Desktop version - table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed On</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Size</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing Gain</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentIPOs.slice(0, 5).map((ipo) => (
                      <tr key={ipo.id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                              {ipo.companyName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{ipo.companyName}</div>
                              {ipo.industry && <div className="text-xs text-gray-500">{ipo.industry}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(ipo.listingDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ipo.issuePrice || (ipo.priceRange ? `₹${ipo.priceRange.max}` : '--')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{ipo.issueSize ? `₹${ipo.issueSize} Cr` : '--'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ipo.listingGainPercentage !== undefined ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ipo.listingGainPercentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {ipo.listingGainPercentage >= 0 ? '+' : ''}{ipo.listingGainPercentage.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">--</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link 
                            href={`/ipo/${ipo.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-purple-600 text-xs font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Top Performing IPOs Section */}
        {trendingIPOs.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Top Performing IPOs
              </h2>
              <Link href="/top-performing-ipos" className="text-blue-600 text-sm font-medium hover:text-blue-800">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trendingIPOs.slice(0, 3).map((ipo) => (
                <Link key={ipo.id} href={`/ipo/${ipo.id}`}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden h-full">
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium">
                          {ipo.companyName.charAt(0)}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{ipo.companyName}</p>
                          {ipo.industry && <p className="text-xs text-gray-500 truncate">{ipo.industry}</p>}
                        </div>
                        {ipo.listingGainPercentage !== undefined && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ipo.listingGainPercentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {ipo.listingGainPercentage >= 0 ? '+' : ''}{ipo.listingGainPercentage.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Listed On</p>
                          <p className="text-sm font-medium text-gray-800">{formatDate(ipo.listingDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Issue Price</p>
                          <p className="text-sm font-medium text-gray-800">
                            {ipo.issuePrice || (ipo.priceRange ? `₹${ipo.priceRange.max}` : '--')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Educational/CTA Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg overflow-hidden text-white p-6">
              <h3 className="text-xl font-bold mb-2">Stay Updated with IPO Alerts</h3>
              <p className="mb-4 text-blue-100">Get real-time notifications about upcoming IPOs, allotment status updates, and listing performance.</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition-colors">
                Subscribe to Alerts
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">New to IPO Investing?</h3>
              <p className="mb-4 text-gray-600">Learn the basics of IPO investments, application process, and strategies to maximize your returns.</p>
              <Link href="/guides/ipo-basics" className="inline-block text-blue-600 font-medium hover:text-blue-800">
                Read our Guide <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Expert Analysis Section - EEAT */}
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Expert Market Analysis</h2>
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Current IPO Market Trends</h3>
              </div>
              <p className="text-gray-700 text-sm">
                The Indian IPO market has shown remarkable resilience in 2025, with the total capital raised already exceeding ₹42,000 crore. The trend indicates strong investor appetite, particularly in sectors like technology, renewable energy, and manufacturing.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Key Sectors to Watch</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-blue-50 p-3 rounded text-center">
                  <span className="text-xs font-medium text-blue-700 block">Renewable Energy</span>
                  <span className="text-sm text-blue-600 block mt-1">+18.5%</span>
                </div>
                <div className="bg-green-50 p-3 rounded text-center">
                  <span className="text-xs font-medium text-green-700 block">Healthcare</span>
                  <span className="text-sm text-green-600 block mt-1">+15.2%</span>
                </div>
                <div className="bg-purple-50 p-3 rounded text-center">
                  <span className="text-xs font-medium text-purple-700 block">Technology</span>
                  <span className="text-sm text-purple-600 block mt-1">+23.7%</span>
                </div>
                <div className="bg-orange-50 p-3 rounded text-center">
                  <span className="text-xs font-medium text-orange-700 block">Manufacturing</span>
                  <span className="text-sm text-orange-600 block mt-1">+10.8%</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 italic">
              Data based on average listing day gains of IPOs in the last 12 months. Updated as of {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </div>
          </div>
        </section>

        {/* IPO Educational Resource Section - EEAT */}
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">IPO Knowledge Base</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IPO Application Process</h3>
              <p className="text-sm text-gray-600 mb-3">Learn the step-by-step process of applying for IPOs through UPI, ASBA, and other methods.</p>
              <Link href="/guides/ipo-application" className="text-xs text-blue-600 font-medium">Read More →</Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Evaluating IPO Fundamentals</h3>
              <p className="text-sm text-gray-600 mb-3">Understand key metrics like P/E ratio, revenue growth, and industry comparison to assess IPO valuations.</p>
              <Link href="/guides/ipo-evaluation" className="text-xs text-blue-600 font-medium">Read More →</Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IPO Glossary</h3>
              <p className="text-sm text-gray-600 mb-3">Complete guide to IPO terminology from DRHP to GMP, listing gains, lot size, and more.</p>
              <Link href="/guides/ipo-glossary" className="text-xs text-blue-600 font-medium">Read More →</Link>
            </div>
          </div>
        </section>

        {/* FAQ Section - Mobile Accordion */}
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-200">
              <details className="group p-4 md:p-6">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm md:text-base">
                  <span className="text-gray-800">What is an IPO and how does it work?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 text-xs md:text-sm">
                  <p>An Initial Public Offering (IPO) is the process by which a private company offers shares to the public for the first time. Companies typically use IPOs to raise capital for expansion, pay off debt, or provide liquidity to existing shareholders.</p>
                  <p className="mt-2">In India, the IPO process involves filing a Draft Red Herring Prospectus (DRHP) with SEBI, marketing the offering through roadshows, and then opening the subscription period for investors. After subscription closes and shares are allotted, the stock is listed on exchanges like NSE and BSE for public trading.</p>
                </div>
              </details>
              <details className="group p-4 md:p-6">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm md:text-base">
                  <span className="text-gray-800">How can I apply for an IPO in India?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 text-xs md:text-sm">
                  <p>You can apply for an IPO through multiple channels:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Through your online trading account (recommended)</li>
                    <li>Via your bank's net banking portal if they offer IPO services</li>
                    <li>Through the UPI mechanism using apps like BHIM, PhonePe, or Google Pay</li>
                    <li>By filling a physical ASBA form at your bank branch</li>
                  </ul>
                  <p className="mt-2">To apply, you'll need a demat account, PAN card, and sufficient funds blocked in your bank account through the ASBA facility.</p>
                </div>
              </details>
              <details className="group p-4 md:p-6">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm md:text-base">
                  <span className="text-gray-800">What factors should I consider before investing in an IPO?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 text-xs md:text-sm">
                  <p>Before investing in an IPO, consider these key factors:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="font-medium text-blue-600">Company Fundamentals</span>
                      <p className="mt-1">Review financial performance, revenue growth, profitability, and debt levels.</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="font-medium text-blue-600">Business Model</span>
                      <p className="mt-1">Understand how the company makes money and if the model is sustainable.</p>
                    </div>
                  </div>
                  <p className="mt-3">Additionally, read the prospectus carefully, especially the risk factors section, and consider your own investment goals and risk tolerance.</p>
                </div>
              </details>
              <details className="group p-4 md:p-6">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm md:text-base">
                  <span className="text-gray-800">What is Grey Market Premium (GMP) in IPOs?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 text-xs md:text-sm">
                  <p>Grey Market Premium (GMP) is the premium amount at which IPO shares are traded in the unofficial/grey market before they are listed on stock exchanges. It indicates market sentiment and potential listing gains.</p>
                  <p className="mt-2">For example, if an IPO is priced at ₹500 per share and has a GMP of ₹100, it suggests the grey market expects the share to list at around ₹600.</p>
                  <p className="mt-2 text-yellow-600">Important: GMP is unofficial and unregulated. It can fluctuate significantly and shouldn't be the sole factor for investment decisions.</p>
                </div>
              </details>
              <details className="group p-4 md:p-6">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm md:text-base">
                  <span className="text-gray-800">How are IPO shares allotted if an issue is oversubscribed?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 text-xs md:text-sm">
                  <p>When an IPO is oversubscribed, shares are allotted through a proportionate or lottery system:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Applications are categorized by investor category (Retail, QIB, NII)</li>
                    <li>Within each category, a computerized draw or proportionate allocation is used</li>
                    <li>Retail investors have the highest chance of receiving at least minimum lot</li>
                    <li>In extreme oversubscription, many applicants may not receive any shares</li>
                  </ol>
                  <p className="mt-2">SEBI ensures the allocation process is fair and transparent, with no preferential treatment to any investor within the same category.</p>
                </div>
              </details>
              <details className="group p-4 md:p-6">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm md:text-base">
                  <span className="text-gray-800">What is the difference between Mainboard and SME IPOs?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-600 mt-3 text-xs md:text-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-2 text-left">Parameter</th>
                          <th className="p-2 text-left">Mainboard IPOs</th>
                          <th className="p-2 text-left">SME IPOs</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-2 font-medium">Issue Size</td>
                          <td className="p-2">Typically over ₹100 crore</td>
                          <td className="p-2">Between ₹5-25 crore</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-2 font-medium">Minimum Application</td>
                          <td className="p-2">₹10,000-15,000</td>
                          <td className="p-2">₹1-2 lakh</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-2 font-medium">Listing Platform</td>
                          <td className="p-2">NSE/BSE Main Platform</td>
                          <td className="p-2">NSE Emerge/BSE SME</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Risk Level</td>
                          <td className="p-2">Moderate</td>
                          <td className="p-2">Higher</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Trust Signals Section - EEAT */}
        <section className="mb-10">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Why Investors Trust IPOHut</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Verified Data</p>
                <p className="text-xs text-gray-600 mt-1">Information sourced directly from SEBI filings & exchanges</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Real-time Updates</p>
                <p className="text-xs text-gray-600 mt-1">Data refreshed every 5 minutes during market hours</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Comprehensive Analysis</p>
                <p className="text-xs text-gray-600 mt-1">Over 1000+ IPOs covered with detailed insights</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Educational Focus</p>
                <p className="text-xs text-gray-600 mt-1">Helping 100,000+ investors make informed decisions</p>
              </div>
            </div>
          </div>
        </section>
      </div>

    </main>
  );
} 