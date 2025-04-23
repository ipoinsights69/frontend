'use client';

import React, { useState } from 'react';
import { formatDate } from '@/app/utils/dateUtils';
import OverviewTab from './tabs/OverviewTab';
import FinancialsTab from './tabs/FinancialsTab';
import SubscriptionTab from './tabs/SubscriptionTab';
import ListingTab from './tabs/ListingTab';
import DetailsTab from './tabs/DetailsTab';
import FAQsTab from './tabs/FAQsTab';

interface IPOTabsProps {
  ipoData: any;
}

const IPOTabs: React.FC<IPOTabsProps> = ({ ipoData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Always show all tabs, and handle missing data within each tab component
  // This ensures users can access all sections even if some data is incomplete
  const hasOverview = true;
  const hasFinancials = true;
  const hasSubscription = true;
  const hasListingPerformance = true;
  const hasDetails = true;
  const hasFAQs = ipoData.faqs && ipoData.faqs.length > 0;
  
  // Define available tabs - show all tabs and handle missing data inside each component
  const tabs = [
    { id: 'overview', label: 'Overview', isAvailable: hasOverview },
    { id: 'financials', label: 'Financials', isAvailable: hasFinancials },
    { id: 'subscription', label: 'Subscription', isAvailable: hasSubscription },
    { id: 'listing', label: 'Listing Performance', isAvailable: hasListingPerformance },
    { id: 'details', label: 'IPO Details', isAvailable: hasDetails },
    { id: 'faqs', label: 'FAQs', isAvailable: hasFAQs }
  ].filter(tab => tab.isAvailable);
  
  // If the active tab is not available, default to the first available tab
  if (!tabs.some(tab => tab.id === activeTab) && tabs.length > 0) {
    setActiveTab(tabs[0].id);
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex overflow-x-auto hide-scrollbar space-x-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button whitespace-nowrap pb-2 px-1 text-sm font-medium transition duration-150 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content-container">
        {activeTab === 'overview' && <OverviewTab ipoData={ipoData} />}
        {activeTab === 'financials' && <FinancialsTab ipoData={ipoData} />}
        {activeTab === 'subscription' && <SubscriptionTab ipoData={ipoData} />}
        {activeTab === 'listing' && <ListingTab ipoData={ipoData} />}
        {activeTab === 'details' && <DetailsTab ipoData={ipoData} />}
        {activeTab === 'faqs' && hasFAQs && <FAQsTab ipoData={ipoData} />}
      </div>
    </section>
  );
};

export default IPOTabs; 