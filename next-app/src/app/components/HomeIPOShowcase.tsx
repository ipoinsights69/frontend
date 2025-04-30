"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { IPO } from '@/app/types/IPO';
import IPOTable from './IPOTable';

interface HomeIPOShowcaseProps {
  upcomingIPOs: IPO[];
  topPerformingIPOs: IPO[];
  topLosingIPOs: IPO[];
  recentlyListedIPOs: IPO[];
  closedIPOs: IPO[];
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

  // Limit all IPO arrays to max 5 items
  const limitedUpcomingIPOs = upcomingIPOs.slice(0, 5);
  const limitedTopPerformingIPOs = topPerformingIPOs.slice(0, 5);
  const limitedTopLosingIPOs = topLosingIPOs.slice(0, 5);
  const limitedRecentlyListedIPOs = recentlyListedIPOs.slice(0, 5);
  const limitedClosedIPOs = closedIPOs.slice(0, 5);

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

  // Table column definitions
  const upcomingIPOColumns = [
    { key: 'company', label: 'Company' },
    { key: 'date', label: 'Open/Close Date' },
    { key: 'price', label: 'Price Range' },
    { key: 'issueSize', label: 'Issue Size' }
  ];

  const topPerformingColumns = [
    { key: 'company', label: 'Company' },
    { key: 'price', label: 'Issue Price' },
    { key: 'listingGain', label: 'Listing Gain' }
  ];

  const topLosingColumns = [
    { key: 'company', label: 'Company' },
    { key: 'price', label: 'Issue Price' },
    { key: 'listingGain', label: 'Listing Loss' }
  ];

  const recentlyListedColumns = [
    { key: 'company', label: 'Company' },
    { key: 'date', label: 'Listing Date' },
    { key: 'price', label: 'Issue Price' },
    { key: 'listingGain', label: 'Gain/Loss' }
  ];

  const closedIPOColumns = [
    { key: 'company', label: 'Company' },
    { key: 'date', label: 'Closed On' },
    { key: 'price', label: 'Issue Price' },
    { key: 'issueSize', label: 'Issue Size' }
  ];

  return (
    <div className="py-8 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        {/* Upcoming IPOs Table */}
        <IPOTable
          title="Upcoming IPOs"
          description="Hot opportunities in the primary market"
          ipos={limitedUpcomingIPOs}
          columns={upcomingIPOColumns}
          viewAllLink="/upcoming-ipos"
        />

        {/* Top Performing IPOs Table */}
        <IPOTable
          title="Top Performing IPOs"
          description="Best performing stocks in the market"
          ipos={limitedTopPerformingIPOs}
          columns={topPerformingColumns}
          viewAllLink="/trending-ipos"
        />

        {/* Recently Listed IPOs Table */}
        <IPOTable
          title="Recently Listed IPOs"
          description="Latest entries in the stock market"
          ipos={limitedRecentlyListedIPOs}
          columns={recentlyListedColumns}
          viewAllLink="/recent-ipos"
        />

        {/* Open/Closed IPOs Table */}
        <IPOTable
          title="Open/Closed IPOs"
          description="IPOs in allotment phase"
          ipos={limitedClosedIPOs}
          columns={closedIPOColumns}
          viewAllLink="/closed-ipos"
        />

        {/* IPO FAQ Section */}
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8 mx-4">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">IPO FAQ</h3>
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
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center mx-4 mb-8">
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
