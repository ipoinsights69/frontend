import React from 'react';
import { IPOStats } from '@/lib/server/ipoDataService';

interface MarketInsightsProps {
  stats: IPOStats | null;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Market insights are currently unavailable.</p>
      </div>
    );
  }

  // Calculate percentage of listed IPOs
  const totalIPOs = stats.totalCount || 0;
  const listedIPOs = stats.byStatus?.listed || 0;
  const listedPercentage = totalIPOs > 0 ? Math.round((listedIPOs / totalIPOs) * 100) : 0;

  // Get average listing gains
  const averageGains = stats.averageGains || 'N/A';

  // Generate IPO market insights based on stats
  const insights = [
    {
      title: 'IPO Success Rate',
      value: `${listedPercentage}%`,
      description: 'Percentage of IPOs that have been successfully listed',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Average Listing Gains',
      value: averageGains,
      description: 'Average returns on listing day across all IPOs',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Current IPO Activity',
      value: `${stats.byStatus?.open || 0} Open`,
      description: `${stats.byStatus?.upcoming || 0} upcoming IPOs in the pipeline`,
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Exchange Distribution',
      value: getTopExchange(stats),
      description: 'Most popular exchange for IPO listings',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  function getTopExchange(stats: IPOStats): string {
    // If byExchange is available in the stats
    if (stats.byExchange) {
      const entries = Object.entries(stats.byExchange);
      if (entries.length > 0) {
        // Sort by count (descending) and get the top exchange
        const [topExchange] = entries.sort((a, b) => b[1] - a[1])[0];
        return topExchange;
      }
    }
    return 'N/A';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {insights.map((insight, index) => (
        <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="mr-3 p-2 bg-gray-50 rounded-full">
              {insight.icon}
            </div>
            <h4 className="text-sm font-medium text-gray-500">{insight.title}</h4>
          </div>
          <div className="mb-2">
            <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
          </div>
          <p className="text-sm text-gray-500">{insight.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MarketInsights; 