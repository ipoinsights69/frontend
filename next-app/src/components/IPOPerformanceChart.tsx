import React, { useEffect, useRef } from 'react';
import { YearCount } from '@/lib/server/ipoDataService';

interface IPOPerformanceChartProps {
  years: YearCount[] | undefined;
  loading?: boolean;
}

const IPOPerformanceChart: React.FC<IPOPerformanceChartProps> = ({ years, loading = false }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !years || years.length === 0 || !chartRef.current) return;
    
    // This is a placeholder for a real chart. In a real application, you would
    // use a charting library like Chart.js, D3.js, ApexCharts, or similar.
    // Since we're focusing on the integration with APIs, we'll use a simple
    // visual representation instead of adding a full charting library dependency.
    
    renderSimpleChart();
  }, [years, loading]);
  
  const renderSimpleChart = () => {
    if (!years || !chartRef.current) return;
    
    // Clear previous chart
    chartRef.current.innerHTML = '';
    
    // Sort years in ascending order
    const sortedYears = [...years].sort((a, b) => a.year - b.year);
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'flex items-end h-64 space-x-2';
    
    // Find max count for scaling
    const maxCount = Math.max(...sortedYears.map(y => y.count));
    
    // Create bars
    sortedYears.forEach(yearData => {
      // Calculate height percentage based on count
      const heightPercentage = (yearData.count / maxCount) * 100;
      
      // Create bar container
      const barContainer = document.createElement('div');
      barContainer.className = 'flex flex-col items-center flex-1';
      
      // Create bar
      const bar = document.createElement('div');
      bar.className = 'w-full bg-indigo-500 rounded-t-md';
      bar.style.height = `${heightPercentage}%`;
      
      // Create tooltip with data
      bar.setAttribute('title', `${yearData.year}: ${yearData.count} IPOs`);
      
      // Create year label
      const yearLabel = document.createElement('div');
      yearLabel.className = 'text-xs text-gray-500 mt-1';
      yearLabel.textContent = yearData.year.toString();
      
      // Append elements
      barContainer.appendChild(bar);
      barContainer.appendChild(yearLabel);
      chartContainer.appendChild(barContainer);
    });
    
    // Create legend
    const legend = document.createElement('div');
    legend.className = 'mt-4 text-center text-xs text-gray-500';
    legend.textContent = 'Number of IPOs by Year';
    
    // Append to chart ref
    chartRef.current.appendChild(chartContainer);
    chartRef.current.appendChild(legend);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
      </div>
    );
  }
  
  if (!years || years.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }
  
  return (
    <div className="chart-container">
      <div ref={chartRef} className="w-full"></div>
    </div>
  );
};

export default IPOPerformanceChart; 