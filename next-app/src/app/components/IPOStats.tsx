'use client';

import React from 'react';
import { IPOStats as IPOStatsData } from '@/lib/ipoDataService';

interface IPOStatsProps {
  stats: IPOStatsData;
}

const IPOStats: React.FC<IPOStatsProps> = ({ stats }) => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
        <div className="text-sm font-medium text-gray-500 mb-1">Active IPOs This Month</div>
        <div className="text-3xl font-semibold text-gray-900">{stats.activeCount}</div>
        <div className="text-sm text-green-600 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
          Recent activity
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
        <div className="text-sm font-medium text-gray-500 mb-1">Average IPO Return</div>
        <div className="text-3xl font-semibold text-gray-900">
          {stats.averageReturn > 0 ? '+' : ''}{stats.averageReturn.toFixed(1)}%
        </div>
        <div className={`text-sm ${stats.averageReturn >= 0 ? 'text-green-600' : 'text-red-600'} mt-2 flex items-center`}>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stats.averageReturn >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"}></path>
          </svg>
          Based on listed IPOs
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
        <div className="text-sm font-medium text-gray-500 mb-1">Upcoming IPOs</div>
        <div className="text-3xl font-semibold text-gray-900">{stats.upcomingCount}</div>
        <div className="text-sm text-blue-600 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Next 30 days
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
        <div className="text-sm font-medium text-gray-500 mb-1">Top Performing Sector</div>
        <div className="text-3xl font-semibold text-gray-900">{stats.topSector.name}</div>
        <div className="text-sm text-green-600 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
          +{stats.topSector.return.toFixed(1)}% average return
        </div>
      </div>
    </div>
  );
};

export default IPOStats; 