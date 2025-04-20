import React from 'react';
import { IPOStats as IPOStatsType } from '@/lib/server/ipoDataService';

interface IPOStatsProps {
  stats: IPOStatsType | null;
  loading?: boolean;
  error?: Error | null;
}

const IPOStats = ({ stats, loading = false, error = null }: IPOStatsProps) => {
  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">IPO Market Overview</h2>
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p>Error loading IPO statistics: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">IPO Market Overview</h2>
        <p className="text-gray-500">No statistics available.</p>
      </div>
    );
  }

  const bestGain = stats.bestPerformer?.listing_gains_numeric;
  const worstGain = stats.worstPerformer?.listing_gains_numeric;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-6">IPO Market Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-md">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total IPOs</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalCount}</p>
          <div className="text-xs font-medium text-gray-500 mt-2">All time</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-md">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Open IPOs</h3>
          <p className="text-3xl font-bold text-emerald-600">{stats.byStatus.open}</p>
          <div className="flex items-center text-xs font-medium text-gray-500 mt-2">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1"></span>
            Currently accepting applications
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-md">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Upcoming IPOs</h3>
          <p className="text-3xl font-bold text-sky-600">{stats.byStatus.upcoming}</p>
          <div className="flex items-center text-xs font-medium text-gray-500 mt-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-400 mr-1"></span>
            Announced but not yet open
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-md">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Listed IPOs</h3>
          <p className="text-3xl font-bold text-violet-600">{stats.byStatus.listed}</p>
          <div className="flex items-center text-xs font-medium text-gray-500 mt-2">
            <span className="inline-block h-2 w-2 rounded-full bg-purple-400 mr-1"></span>
            Successfully completed and trading
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="border border-gray-100 p-6 rounded-md">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Best Performer</h3>
          <div className="mb-2">
            <span className="font-medium">{stats.bestPerformer?.company_name || stats.bestPerformer?.ipo_name || 'N/A'}</span>
          </div>
          {bestGain !== null && bestGain !== undefined && (
            <div className="flex items-center">
              <div className="text-xl font-bold text-green-600 mr-2">+{bestGain.toFixed(2)}%</div>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Listing Gain
              </div>
            </div>
          )}
        </div>
        
        <div className="border border-gray-100 p-6 rounded-md">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Worst Performer</h3>
          <div className="mb-2">
            <span className="font-medium">{stats.worstPerformer?.company_name || stats.worstPerformer?.ipo_name || 'N/A'}</span>
          </div>
          {worstGain !== null && worstGain !== undefined && (
            <div className="flex items-center">
              <div className="text-xl font-bold text-red-600 mr-2">{worstGain.toFixed(2)}%</div>
              <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                Listing Loss
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IPOStats; 