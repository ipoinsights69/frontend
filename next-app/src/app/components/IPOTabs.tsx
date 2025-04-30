'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IPO } from '@/app/types/IPO';
import IPOCard from './IPOCard';

interface IPOTabsProps {
  trendingIPOs: IPO[];
  upcomingIPOs: IPO[];
  recentIPOs: IPO[];
  closedIPOs: IPO[];
}

type TabType = 'trending' | 'upcoming' | 'recent' | 'closed';

const IPOTabs: React.FC<IPOTabsProps> = ({
  trendingIPOs,
  upcomingIPOs,
  recentIPOs,
  closedIPOs
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('trending');

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Limit to 3 IPOs per tab for the hero section
  const getTabContent = () => {
    switch (activeTab) {
      case 'trending':
        return {
          items: trendingIPOs.slice(0, 3),
          viewAllLink: '/trending-ipos',
          linkText: 'View all trending IPOs'
        };
      case 'upcoming':
        return {
          items: upcomingIPOs.slice(0, 3),
          viewAllLink: '/upcoming-ipos',
          linkText: 'View all upcoming IPOs'
        };
      case 'recent':
        return {
          items: recentIPOs.slice(0, 3),
          viewAllLink: '/recent-ipos',
          linkText: 'View all recently listed IPOs'
        };
      case 'closed':
        return {
          items: closedIPOs.slice(0, 3),
          viewAllLink: '/closed-ipos',
          linkText: 'View all closed IPOs'
        };
    }
  };

  const content = getTabContent();

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          className={`tab-button flex-1 px-4 py-3 font-medium text-sm ${
            activeTab === 'trending'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => changeTab('trending')}
        >
          Trending IPOs
        </button>
        <button
          className={`tab-button flex-1 px-4 py-3 font-medium text-sm ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => changeTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`tab-button flex-1 px-4 py-3 font-medium text-sm ${
            activeTab === 'recent'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => changeTab('recent')}
        >
          Recently Listed
        </button>
        <button
          className={`tab-button flex-1 px-4 py-3 font-medium text-sm ${
            activeTab === 'closed'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => changeTab('closed')}
        >
          Closed
        </button>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-5 px-6 py-3">Company</div>
        <div className="col-span-3 px-6 py-3">Date</div>
        <div className="col-span-2 px-6 py-3 text-right">Price</div>
        <div className="col-span-2 px-6 py-3 text-right">Status</div>
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {content.items.length > 0 ? (
          <>
            {content.items.map((ipo) => (
              <IPOCard key={ipo.id} ipo={ipo} />
            ))}
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No IPOs found in this category.
          </div>
        )}

        {/* View more link */}
        <div className="px-6 py-3 flex justify-center border-t border-gray-100">
          <Link href={content.viewAllLink} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            {content.linkText}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IPOTabs; 