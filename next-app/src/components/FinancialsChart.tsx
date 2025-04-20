'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

interface FinancialDataPoint {
  year: string;
  revenue?: number;
  profit?: number;
  assets?: number;
  liabilities?: number;
}

interface FinancialsChartProps {
  data: FinancialDataPoint[];
  type?: 'revenue' | 'profit' | 'both';
}

const FinancialsChart: React.FC<FinancialsChartProps> = ({ data, type = 'both' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No financial data available</p>
      </div>
    );
  }

  // Format currency in millions/billions
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `₹${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `₹${(value / 1000000).toFixed(1)}M`;
    }
    return `₹${value.toLocaleString()}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded">
          <p className="font-medium text-gray-700 dark:text-gray-300">{`Year: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'both' ? (
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Profit" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={type} 
              name={type === 'revenue' ? 'Revenue' : 'Profit'} 
              fill={type === 'revenue' ? '#8884d8' : '#82ca9d'} 
              stroke={type === 'revenue' ? '#8884d8' : '#82ca9d'} 
              fillOpacity={0.3} 
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialsChart;
