'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import MotionCard from './MotionCard';
import { IPOSummary } from '@/lib/server/ipoDataService';

interface EnhancedTrendingCardProps {
  ipo: IPOSummary;
  label: string;
  color?: string;
  delay?: number;
}

const EnhancedTrendingCard: React.FC<EnhancedTrendingCardProps> = ({
  ipo,
  label,
  color = 'bg-blue-500',
  delay = 0
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!ipo) return null;

  // Format dates to be more readable
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBA';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Determine status badge 
  const getBadgeColor = () => {
    switch (label.toLowerCase()) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'open now': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'closed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'listed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'top performer': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <MotionCard 
      className="h-full" 
      delay={delay} 
      gradient={true}
      animationVariant="slide-up"
    >
      <Link href={`/ipo/${ipo.ipo_id}`} className="block h-full">
        <div className="flex flex-col h-full">
          {/* Header with logo and status */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                {ipo.logo_url ? (
                  <Image
                    src={ipo.logo_url}
                    alt={ipo.company_name || ipo.ipo_name}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xl font-bold text-gray-400">
                    {(ipo.company_name || ipo.ipo_name || '').charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                  {ipo.company_name || ipo.ipo_name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{ipo.year}</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor()}`}>
              {label}
            </span>
          </div>
          
          {/* IPO details */}
          <div className="p-6 flex-grow">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Issue Price</p>
                <p className="font-semibold mt-1 text-gray-900 dark:text-white">{ipo.issue_price || "TBA"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Issue Size</p>
                <p className="font-semibold mt-1 text-gray-900 dark:text-white">{ipo.issue_size || "TBA"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Lot Size</p>
                <p className="font-semibold mt-1 text-gray-900 dark:text-white">{ipo.lot_size || "TBA"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Listing At</p>
                <p className="font-semibold mt-1 text-gray-900 dark:text-white">{ipo.listing_at || "TBA"}</p>
              </div>
            </div>
            
            {/* Only show subscription if applicable */}
            {ipo.overall_subscription && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Subscription</p>
                <div className="mt-1 relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold inline-block text-blue-600 dark:text-blue-400">
                        {ipo.overall_subscription}x
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100 dark:bg-blue-900/30 mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(parseFloat(ipo.overall_subscription || '0') * 5, 100)}%` }}
                      transition={{ duration: 1, delay: delay + 0.5 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-600"
                    ></motion.div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Only show listing gains if applicable */}
            {ipo.listing_gains && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Listing Gains</p>
                <p className={`font-semibold mt-1 ${
                  (ipo.listing_gains_numeric || 0) > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : (ipo.listing_gains_numeric || 0) < 0 
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {ipo.listing_gains}
                </p>
              </div>
            )}
          </div>
          
          {/* Footer with dates */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 mt-auto">
            <div className="flex justify-between text-xs">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Opening</p>
                <p className="font-medium mt-1 text-gray-900 dark:text-white">{formatDate(ipo.opening_date)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Closing</p>
                <p className="font-medium mt-1 text-gray-900 dark:text-white">{formatDate(ipo.closing_date)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Listing</p>
                <p className="font-medium mt-1 text-gray-900 dark:text-white">{formatDate(ipo.listing_date)}</p>
              </div>
            </div>
          </div>
          
          {/* Hover effect gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-blue-500/20 dark:to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
        </div>
      </Link>
    </MotionCard>
  );
};

export default EnhancedTrendingCard;