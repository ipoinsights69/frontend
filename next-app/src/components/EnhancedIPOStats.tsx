'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedNumber from './AnimatedNumber';

// Define our own interface to match the enhanced stats we're using
interface EnhancedStats {
  totalIPOs?: number;
  totalIPOsThisYear?: number;
  yearOverYearChange?: number;
  averageListingGains?: number;
  averageListingGainsChange?: number;
  positiveListingPercentage?: number;
  positiveListingPercentageChange?: number;
  totalAmountRaised?: number;
  totalAmountRaisedChange?: number;
  bestPerformer?: any;
  worstPerformer?: any;
}

interface EnhancedIPOStatsProps {
  stats: EnhancedStats | null;
  loading: boolean;
  error: Error | null;
}

const EnhancedIPOStats: React.FC<EnhancedIPOStatsProps> = ({ stats, loading, error }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    },
  };

  if (loading) {
    return (
      <section className="w-full py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse-subtle"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !stats) {
    return (
      <section className="w-full py-6">
        <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error ? error.message : 'No statistics available'}
        </div>
      </section>
    );
  }

  const statItems = [
    {
      title: 'IPOs This Year',
      value: stats.totalIPOsThisYear || 0,
      change: stats.yearOverYearChange || 0,
      changeLabel: 'vs Last Year',
      prefix: '',
      suffix: '',
      formatter: { maximumFractionDigits: 0 }
    },
    {
      title: 'Average Return',
      value: stats.averageListingGains || 0,
      change: stats.averageListingGainsChange || 0,
      changeLabel: 'vs Last Year',
      prefix: '',
      suffix: '%',
      formatter: { maximumFractionDigits: 2 }
    },
    {
      title: 'Success Rate',
      value: stats.positiveListingPercentage || 0,
      change: stats.positiveListingPercentageChange || 0,
      changeLabel: 'vs Last Year',
      prefix: '',
      suffix: '%',
      formatter: { maximumFractionDigits: 1 }
    },
    {
      title: 'Total Raised',
      value: stats.totalAmountRaised ? stats.totalAmountRaised / 1000 : 0, // Convert to billions
      change: stats.totalAmountRaisedChange || 0,
      changeLabel: 'vs Last Year',
      prefix: '₹',
      suffix: ' Cr',
      formatter: { maximumFractionDigits: 0 }
    }
  ];

  return (
    <motion.section
      ref={ref}
      className="w-full py-6"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass rounded-xl overflow-hidden p-6 card-hover backdrop-blur-sm"
          >
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
              <div className="mt-2 flex items-end">
                <AnimatedNumber
                  value={stat.value}
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  formatOptions={stat.formatter}
                />
              </div>
              {typeof stat.change === 'number' && (
                <div className="mt-2 flex items-center text-sm">
                  <span
                    className={`font-medium ${
                      stat.change > 0
                        ? 'text-green-600 dark:text-green-400'
                        : stat.change < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">{stat.changeLabel}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default EnhancedIPOStats; 