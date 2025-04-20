'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PriceDataPoint {
  date: string;
  price: number;
}

interface PricePerformanceChartProps {
  data: PriceDataPoint[];
  issuePrice?: number;
  listingPrice?: number;
}

const PricePerformanceChart: React.FC<PricePerformanceChartProps> = ({ 
  data, 
  issuePrice, 
  listingPrice 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No price performance data available</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  // Calculate min and max for domain padding
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const pricePadding = (maxPrice - minPrice) * 0.1;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded">
          <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Price: {formatCurrency(payload[0].value)}
          </p>
          {issuePrice && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              vs Issue: {((payload[0].value / issuePrice - 1) * 100).toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            domain={[Math.max(0, minPrice - pricePadding), maxPrice + pricePadding]} 
            tickFormatter={formatCurrency} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Reference lines for issue and listing prices if available */}
          {issuePrice && (
            <Line 
              type="monotone" 
              dataKey={() => issuePrice} 
              stroke="#FF8042" 
              strokeDasharray="5 5" 
              name="Issue Price" 
              dot={false} 
              activeDot={false}
            />
          )}
          
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#4F46E5" 
            strokeWidth={2}
            name="Share Price" 
            dot={{ r: 3, strokeWidth: 1 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PricePerformanceChart;
