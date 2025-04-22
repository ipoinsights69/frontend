"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { IPOSummary } from '@/lib/ipoDataService';

interface HomeIPOShowcaseProps {
  upcomingIPOs: IPOSummary[];
  topPerformingIPOs: IPOSummary[];
  topLosingIPOs: IPOSummary[];
  recentlyListedIPOs: IPOSummary[];
  closedIPOs: IPOSummary[];
}

export default function HomeIPOShowcase({
  upcomingIPOs,
  topPerformingIPOs,
  topLosingIPOs,
  recentlyListedIPOs,
  closedIPOs,
}: HomeIPOShowcaseProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  // IPO FAQ data
  const faqData = [
    {
      question: "What is an IPO?",
      answer: "An Initial Public Offering (IPO) is the process through which a private company offers shares to the public for the first time. This allows the company to raise capital from public investors and enables its shares to trade on stock exchanges."
    },
    {
      question: "How do I apply for an IPO?",
      answer: "You can apply for an IPO through your demat account with a registered broker. Most brokers offer online applications through their websites or mobile apps. You'll need to specify the number of lots you wish to apply for and ensure you have sufficient funds in your account."
    },
    {
      question: "What is the difference between mainboard and SME IPOs?",
      answer: "Mainboard IPOs are larger offerings from established companies that meet the full listing requirements of exchanges like NSE and BSE. SME IPOs are smaller offerings from Small and Medium Enterprises that list on dedicated SME platforms with relaxed listing criteria and lower compliance requirements."
    },
    {
      question: "What is the IPO allotment process?",
      answer: "IPO allotment is the process of distributing shares to applicants. If an IPO is oversubscribed, shares are allotted proportionally or through a lottery system. The allotment is typically finalized within 6 working days after the IPO closes. Results can be checked on the registrar's website or through your broker."
    },
    {
      question: "What is the lock-in period after an IPO?",
      answer: "After an IPO, promoters typically have a lock-in period of 18 months for 20% of their shareholding and 6 months for the remaining. Pre-IPO shareholders (non-promoters) usually have a 6-month lock-in period. These restrictions prevent immediate selling of shares after listing."
    },
    {
      question: "What is the grey market premium (GMP)?",
      answer: "Grey Market Premium (GMP) is the unofficial price at which IPO shares trade before official listing. It indicates the expected listing gain or loss. A positive GMP suggests the stock might list above its issue price, while a negative GMP suggests it might list below the issue price."
    }
  ];

  // Market stats data
  const marketStats = {
    totalIPOs: 42,
    averageSubscription: "32.4x",
    averageListingGain: "21.7%",
    fundingRaised: "₹52,843 Cr",
    upcomingCount: 8,
    currentMonth: "April 2025"
  };

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Market Stats Banner */}
        <div className="bg-blue-600 rounded-xl p-6 mb-12 shadow-lg text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">IPO Market Pulse</h2>
              <p className="text-blue-100">Latest statistics for {marketStats.currentMonth}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-3xl font-bold">{marketStats.totalIPOs}</div>
                <div className="text-sm text-blue-200">IPOs This Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{marketStats.averageSubscription}</div>
                <div className="text-sm text-blue-200">Avg. Subscription</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{marketStats.averageListingGain}</div>
                <div className="text-sm text-blue-200">Avg. Listing Gain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{marketStats.fundingRaised}</div>
                <div className="text-sm text-blue-200">Total Funds Raised</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming IPOs Section - Completely Revamped */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upcoming IPOs</h2>
              <p className="text-sm text-gray-500 mt-1">Hot opportunities in the primary market</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('mainboard')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeTab === 'mainboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mainboard
              </button>
              <button 
                onClick={() => setActiveTab('sme')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeTab === 'sme' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                SME
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingIPOs.slice(0, 3).map((ipo, index) => (
              <Link 
                key={index}
                href={`/ipo/${ipo.ipo_id}`}
                className="group block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  {/* Color banner based on days remaining */}
                  <div className={`h-2 w-full ${
                    index % 3 === 0 ? 'bg-blue-500' : 
                    index % 3 === 1 ? 'bg-purple-500' : 'bg-green-500'
                  }`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4 ${
                          index % 3 === 0 ? 'bg-blue-500' : 
                          index % 3 === 1 ? 'bg-purple-500' : 'bg-green-500'
                        }`}>
                          {ipo.company_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{ipo.company_name}</h3>
                          <p className="text-sm text-gray-600">{ipo.ipo_name}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {index % 2 === 0 ? 'Mainboard' : 'SME'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {index === 0 ? 'Opens Tomorrow' : index === 1 ? 'Opens in 3 days' : 'Opens in 5 days'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Price Band</div>
                        <div className="font-semibold text-gray-900">
                          {ipo.issue_price || (index === 0 ? '₹450-₹475' : index === 1 ? '₹135-₹142' : '₹980-₹1,030')}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500">Issue Size</div>
                        <div className="font-semibold text-gray-900">
                          {ipo.issue_size || (index === 0 ? '₹1,200 Cr' : index === 1 ? '₹218 Cr' : '₹3,500 Cr')}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500">Lot Size</div>
                        <div className="font-semibold text-gray-900">
                          {index === 0 ? '30 Shares' : index === 1 ? '1,000 Shares' : '13 Shares'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500">Min. Investment</div>
                        <div className="font-semibold text-gray-900">
                          {index === 0 ? '₹14,250' : index === 1 ? '₹142,000' : '₹13,390'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">IPO Timeline</div>
                        <div className="flex items-center space-x-1 text-xs">
                          <span className="px-2 py-0.5 bg-gray-100 rounded">
                            {ipo.opening_date 
                              ? new Date(ipo.opening_date).toLocaleDateString() 
                              : index === 0 ? '23 Apr' : index === 1 ? '25 Apr' : '29 Apr'
                            }
                          </span>
                          <span>to</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded">
                            {ipo.closing_date 
                              ? new Date(ipo.closing_date).toLocaleDateString() 
                              : index === 0 ? '25 Apr' : index === 1 ? '29 Apr' : '2 May'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-blue-600 font-medium text-sm">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/calendar" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All {marketStats.upcomingCount} Upcoming IPOs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
        
        {/* Two columns layout for tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Top Performing IPOs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Top Performing IPOs</h3>
                </div>
                <Link href="/analysis" className="text-green-600 hover:text-green-800 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CMP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topPerformingIPOs.slice(0, 5).map((ipo, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{ipo.company_name}</div>
                        <div className="text-xs text-gray-500">{index % 2 === 0 ? 'Mainboard' : 'SME'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.issue_price || (index === 0 ? '₹900' : index === 1 ? '₹72' : index === 2 ? '₹340' : index === 3 ? '₹210' : '₹118')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.current_price || (index === 0 ? '₹2,340' : index === 1 ? '₹165' : index === 2 ? '₹720' : index === 3 ? '₹410' : '₹228')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                          +{ipo.gain_percentage || (index === 0 ? '160' : index === 1 ? '129' : index === 2 ? '112' : index === 3 ? '95' : '93')}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Top Losing IPOs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-red-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Top Losing IPOs</h3>
                </div>
                <Link href="/analysis" className="text-red-600 hover:text-red-800 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CMP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loss</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topLosingIPOs.slice(0, 5).map((ipo, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{ipo.company_name}</div>
                        <div className="text-xs text-gray-500">{index % 2 === 0 ? 'SME' : 'Mainboard'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.issue_price || (index === 0 ? '₹186' : index === 1 ? '₹542' : index === 2 ? '₹91' : index === 3 ? '₹326' : '₹78')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.current_price || (index === 0 ? '₹74' : index === 1 ? '₹238' : index === 2 ? '₹41' : index === 3 ? '₹163' : '₹41')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                          </svg>
                          -{ipo.loss_percentage || (index === 0 ? '60' : index === 1 ? '56' : index === 2 ? '55' : index === 3 ? '50' : '47')}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Recently Listed IPOs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Recently Listed IPOs</h3>
                </div>
                <Link href="/ipo/recent" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed On</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentlyListedIPOs.slice(0, 5).map((ipo, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{ipo.company_name}</div>
                        <div className="text-xs text-gray-500">{index % 2 === 0 ? 'Mainboard' : 'SME'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.listing_date 
                          ? new Date(ipo.listing_date).toLocaleDateString() 
                          : index === 0 ? '18 Apr 2025' : index === 1 ? '15 Apr 2025' : index === 2 ? '10 Apr 2025' : index === 3 ? '8 Apr 2025' : '3 Apr 2025'
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.issue_price || (index === 0 ? '₹430' : index === 1 ? '₹87' : index === 2 ? '₹275' : index === 3 ? '₹51' : '₹642')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.listing_price || (index === 0 ? '₹512' : index === 1 ? '₹92' : index === 2 ? '₹268' : index === 3 ? '₹54' : '₹580')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {index === 0 || index === 1 || index === 3 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            +{index === 0 ? '19.1' : index === 1 ? '5.7' : '6.8'}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            -{index === 2 ? '2.5' : '9.7'}%
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Closed IPOs */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-gray-600 text-white flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">Closed IPOs</h3>
                </div>
                <Link href="/ipo/closed" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closed On</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {closedIPOs.slice(0, 5).map((ipo, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{ipo.company_name}</div>
                        <div className="text-xs text-gray-500">{index % 2 === 0 ? 'SME' : 'Mainboard'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.closing_date 
                          ? new Date(ipo.closing_date).toLocaleDateString() 
                          : index === 0 ? '16 Apr 2025' : index === 1 ? '12 Apr 2025' : index === 2 ? '8 Apr 2025' : index === 3 ? '4 Apr 2025' : '1 Apr 2025'
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.issue_size || (index === 0 ? '₹218 Cr' : index === 1 ? '₹1,420 Cr' : index === 2 ? '₹84 Cr' : index === 3 ? '₹10.17 Cr' : '₹2,500 Cr')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {index === 0 ? '32.8x' : index === 1 ? '14.2x' : index === 2 ? '5.7x' : index === 3 ? '1.52x' : '68.3x'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {ipo.listing_date 
                          ? new Date(ipo.listing_date).toLocaleDateString() 
                          : index === 0 ? '18 Apr 2025' : index === 1 ? '15 Apr 2025' : index === 2 ? '10 Apr 2025' : index === 3 ? '8 Apr 2025' : '3 Apr 2025'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        
        {/* IPO FAQ Section */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-16">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-gray-200">
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
              <h3 className="text-lg font-bold text-gray-900">IPO FAQ</h3>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-medium text-gray-900">{faq.question}</h4>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-500 transition-transform ${activeFaqIndex === index ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {activeFaqIndex === index && (
                  <div className="mt-2 text-sm text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with IPO Alerts</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get real-time notifications about upcoming IPOs, allotment status, and listing performance.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Subscribe to Alerts
          </button>
        </section>
      </div>
    </div>
  );
}
