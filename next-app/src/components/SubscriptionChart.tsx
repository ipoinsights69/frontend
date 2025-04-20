'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SubscriptionData {
  overall?: number | null;
  qib?: number | null;
  nii?: number | null;
  retail?: number | null;
}

interface SubscriptionChartProps {
  data: SubscriptionData;
}

const SubscriptionChart: React.FC<SubscriptionChartProps> = ({ data }) => {
  // Transform the subscription data for the chart
  const chartData = [
    { name: 'QIB', subscription: data.qib || 0 },
    { name: 'NII', subscription: data.nii || 0 },
    { name: 'Retail', subscription: data.retail || 0 },
    { name: 'Overall', subscription: data.overall || 0 },
  ].filter(item => item.subscription > 0); // Only include non-zero values

  // If we have no valid data, show a message
  if (chartData.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No subscription data available</p>
      </div>
    );
  }

  // Define custom colors for the bars
  const barColors = {
    QIB: '#8884d8',
    NII: '#82ca9d',
    Retail: '#ffc658',
    Overall: '#ff8042'
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm">
            <span className="font-semibold">{`${payload[0].value.toFixed(2)}x`}</span> subscribed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis 
            label={{ value: 'Times Subscribed', angle: -90, position: 'insideLeft', offset: -5 }} 
            tickFormatter={(value) => `${value}x`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="subscription" 
            name="Subscription" 
            radius={[4, 4, 0, 0]}
            fill="#8884d8"
            // Map colors based on name
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubscriptionChart;
