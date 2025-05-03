import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialsTabProps {
  data: IPODetailedData & Record<string, any>;
}

const FinancialsTab = ({ data }: FinancialsTabProps) => {
  // First try to find financial tables in additionalTables
  const additionalTables = getNestedValue(data, 'additionalTables') || [];
  const financialsTable = additionalTables.find((table: any) => 
    table.sanitizedHeading === 'financials' || 
    (table.heading && table.heading.toLowerCase().includes('financial'))
  );

  // Use additionalTables data if available, otherwise fall back to financials.data
  const hasFinancialsTable = financialsTable && financialsTable.rows && financialsTable.rows.length > 0;
  const financialsData = data.financials?.data || [];
  
  // State for active metrics to show in chart
  const [activeMetrics, setActiveMetrics] = useState<Record<string, boolean>>({
    revenue: true,
    profit: true,
    assets: true,
    netWorth: true
  });
  
  // Check if we have any financial data to display
  if (!hasFinancialsTable && financialsData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-6 flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">No financial data available for this IPO.</p>
      </div>
    );
  }

  // KPI Table for ratios
  const kpiTable = additionalTables.find((table: any) => 
    table.headers?.includes('KPI') || 
    table.sanitizedHeading?.includes('kpi')
  );

  // Extract ratios from KPI table if available
  const ratios = [
    { key: 'roe', label: 'ROE', value: kpiTable?.rows?.find((r: string[]) => r[0].includes('RoNW') || r[0].includes('ROE'))?.[1] },
    { key: 'debt_equity', label: 'Debt/Equity', value: kpiTable?.rows?.find((r: string[]) => r[0].includes('Debt'))?.[1] },
    { key: 'roce', label: 'ROCE', value: getNestedValue(data, 'financials.ratios.roce') },
    { key: 'pat_margin', label: 'PAT Margin', value: getNestedValue(data, 'financials.ratios.pat_margin') }
  ];

  // Get periods from table headers (skipping the first header which is "Period Ended")
  const periods = hasFinancialsTable ? (financialsTable.headers?.slice(1) || []) : 
                 financialsData.map(item => item.period);
  
  // Reverse periods to show oldest first
  const reversedPeriods = [...periods].reverse();

  // Define metrics we want to extract and display
  const metrics = [
    { key: 'Assets', cssClass: 'bg-gray-50' },
    { key: 'Revenue', cssClass: 'bg-gray-50' },
    { key: 'Profit After Tax', cssClass: 'bg-gray-50' },
    { key: 'Net Worth', cssClass: 'bg-gray-50' },
    { key: 'Total Borrowing', cssClass: 'bg-gray-50' }
  ];

  // Function to get value for a specific metric and period
  const getValue = (metricKey: string, periodIndex: number) => {
    if (hasFinancialsTable) {
      const row = financialsTable.rows.find((r: string[]) => r[0].includes(metricKey));
      // Adjust index to account for reversed periods
      const reversedIndex = periods.length - 1 - periodIndex;
      return row ? row[reversedIndex + 1] : '-';
    } else {
      // Adjust index to account for reversed periods
      const reversedIndex = periods.length - 1 - periodIndex;
      const periodData = financialsData[reversedIndex];
      const key = metricKey.toLowerCase().replace(/\s+/g, '_');
      return periodData && periodData[key as keyof typeof periodData] !== undefined 
        ? periodData[key as keyof typeof periodData] 
        : '-';
    }
  };

  // Prepare data for Chart.js with enhanced visuals
  const chartData = {
    labels: reversedPeriods,
    datasets: [
      {
        label: 'Revenue',
        data: reversedPeriods.map((_: any, i: number) => parseFloat(getValue('Revenue', i)) || 0),
        borderColor: '#3b82f6', // blue-500
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return 'rgba(59, 130, 246, 0.1)';
          
          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
          return gradient;
        },
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointHoverRadius: 6,
        hidden: !activeMetrics.revenue,
        tension: 0.4, // Smooth curve
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#ffffff'
      },
      {
        label: 'Profit After Tax',
        data: reversedPeriods.map((_: any, i: number) => parseFloat(getValue('Profit After Tax', i)) || 0),
        borderColor: '#10b981', // emerald-500
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return 'rgba(16, 185, 129, 0.1)';
          
          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
          return gradient;
        },
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointHoverRadius: 6,
        hidden: !activeMetrics.profit,
        tension: 0.4,
        pointHoverBackgroundColor: '#10b981',
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#ffffff'
      },
      {
        label: 'Assets',
        data: reversedPeriods.map((_: any, i: number) => parseFloat(getValue('Assets', i)) || 0),
        borderColor: '#f59e0b', // amber-500
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return 'rgba(245, 158, 11, 0.1)';
          
          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0.02)');
          return gradient;
        },
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#f59e0b',
        pointHoverRadius: 6,
        hidden: !activeMetrics.assets,
        tension: 0.4,
        pointHoverBackgroundColor: '#f59e0b',
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#ffffff'
      },
      {
        label: 'Net Worth',
        data: reversedPeriods.map((_: any, i: number) => parseFloat(getValue('Net Worth', i)) || 0),
        borderColor: '#8b5cf6', // violet-500
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return 'rgba(139, 92, 246, 0.1)';
          
          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.02)');
          return gradient;
        },
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#8b5cf6',
        pointHoverRadius: 6,
        hidden: !activeMetrics.netWorth,
        tension: 0.4,
        pointHoverBackgroundColor: '#8b5cf6',
        pointHoverBorderWidth: 2, 
        pointHoverBorderColor: '#ffffff'
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        },
        onClick: (_, legendItem) => {
          const datasetIndex = legendItem.datasetIndex;
          const dataset = chartData.datasets[datasetIndex || 0];
          const metricKey = dataset.label?.toLowerCase().replace(/\s+/g, '') || '';
          
          setActiveMetrics(prev => ({
            ...prev,
            [metricKey]: !prev[metricKey as keyof typeof prev]
          }));
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: 'rgba(229, 231, 235, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `₹${context.parsed.y.toFixed(2)} Cr`;
            }
            return label;
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          color: '#6b7280'
        },
        border: {
          dash: [4, 4]
        }
      },
      y: {
        beginAtZero: true,
        border: {
          dash: [4, 4]
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          color: '#6b7280',
          callback: (value) => `₹${value} Cr`
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    elements: {
      line: {
        borderJoinStyle: 'round'
      }
    }
  };

  // Toggle filters for metrics
  const toggleMetric = (metric: string) => {
    setActiveMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric as keyof typeof prev]
    }));
  };

  // Color mappings for filter buttons
  const metricColors = {
    revenue: { bg: 'bg-blue-50', bgActive: 'bg-blue-100', text: 'text-blue-600', textActive: 'text-blue-700', border: 'border-blue-200' },
    profit: { bg: 'bg-emerald-50', bgActive: 'bg-emerald-100', text: 'text-emerald-600', textActive: 'text-emerald-700', border: 'border-emerald-200' },
    assets: { bg: 'bg-amber-50', bgActive: 'bg-amber-100', text: 'text-amber-600', textActive: 'text-amber-700', border: 'border-amber-200' },
    networth: { bg: 'bg-violet-50', bgActive: 'bg-violet-100', text: 'text-violet-600', textActive: 'text-violet-700', border: 'border-violet-200' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Financial Tables */}
      <div className="lg:col-span-2">
        {/* Interactive Line Chart with Enhanced Design */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">Financial Performance</h2>
              <div className="flex space-x-1.5">
                {Object.entries(activeMetrics).map(([metric, isActive]) => {
                  // Fix the metric key to ensure it matches metricColors keys
                  const metricKey = metric.toLowerCase() === 'networth' ? 'networth' : metric;
                  const colors = metricColors[metricKey as keyof typeof metricColors];
                  
                  // Add safety check
                  if (!colors) {
                    console.error(`No colors found for metric: ${metricKey}`);
                    return null;
                  }
                  
                  return (
                    <button 
                      key={metric}
                      onClick={() => toggleMetric(metric)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border
                        ${isActive ? `${colors.bgActive} ${colors.textActive} ${colors.border}` : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                    >
                      {metric === 'netWorth' ? 'Net Worth' : metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="h-96 p-5 pt-2">
            <Line data={chartData} options={chartOptions} />
          </div>
          
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>All figures in Crores (₹)</div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                <span className="mr-3">Revenue</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
                <span className="mr-3">Profit</span>
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                <span className="mr-3">Assets</span>
                <span className="w-2 h-2 bg-violet-500 rounded-full mr-1"></span>
                <span>Net Worth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Data Table - Enhanced */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-6">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Financial Data</h2>
            <p className="text-xs text-gray-500 mt-1">All figures in Crores (₹)</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Particulars
                  </th>
                  {reversedPeriods.map((period: any, idx: number) => (
                    <th 
                      key={idx}
                      scope="col" 
                      className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.map((metric, metricIdx) => (
                  <tr 
                    key={metricIdx} 
                    className={`hover:bg-gray-50 transition-colors duration-150`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {metric.key}
                    </td>
                    {reversedPeriods.map((_: any, periodIdx: number) => {
                      const value = getValue(metric.key, periodIdx);
                      const numValue = parseFloat(value);
                      const isPositiveValue = !isNaN(numValue) && numValue > 0;
                      
                      return (
                        <td 
                          key={periodIdx}
                          className={`px-5 py-4 whitespace-nowrap text-sm text-right ${
                            isPositiveValue 
                              ? 'text-gray-800 font-medium' 
                              : 'text-gray-600'
                          }`}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Key Financial Ratios</h2>
          <div className="space-y-5">
            {ratios.map((ratio, idx) => {
              // Extract numeric value and percentage
              let numValue = 0;
              let displayValue = 'N/A';
              
              if (ratio.value) {
                // Convert ratio.value to string to ensure we can use string methods
                const valueStr = String(ratio.value);
                
                // Handle values like "3.6%" or "5.70"
                numValue = parseFloat(valueStr.replace('%', ''));
                displayValue = ratio.key === 'debt_equity' 
                  ? `${numValue}x` 
                  : valueStr.includes('%') ? valueStr : `${numValue}%`;
              }
              
              const percentage = ratio.key !== 'debt_equity' ? numValue : numValue * 10;
              
              return (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{ratio.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{displayValue}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Financial Highlights</h2>
          </div>
          
          {hasFinancialsTable && reversedPeriods.length > 0 && (
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                {metrics.slice(0, 4).map((metric, idx) => {
                  const latestValue = getValue(metric.key, reversedPeriods.length - 1);
                  const prevValue = getValue(metric.key, reversedPeriods.length - 2);
                  
                  // Only calculate change when we have valid numbers
                  let change = null;
                  if (latestValue !== '-' && prevValue !== '-') {
                    const latestNum = parseFloat(latestValue);
                    const prevNum = parseFloat(prevValue);
                    
                    // Only show percentage when both values are valid numbers and previous value is not zero
                    if (!isNaN(latestNum) && !isNaN(prevNum) && prevNum !== 0) {
                      change = ((latestNum - prevNum) / prevNum * 100).toFixed(1);
                    }
                  }
                  
                  return (
                    <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex flex-col">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{metric.key}</div>
                      <div className="text-xl font-semibold text-gray-900">{latestValue}</div>
                      {change && (
                        <div className={`text-xs mt-1 font-medium flex items-center ${parseFloat(change) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {parseFloat(change) >= 0 ? (
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          )}
                          {parseFloat(change) >= 0 ? '+' : ''}{change}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 px-1 text-xs text-gray-500">
                <p>* Percentage changes calculated between the most recent periods</p>
              </div>
            </div>
          )}
        </div>
        
        {/* YoY Growth Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Year-over-Year Growth</h2>
          </div>
          
          <div className="p-5">
            {['Revenue', 'Profit After Tax'].map((metric, idx) => {
              // Skip if we don't have enough periods
              if (reversedPeriods.length < 2) return null;
              
              const values = reversedPeriods.map((_: any, periodIdx: number) => {
                const value = getValue(metric, periodIdx);
                return parseFloat(value) || 0;
              });
              
              const maxValue = Math.max(...values);
              
              return (
                <div key={idx} className="mb-6 last:mb-0">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">{metric}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {maxValue > 0 ? `Max: ₹${maxValue.toFixed(2)} Cr` : ''}
                    </span>
                  </div>
                  <div className="relative h-16 bg-gray-50 rounded-lg p-2">
                    <div className="absolute inset-0 flex items-end p-2">
                      {reversedPeriods.map((period: any, periodIdx: number) => {
                        const value = values[periodIdx];
                        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        
                        return (
                          <div key={periodIdx} className="flex-1 flex flex-col items-center">
                            <div 
                              className={`w-3/4 rounded-t transition-all duration-500 ${
                                metric === 'Revenue' ? 'bg-blue-500' : 'bg-emerald-500'
                              }`}
                              style={{ height: `${Math.max(10, height)}%` }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                              {period}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTab; 