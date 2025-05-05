'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  const [stocksCollected, setStocksCollected] = useState(0);

  // Handle stock certificate click
  const collectStock = () => {
    setStocksCollected(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <div className="h-8 w-8 bg-blue-600 text-white rounded-md flex items-center justify-center mr-2 shadow-sm">
          <i className="fas fa-chart-line text-sm"></i>
        </div>
        <span className="text-lg font-semibold text-gray-800">
          IPO<span className="text-blue-600 font-semibold">Hut</span>
        </span>
      </div>
      
      {/* 404 Message */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-10"
      >
        <h1 className="text-7xl font-bold text-blue-600 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Investment Not Found
        </h2>
        <p className="text-gray-600 max-w-sm">
          The IPO you're looking for seems to have missed its listing date.
        </p>
      </motion.div>
      
      {/* Interactive Element */}
      <motion.div 
        className="mb-8 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={collectStock}
      >
        <div className="bg-white p-3 rounded-md shadow-sm border border-blue-100 hover:shadow-md transition-all flex items-center">
          <i className="fas fa-file-alt text-blue-500 mr-2"></i>
          <span className="text-gray-700">
            {stocksCollected === 0 
              ? "Click to collect a stock" 
              : `${stocksCollected} stock${stocksCollected !== 1 ? 's' : ''} collected`}
          </span>
        </div>
      </motion.div>
      
      {/* Call to action */}
      <Link 
        href="/"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm inline-flex items-center"
      >
        <i className="fas fa-home mr-1"></i>
        Back to Home
      </Link>
    </div>
  );
} 