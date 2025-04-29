'use client';

import React from 'react';
import { IPOStats as IPOStatsData } from '@/app/types/IPO';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faCalendarCheck, 
  faListCheck,
  faCheckCircle,
  faBuilding,
  faMoneyBillTrendUp
} from '@fortawesome/free-solid-svg-icons';

interface IPOStatsProps {
  stats: IPOStatsData;
}

// Function to format numbers with commas
const formatNumber = (num: number | undefined): string => {
  return (num || 0).toLocaleString();
};

const IPOStats: React.FC<IPOStatsProps> = ({ stats }) => {
  const currentYear = stats.currentYear || new Date().getFullYear();
  
  // Extract values from stats, using direct mapping to current_year_summary
  const totalIPOs = stats.totalIPOs || 0;
  const openIPOs = stats.activeCount || 0;
  const upcomingIPOs = stats.upcomingCount || 0;
  const listedIPOs = stats.listedIPOs || 0;
  const closedIPOs = stats.closedIPOs || 0;
  const totalRaisedCrore = stats.totalRaisedCrore || 0;
  
  // Log values for debugging
  console.log('IPO Stats:', { 
    totalIPOs, 
    openIPOs, 
    upcomingIPOs, 
    listedIPOs, 
    closedIPOs, 
    totalRaisedCrore 
  });
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <FontAwesomeIcon icon={faChartLine} className="mr-3 text-blue-600" />
        {currentYear} IPO Market Overview
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total IPOs */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-2 text-center">Total IPOs</div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(totalIPOs)}
          </div>
          <div className="mt-2 text-blue-600 flex items-center text-sm">
            <FontAwesomeIcon icon={faChartLine} className="w-3 h-3 mr-1" />
            <span>All IPOs</span>
          </div>
        </div>
        
        {/* Open IPOs */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-2 text-center">Open IPOs</div>
          <div className="text-3xl font-bold text-green-600">
            {formatNumber(openIPOs)}
          </div>
          <div className="mt-2 text-green-600 flex items-center text-sm">
            <FontAwesomeIcon icon={faCalendarCheck} className="w-3 h-3 mr-1" />
            <span>Now Accepting</span>
          </div>
        </div>
        
        {/* Upcoming IPOs */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-2 text-center">Upcoming IPOs</div>
          <div className="text-3xl font-bold text-blue-600">
            {formatNumber(upcomingIPOs)}
          </div>
          <div className="mt-2 text-blue-600 flex items-center text-sm">
            <FontAwesomeIcon icon={faListCheck} className="w-3 h-3 mr-1" />
            <span>Opening Soon</span>
          </div>
        </div>
        
        {/* Listed IPOs */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-2 text-center">Listed IPOs</div>
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(listedIPOs)}
          </div>
          <div className="mt-2 text-gray-600 flex items-center text-sm">
            <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-1" />
            <span>Now Trading</span>
          </div>
        </div>
        
        {/* Closed IPOs */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-2 text-center">Closed IPOs</div>
          <div className="text-3xl font-bold text-gray-600">
            {formatNumber(closedIPOs)}
          </div>
          <div className="mt-2 text-gray-600 flex items-center text-sm">
            <FontAwesomeIcon icon={faBuilding} className="w-3 h-3 mr-1" />
            <span>Allotment Phase</span>
          </div>
        </div>
        
        {/* Total Raised */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-500 mb-2 text-center">Total Raised</div>
          <div className="text-3xl font-bold text-green-600">
            ₹{formatNumber(totalRaisedCrore)}
          </div>
          <div className="mt-2 text-green-600 flex items-center text-sm">
            <FontAwesomeIcon icon={faMoneyBillTrendUp} className="w-3 h-3 mr-1" />
            <span>Crore</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPOStats; 