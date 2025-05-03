'use client';

import { useState, useEffect } from 'react';
import { IPODetailedData } from '@/app/types/IPO';
import HeroSection from '@/components/IPODetail/sections/HeroSection';
import StickyCard from '@/components/IPODetail/sections/StickyCard';
import OverviewTab from '@/components/IPODetail/tabs/OverviewTab';
import FinancialsTab from '@/components/IPODetail/tabs/FinancialsTab';
import SubscriptionTab from '@/components/IPODetail/tabs/SubscriptionTab';
import ListingTab from '@/components/IPODetail/tabs/ListingTab';
import DetailsTab from '@/components/IPODetail/tabs/DetailsTab';
import FAQsTab from '@/components/IPODetail/tabs/FAQsTab';
import RelatedIPOs from '@/components/IPODetail/sections/RelatedIPOs';
import IPODisclaimer from '@/components/common/IPODisclaimer';
import DataProviders from '@/components/common/DataProviders';

interface IPODetailPageProps {
  ipoData: IPODetailedData;
}

export function IPODetailPage({ ipoData }: IPODetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If active tab is 'listing', switch to overview since we've removed that tab
    if (activeTab === 'listing') {
      setActiveTab('overview');
    }
  }, [activeTab]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Sticky Summary Card */}
      <section className="bg-white border-b border-gray-200 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <HeroSection data={ipoData} />
            </div>

            {/* Sticky Summary Card */}
            <div className="w-full lg:w-1/3">
              <StickyCard data={ipoData} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex overflow-x-auto hide-scrollbar space-x-6">
            <button 
              className={`whitespace-nowrap pb-2 px-1 text-sm font-medium border-b-2 transition duration-150 ${
                activeTab === 'overview' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`whitespace-nowrap pb-2 px-1 text-sm font-medium border-b-2 transition duration-150 ${
                activeTab === 'financials' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('financials')}
            >
              Financials
            </button>
            <button 
              className={`whitespace-nowrap pb-2 px-1 text-sm font-medium border-b-2 transition duration-150 ${
                activeTab === 'subscription' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('subscription')}
            >
              Subscription
            </button>
            <button 
              className={`whitespace-nowrap pb-2 px-1 text-sm font-medium border-b-2 transition duration-150 ${
                activeTab === 'details' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              IPO Details
            </button>
            <button 
              className={`whitespace-nowrap pb-2 px-1 text-sm font-medium border-b-2 transition duration-150 ${
                activeTab === 'faqs' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content-container">
          {activeTab === 'overview' && <OverviewTab data={ipoData} />}
          {activeTab === 'financials' && <FinancialsTab data={ipoData} />}
          {activeTab === 'subscription' && <SubscriptionTab data={ipoData} />}
          {activeTab === 'details' && <DetailsTab data={ipoData} />}
          {activeTab === 'faqs' && <FAQsTab data={ipoData} />}
          
          {/* Data Source Information */}
          <DataProviders />
          
          {/* IPO-specific Disclaimer */}
          <IPODisclaimer />
        </div>
      </section>

      {/* Related IPOs Section */}
      <RelatedIPOs />
    </div>
  );
} 