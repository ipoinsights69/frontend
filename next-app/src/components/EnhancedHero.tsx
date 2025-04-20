'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EnhancedHeroProps {
  className?: string;
  stats?: any;
  loading?: boolean;
}

const EnhancedHero: React.FC<EnhancedHeroProps> = ({ className = '', stats, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 ${className}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-200/30 dark:bg-blue-500/10"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-purple-200/40 dark:bg-purple-500/10"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full bg-cyan-100/30 dark:bg-cyan-500/10"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
              The #1 IPO Analysis Platform
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              Discover <span className="text-blue-600 dark:text-blue-400">Investment</span> Opportunities in the IPO Market
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Get real-time analytics, comprehensive data, and expert insights on upcoming, open, and listed IPOs to make informed investment decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <div className="relative flex-grow max-w-md mx-auto sm:mx-0">
              <Input
                type="text"
                placeholder="Search for IPOs, companies..."
                className="pl-10 pr-4 py-3 w-full rounded-full border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-600"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <Button className="h-12 rounded-full px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
              Search
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 text-sm"
          >
            <span className="text-gray-500 dark:text-gray-400">Popular searches:</span>
            {['LIC IPO', 'Zomato', 'Paytm', 'Nykaa', 'OYO'].map((term, index) => (
              <Link 
                key={index} 
                href={`/search?term=${term}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {term}
              </Link>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 max-w-xl mx-auto grid grid-cols-3 gap-4 text-center"
        >
          {[
            { value: '250+', label: 'IPOs Analyzed' },
            { value: '₹1.2T+', label: 'Market Cap' },
            { value: '99.8%', label: 'Data Accuracy' }
          ].map((stat, index) => (
            <div key={index} className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedHero; 