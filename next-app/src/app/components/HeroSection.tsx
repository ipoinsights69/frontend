'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faClock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { IPO, IPOStats as IPOStatsData } from '@/app/types/IPO';
import IPOTabs from './IPOTabs';
import IPOStats from './IPOStats';

interface HeroSectionProps {
  trendingIPOs: IPO[];
  upcomingIPOs: IPO[];
  recentIPOs: IPO[];
  closedIPOs: IPO[];
  stats: IPOStatsData;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  trendingIPOs,
  upcomingIPOs,
  recentIPOs,
  closedIPOs,
  stats
}) => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Left side content */}
          <div className="w-full md:w-2/5 space-y-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-tight">
              Get real-time insights on the IPO market
            </h1>
            <p className="text-lg text-gray-600">
              Track performance metrics, analyze market trends, and discover investment opportunities in the IPO landscape.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-600" />
                <span>{stats.activeCount}+ IPOs tracked</span>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-600" />
                <span>Real-time updates</span>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-600" />
                <span>IPO calendar</span>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <Link 
                href="/calendar" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-200 inline-block"
              >
                Get Started
              </Link>
              <Link 
                href="/about" 
                className="text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 py-2 px-6 rounded-md transition-colors duration-200 inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Right side IPO tabs */}
          <div className="w-full md:w-3/5">
            <IPOTabs 
              trendingIPOs={trendingIPOs}
              upcomingIPOs={upcomingIPOs}
              recentIPOs={recentIPOs}
              closedIPOs={closedIPOs}
            />
          </div>
        </div>
        <br></br><br></br>
        {/* IPO Market Stats */}
        <IPOStats stats={stats} />
      </div>
    </section>
  );
};

export default HeroSection; 