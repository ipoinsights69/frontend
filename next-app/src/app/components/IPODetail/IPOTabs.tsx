'use client';

import React, { useState } from 'react';
import { formatDate } from '@/app/utils/dateUtils';
import OverviewTab from './tabs/OverviewTab';
import FinancialsTab from './tabs/FinancialsTab';
import SubscriptionTab from './tabs/SubscriptionTab';
import ListingTab from './tabs/ListingTab';
import DetailsTab from './tabs/DetailsTab';
import FAQsTab from './tabs/FAQsTab';
import { IPODetailedData } from '@/app/types/IPO';

interface IPOTabsProps {
  ipoData: IPODetailedData;
  formattedData?: Record<string, any>;
  config?: {
    sections: Record<string, boolean>;
    fieldsMapping: Record<string, Record<string, string>>;
    formatConfig: Record<string, any>;
  };
}

const IPOTabs: React.FC<IPOTabsProps> = ({ ipoData, formattedData = {}, config }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check which sections are available based on the config and data
  const sections = config?.sections || {
    overview: true,
    financials: true,
    subscription: true,
    company: true,
    allotment: true,
    faqs: true
  };
  
  // Determine which tabs to show based on available data
  const hasOverview = sections.overview;
  const hasFinancials = sections.financials && 
    (ipoData.financials || formattedData.financials?.data);
  const hasSubscription = sections.subscription && 
    (ipoData.overallSubscription || formattedData.subscription?.overall || 
     ipoData.subscription_details || formattedData.subscription?.dayWise);
  const hasCompany = sections.company && 
    (ipoData.description || formattedData.company?.description ||
     ipoData.business_segments || formattedData.company?.business);
  const hasListingPerformance = ipoData.status === 'listed' || 
    ipoData.listingPrice !== undefined;
  const hasFAQs = sections.faqs && 
    (ipoData.faqs && ipoData.faqs.length > 0 || formattedData.faqs?.items);
  
  // Define available tabs - show all tabs and handle missing data inside each component
  const tabs = [
    { id: 'overview', label: 'Overview', isAvailable: hasOverview },
    { id: 'company', label: 'Company', isAvailable: hasCompany },
    { id: 'financials', label: 'Financials', isAvailable: hasFinancials },
    { id: 'subscription', label: 'Subscription', isAvailable: hasSubscription },
    { id: 'listing', label: 'Listing Performance', isAvailable: hasListingPerformance },
    { id: 'allotment', label: 'Allotment', isAvailable: sections.allotment },
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
        {activeTab === 'overview' && 
          <OverviewTab 
            ipoData={ipoData} 
            formattedData={formattedData} 
            config={config} 
          />
        }
        {activeTab === 'company' && 
          <OverviewTab 
            ipoData={ipoData} 
            formattedData={formattedData} 
            config={config} 
            showCompanyInfo={true}
          />
        }
        {activeTab === 'financials' && 
          <FinancialsTab 
            ipoData={ipoData} 
            formattedData={formattedData} 
            config={config} 
          />
        }
        {activeTab === 'subscription' && 
          <SubscriptionTab 
            ipoData={ipoData} 
            formattedData={formattedData} 
            config={config} 
          />
        }
        {activeTab === 'listing' && 
          <ListingTab 
            ipoData={ipoData} 
            formattedData={formattedData} 
            config={config} 
          />
        }
        {activeTab === 'allotment' && 
          <DetailsTab 
            ipoData={ipoData} 
            formattedData={formattedData} 
            config={config} 
          />
        }
        {activeTab === 'faqs' && hasFAQs && 
          <FAQsTab 
            ipoData={ipoData} 
            formattedData={formattedData} 
            config={config} 
          />
        }
      </div>
    </section>
  );
};

export default IPOTabs; 