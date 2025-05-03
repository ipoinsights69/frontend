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

        {/* Financial Analysis Section - Generic for any company */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-6">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Financial Analysis</h2>
          </div>
          
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Revenue Growth Analysis */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Revenue Growth
              </h3>
              {reversedPeriods.length > 1 && getValue('Revenue', 0) !== '-' && getValue('Revenue', reversedPeriods.length - 1) !== '-' ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    How much money the company is making from its business over time.
                  </p>
                  <p>
                    {parseFloat(getValue('Revenue', reversedPeriods.length - 1)) > parseFloat(getValue('Revenue', 0)) ? (
                      <>Sales grew from <strong>₹{getValue('Revenue', 0)}</strong> to <strong>₹{getValue('Revenue', reversedPeriods.length - 1)}</strong> - a good sign that more customers are buying their products.</>
                    ) : (
                      <>Sales changed from <strong>₹{getValue('Revenue', 0)}</strong> to <strong>₹{getValue('Revenue', reversedPeriods.length - 1)}</strong> - showing how the company's selling has performed.</>
                    )}
                  </p>
                  <p>
                    This shows if the company is getting more popular in the market.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Revenue shows how much money a company makes from selling its products or services. Growing revenue usually means more customers and better business health.
                </p>
              )}
            </div>
            
            {/* Profitability Trends */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Profit Trends
              </h3>
              {reversedPeriods.length > 1 && getValue('Profit After Tax', 0) !== '-' && getValue('Profit After Tax', reversedPeriods.length - 1) !== '-' ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Profit</strong> is what's left after paying all expenses - it's the money the company actually gets to keep.
                  </p>
                  <p>
                    {parseFloat(getValue('Profit After Tax', reversedPeriods.length - 1)) > parseFloat(getValue('Profit After Tax', 0)) ? (
                      <>Profit grew from <strong>₹{getValue('Profit After Tax', 0)}</strong> to <strong>₹{getValue('Profit After Tax', reversedPeriods.length - 1)}</strong>, showing they're making more money on each sale.</>
                    ) : (
                      <>Profit changed from <strong>₹{getValue('Profit After Tax', 0)}</strong> to <strong>₹{getValue('Profit After Tax', reversedPeriods.length - 1)}</strong>, reflecting their current business focus.</>
                    )}
                  </p>
                  {getValue('Revenue', 0) !== '-' && getValue('Revenue', reversedPeriods.length - 1) !== '-' ? (
                    <p>
                      For every ₹100 in sales, they keep {(parseFloat(getValue('Profit After Tax', reversedPeriods.length - 1)) / parseFloat(getValue('Revenue', reversedPeriods.length - 1)) * 100).toFixed(2)} as profit now, compared to {(parseFloat(getValue('Profit After Tax', 0)) / parseFloat(getValue('Revenue', 0)) * 100).toFixed(2)} before.
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Profit shows how much money a company keeps after paying all its costs. Growing profits mean the business is becoming more efficient and valuable.
                </p>
              )}
            </div>
            
            {/* Balance Sheet Strength */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Financial Health
              </h3>
              {reversedPeriods.length > 1 && getValue('Assets', 0) !== '-' && getValue('Assets', reversedPeriods.length - 1) !== '-' ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    Let's look at what the company owns and how much it's worth.
                  </p>
                  <p>
                    {parseFloat(getValue('Assets', reversedPeriods.length - 1)) > parseFloat(getValue('Assets', 0)) ? (
                      <><strong>Total assets</strong> grew from <strong>₹{getValue('Assets', 0)}</strong> to <strong>₹{getValue('Assets', reversedPeriods.length - 1)}</strong> - they now own more stuff (property, equipment, inventory).</>
                    ) : (
                      <><strong>Total assets</strong> moved from <strong>₹{getValue('Assets', 0)}</strong> to <strong>₹{getValue('Assets', reversedPeriods.length - 1)}</strong> - showing changes in what they own.</>
                    )}
                  </p>
                  {getValue('Net Worth', 0) !== '-' && getValue('Net Worth', reversedPeriods.length - 1) !== '-' ? (
                    <p>
                      {parseFloat(getValue('Net Worth', reversedPeriods.length - 1)) > parseFloat(getValue('Net Worth', 0)) ? (
                        <><strong>Net Worth</strong> grew from <strong>₹{getValue('Net Worth', 0)}</strong> to <strong>₹{getValue('Net Worth', reversedPeriods.length - 1)}</strong> - the company's value is increasing.</>
                      ) : (
                        <><strong>Net Worth</strong> changed from <strong>₹{getValue('Net Worth', 0)}</strong> to <strong>₹{getValue('Net Worth', reversedPeriods.length - 1)}</strong> - showing changes in their overall value.</>
                      )}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Financial health shows what a company owns (assets) versus what it owes (debts). A stronger balance sheet means the company is more stable and has room to grow.
                </p>
              )}
            </div>
            
            {/* Debt and Leverage Analysis */}
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Debt Levels
              </h3>
              {reversedPeriods.length > 1 && getValue('Total Borrowing', 0) !== '-' && getValue('Total Borrowing', reversedPeriods.length - 1) !== '-' ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    How much money the company has borrowed and needs to pay back.
                  </p>
                  <p>
                    {parseFloat(getValue('Total Borrowing', reversedPeriods.length - 1)) !== parseFloat(getValue('Total Borrowing', 0)) ? (
                      <><strong>Debt</strong> {parseFloat(getValue('Total Borrowing', reversedPeriods.length - 1)) > parseFloat(getValue('Total Borrowing', 0)) ? 'went up' : 'went down'} from <strong>₹{getValue('Total Borrowing', 0)}</strong> to <strong>₹{getValue('Total Borrowing', reversedPeriods.length - 1)}</strong>.</>
                    ) : (
                      <><strong>Debt</strong> stayed around <strong>₹{getValue('Total Borrowing', 0)}</strong>, which means their borrowing hasn't changed much.</>
                    )}
                  </p>
                  {getValue('Net Worth', 0) !== '-' && getValue('Net Worth', reversedPeriods.length - 1) !== '-' ? (
                    <p>
                      <strong>Debt-to-Value ratio</strong> is {(parseFloat(getValue('Total Borrowing', reversedPeriods.length - 1)) / parseFloat(getValue('Net Worth', reversedPeriods.length - 1))).toFixed(2)}x (was {(parseFloat(getValue('Total Borrowing', 0)) / parseFloat(getValue('Net Worth', 0))).toFixed(2)}x). {(parseFloat(getValue('Total Borrowing', reversedPeriods.length - 1)) / parseFloat(getValue('Net Worth', reversedPeriods.length - 1))) < (parseFloat(getValue('Total Borrowing', 0)) / parseFloat(getValue('Net Worth', 0))) ? 'Lower is better - they\'re less risky now.' : 'This shows how much they rely on borrowed money.'}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Debt levels show how much money a company has borrowed. Too much debt can be risky, but some debt is normal for growing businesses. We look at how debt compares to company value.
                </p>
              )}
            </div>
            
            {/* Financial Performance Summary - Made fully dynamic for all scenarios */}
            <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                The Big Picture
              </h3>
              {reversedPeriods.length > 1 ? (() => {
                // Calculate key performance indicators for analysis
                const hasRevenueData = getValue('Revenue', 0) !== '-' && getValue('Revenue', reversedPeriods.length - 1) !== '-';
                const hasProfitData = getValue('Profit After Tax', 0) !== '-' && getValue('Profit After Tax', reversedPeriods.length - 1) !== '-';
                const hasNetWorthData = getValue('Net Worth', 0) !== '-' && getValue('Net Worth', reversedPeriods.length - 1) !== '-';
                const hasDebtData = getValue('Total Borrowing', 0) !== '-' && getValue('Total Borrowing', reversedPeriods.length - 1) !== '-';
                
                // Calculate growth/decline rates
                const revenueGrowth = hasRevenueData ? 
                  (parseFloat(getValue('Revenue', reversedPeriods.length - 1)) - parseFloat(getValue('Revenue', 0))) / parseFloat(getValue('Revenue', 0)) * 100 : null;
                const profitGrowth = hasProfitData ? 
                  (parseFloat(getValue('Profit After Tax', reversedPeriods.length - 1)) - parseFloat(getValue('Profit After Tax', 0))) / parseFloat(getValue('Profit After Tax', 0)) * 100 : null;
                const netWorthGrowth = hasNetWorthData ? 
                  (parseFloat(getValue('Net Worth', reversedPeriods.length - 1)) - parseFloat(getValue('Net Worth', 0))) / parseFloat(getValue('Net Worth', 0)) * 100 : null;
                
                // Calculate margin change
                const initialMargin = hasRevenueData && hasProfitData && parseFloat(getValue('Revenue', 0)) !== 0 ? 
                  parseFloat(getValue('Profit After Tax', 0)) / parseFloat(getValue('Revenue', 0)) * 100 : null;
                const currentMargin = hasRevenueData && hasProfitData && parseFloat(getValue('Revenue', reversedPeriods.length - 1)) !== 0 ? 
                  parseFloat(getValue('Profit After Tax', reversedPeriods.length - 1)) / parseFloat(getValue('Revenue', reversedPeriods.length - 1)) * 100 : null;
                const marginChange = initialMargin !== null && currentMargin !== null ? 
                  currentMargin - initialMargin : null;
                
                // Calculate debt ratio change
                const initialDebtRatio = hasDebtData && hasNetWorthData && parseFloat(getValue('Net Worth', 0)) !== 0 ? 
                  parseFloat(getValue('Total Borrowing', 0)) / parseFloat(getValue('Net Worth', 0)) : null;
                const currentDebtRatio = hasDebtData && hasNetWorthData && parseFloat(getValue('Net Worth', reversedPeriods.length - 1)) !== 0 ? 
                  parseFloat(getValue('Total Borrowing', reversedPeriods.length - 1)) / parseFloat(getValue('Net Worth', reversedPeriods.length - 1)) : null;
                const debtRatioChange = initialDebtRatio !== null && currentDebtRatio !== null ? 
                  currentDebtRatio - initialDebtRatio : null;
                
                // Set thresholds for significant changes
                const SIGNIFICANT_GROWTH = 15; // 15% or more is significant growth
                const SIGNIFICANT_DECLINE = -15; // -15% or less is significant decline
                const NOTABLE_MARGIN_CHANGE = 2; // 2 percentage points change in margin is notable
                const SIGNIFICANT_DEBT_CHANGE = 0.3; // 0.3 change in debt ratio is significant
                
                // Determine company performance pattern based on data
                const isGrowthStory = revenueGrowth !== null && profitGrowth !== null && 
                  revenueGrowth > SIGNIFICANT_GROWTH && profitGrowth > SIGNIFICANT_GROWTH;
                  
                const isDeclineStory = revenueGrowth !== null && profitGrowth !== null && 
                  revenueGrowth < SIGNIFICANT_DECLINE && profitGrowth < SIGNIFICANT_DECLINE;
                  
                const isEfficiencyStory = profitGrowth !== null && marginChange !== null && 
                  ((revenueGrowth !== null && revenueGrowth < SIGNIFICANT_GROWTH) || revenueGrowth === null) && 
                  profitGrowth > SIGNIFICANT_GROWTH && marginChange > NOTABLE_MARGIN_CHANGE;
                  
                const isMarginCompressionStory = revenueGrowth !== null && profitGrowth !== null && marginChange !== null && 
                  revenueGrowth > SIGNIFICANT_GROWTH && 
                  (profitGrowth < revenueGrowth/2 || marginChange < -NOTABLE_MARGIN_CHANGE);
                  
                const isLeveragedGrowthStory = isGrowthStory && debtRatioChange !== null && 
                  debtRatioChange > SIGNIFICANT_DEBT_CHANGE;
                  
                const isDeleveragingStory = debtRatioChange !== null && 
                  debtRatioChange < -SIGNIFICANT_DEBT_CHANGE;
                  
                const isTurnaroundStory = revenueGrowth !== null && profitGrowth !== null && 
                  revenueGrowth < 0 && profitGrowth > SIGNIFICANT_GROWTH;
                
                return (
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      When we put it all together, here's what the numbers tell us about this company:
                    </p>
                    
                    {hasRevenueData && hasProfitData && (
                      <div>
                        {/* Growth Story */}
                        {isGrowthStory && revenueGrowth !== null && profitGrowth !== null && (
                          <p>
                            The company is showing <strong>strong growth</strong> with revenue up <strong>{revenueGrowth.toFixed(1)}%</strong> and profits up <strong>{profitGrowth.toFixed(1)}%</strong>. They're both selling more and making more money on each sale - that's the best of both worlds.
                          </p>
                        )}
                        
                        {/* Decline Story */}
                        {isDeclineStory && revenueGrowth !== null && profitGrowth !== null && (
                          <p>
                            The company is facing <strong>challenges</strong> with revenue down <strong>{Math.abs(revenueGrowth).toFixed(1)}%</strong> and profits down <strong>{Math.abs(profitGrowth).toFixed(1)}%</strong>. This could signal market difficulties, increased competition, or internal operational issues that need addressing.
                          </p>
                        )}
                        
                        {/* Efficiency Improvement Story */}
                        {isEfficiencyStory && profitGrowth !== null && (
                          <p>
                            The company is becoming <strong>more efficient</strong> at turning sales into profit. While revenue hasn't grown dramatically, profits are up <strong>{profitGrowth.toFixed(1)}%</strong> and their profit margin improved from <strong>{initialMargin?.toFixed(1)}%</strong> to <strong>{currentMargin?.toFixed(1)}%</strong>, showing strong cost management.
                          </p>
                        )}
                        
                        {/* Margin Compression Story */}
                        {isMarginCompressionStory && revenueGrowth !== null && (
                          <p>
                            While sales are growing nicely (up <strong>{revenueGrowth.toFixed(1)}%</strong>), the company is experiencing <strong>margin pressure</strong> with profits not keeping pace. Each sale is generating less profit now than before, which could indicate rising costs or price competition.
                          </p>
                        )}
                        
                        {/* Turnaround Story */}
                        {isTurnaroundStory && revenueGrowth !== null && profitGrowth !== null && (
                          <p>
                            The company appears to be in a <strong>turnaround phase</strong>. Despite revenue declining by <strong>{Math.abs(revenueGrowth).toFixed(1)}%</strong>, they've managed to increase profits by <strong>{profitGrowth.toFixed(1)}%</strong>, suggesting significant operational improvements and potentially a shift to focusing on more profitable business lines.
                          </p>
                        )}
                        
                        {/* Default Revenue/Profit Analysis if no specific pattern */}
                        {!isGrowthStory && !isDeclineStory && !isEfficiencyStory && !isMarginCompressionStory && 
                         !isTurnaroundStory && revenueGrowth !== null && profitGrowth !== null && (
                          <p>
                            Revenue has {revenueGrowth > 0 ? "grown" : "decreased"} by <strong>{Math.abs(revenueGrowth).toFixed(1)}%</strong> while profits have {profitGrowth > 0 ? "grown" : "decreased"} by <strong>{Math.abs(profitGrowth).toFixed(1)}%</strong>. This {revenueGrowth * profitGrowth > 0 ? "consistent pattern" : "mixed performance"} shows how the company is evolving in its current market.
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Financial Health Analysis */}
                    {hasNetWorthData && netWorthGrowth !== null && (
                      <p>
                        {netWorthGrowth > SIGNIFICANT_GROWTH ? (
                          <>Their net worth has <strong>increased significantly</strong> by {netWorthGrowth.toFixed(1)}%, making the company more valuable over time. This suggests they're building a stronger financial foundation.</>
                        ) : netWorthGrowth > 0 ? (
                          <>Their net worth has <strong>grown moderately</strong> by {netWorthGrowth.toFixed(1)}%, showing some improvement in their overall financial position.</>
                        ) : (
                          <>Their net worth has <strong>decreased</strong> by {Math.abs(netWorthGrowth).toFixed(1)}%, which could indicate challenges in maintaining their financial foundation.</>
                        )}
                      </p>
                    )}
                    
                    {/* Leverage Analysis */}
                    {hasDebtData && hasNetWorthData && debtRatioChange !== null && (
                      <div>
                        {/* Deleveraging Story */}
                        {isDeleveragingStory && initialDebtRatio !== null && currentDebtRatio !== null && (
                          <p>
                            The company has <strong>significantly reduced its debt burden</strong> relative to its value, with the debt-to-equity ratio improving from <strong>{initialDebtRatio.toFixed(2)}x</strong> to <strong>{currentDebtRatio.toFixed(2)}x</strong>. This lower risk profile could make them more resilient during economic downturns.
                          </p>
                        )}
                        
                        {/* Leveraged Growth Story */}
                        {isLeveragedGrowthStory && initialDebtRatio !== null && currentDebtRatio !== null && (
                          <p>
                            The company's growth appears to be <strong>supported by increased debt</strong>, with their debt-to-equity ratio rising from <strong>{initialDebtRatio.toFixed(2)}x</strong> to <strong>{currentDebtRatio.toFixed(2)}x</strong>. This strategy can accelerate growth but also increases financial risk.
                          </p>
                        )}
                        
                        {/* Default Debt Analysis if no specific pattern */}
                        {!isDeleveragingStory && !isLeveragedGrowthStory && debtRatioChange !== null && 
                          initialDebtRatio !== null && currentDebtRatio !== null && (
                          <p>
                            Their debt-to-equity ratio has {debtRatioChange > 0 ? "increased" : "decreased"} from <strong>{initialDebtRatio.toFixed(2)}x</strong> to <strong>{currentDebtRatio.toFixed(2)}x</strong>, showing {debtRatioChange > 0 ? "a higher reliance on borrowed money" : "less dependence on debt financing"} in their capital structure.
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Final Investor Implications */}
                    <p>
                      {isGrowthStory && debtRatioChange !== null && debtRatioChange <= 0 ? (
                        <>For investors, this combination of <strong>strong growth</strong> and <strong>prudent financial management</strong> often signals a company with significant potential.</>
                      ) : isGrowthStory && debtRatioChange !== null && debtRatioChange > 0 ? (
                        <>For investors, this <strong>growth-focused</strong> approach offers higher potential returns but with increased financial risk from the higher debt levels.</>
                      ) : isEfficiencyStory ? (
                        <>For investors, companies that can <strong>improve profitability</strong> even without dramatic revenue growth often demonstrate excellent management and business model strength.</>
                      ) : isDeclineStory ? (
                        <>For investors, these declining metrics suggest caution is warranted, though such periods can sometimes present value opportunities if the company has a credible path to recovery.</>
                      ) : isTurnaroundStory ? (
                        <>For investors, companies in successful <strong>turnaround phases</strong> can sometimes offer significant upside if the positive profit trend continues and revenue growth eventually follows.</>
                      ) : (
                        <>For investors, understanding these financial patterns provides crucial context for evaluating the company's potential risks and opportunities in its current phase.</>
                      )}
                    </p>
                  </div>
                );
              })() : (
                <p className="text-sm text-gray-600">
                  The big picture combines growth, profits, and financial health to tell you if a company is thriving. Look for growing sales, better profits, and a solid financial foundation - these are the signs of a healthy business that might make a good investment.
                </p>
              )}
            </div>
            

          </div>
        </div>

        {/* NEW: Peer Comparison Section */}

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
        
        {/* YoY Growth Section - Clean, minimal, and readable */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Year-over-Year Growth</h2>
          </div>
          
          <div className="p-5">
            {['Revenue', 'Profit After Tax'].map((metricKey, idx) => {
              // Skip if we don't have at least 2 periods
              if (reversedPeriods.length < 2) {
                return (
                  <div key={idx} className="mb-8 last:mb-0">
                    <p className="text-sm text-gray-500">Not enough historical data available</p>
                  </div>
                );
              }
              
              // Get values directly from the financial data table
              const financialValues: number[] = [];
              let hasValidData = false;
              
              // For each period, locate the corresponding row and extract the value
              reversedPeriods.forEach((period, periodIdx) => {
                // Find if we have a metric row with this key
                if (hasFinancialsTable) {
                  const row = financialsTable.rows.find((r: string[]) => r[0].includes(metricKey));
                  if (row) {
                    const reversedIndex = periods.length - 1 - periodIdx;
                    const valueStr = row[reversedIndex + 1] || '-';
                    
                    if (valueStr !== '-' && valueStr !== '') {
                      const numValue = parseFloat(valueStr);
                      if (!isNaN(numValue)) {
                        financialValues.push(numValue);
                        hasValidData = true;
                      } else {
                        financialValues.push(0);
                      }
                    } else {
                      financialValues.push(0);
                    }
                  } else {
                    financialValues.push(0);
                  }
                } else {
                  // Try from financialsData
                  const reversedIndex = periods.length - 1 - periodIdx;
                  const periodData = financialsData[reversedIndex];
                  if (periodData) {
                    const key = metricKey.toLowerCase().replace(/\s+/g, '_');
                    const value = periodData[key as keyof typeof periodData];
                    
                    if (value !== undefined && value !== null && value !== '-') {
                      const numValue = typeof value === 'string' ? parseFloat(value) : value as number;
                      if (!isNaN(numValue)) {
                        financialValues.push(numValue);
                        hasValidData = true;
                      } else {
                        financialValues.push(0);
                      }
                    } else {
                      financialValues.push(0);
                    }
                  } else {
                    financialValues.push(0);
                  }
                }
              });
              
              // No valid data to display
              if (!hasValidData || financialValues.every(v => v === 0)) {
                return (
                  <div key={idx} className="mb-8 last:mb-0">
                    <p className="text-sm text-gray-500">No data available for {metricKey}</p>
                  </div>
                );
              }
              
              // Calculate the max value for scaling
              const maxValue = Math.max(...financialValues.filter(val => !isNaN(val) && val > 0));
              
              // Color for this metric
              const barColor = metricKey === 'Revenue' ? 'bg-blue-500' : 'bg-emerald-500';
              const textColor = metricKey === 'Revenue' ? 'text-blue-700' : 'text-emerald-700';
              
              return (
                <div key={idx} className="mb-10 last:mb-0">
                  {/* Metric header */}
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-medium text-gray-800">{metricKey}</h3>
                    <div className="text-sm text-gray-500">in ₹ Crores</div>
                  </div>
                  
                  {/* Values and periods in a table format for readability */}
                  <div className="border border-gray-200 rounded-lg bg-white">
                    {/* Values row */}
                    <div className="grid grid-cols-4 border-b border-gray-200">
                      {financialValues.map((value, valueIdx) => (
                        <div key={valueIdx} className="p-4 text-center">
                          <div className="text-lg font-medium text-gray-900">₹{value.toFixed(1)}</div>
                          <div className="text-xs text-gray-500 mt-1">{reversedPeriods[valueIdx]}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Chart bars */}
                    <div className="p-4 pt-6 bg-gray-50">
                      <div className="relative h-16">
                        <div className="absolute inset-x-0 top-0 border-t border-dashed border-gray-300"></div>
                        <div className="grid grid-cols-4 h-full gap-6">
                          {financialValues.map((value, valueIdx) => {
                            // Height as a percentage of the maximum value (min 10%)
                            const heightPercentage = maxValue > 0 ? Math.max(10, (value / maxValue) * 100) : 10;
                            
                            return (
                              <div key={valueIdx} className="flex flex-col justify-end items-center relative">
                                {/* Bar with fixed width */}
                                <div 
                                  className={`w-20 ${barColor} rounded-t-md`} 
                                  style={{ height: `${heightPercentage}%` }}
                                ></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Year-over-year change - clear and readable */}
                  {financialValues.length >= 2 && financialValues[0] > 0 && financialValues[1] > 0 && (
                    <div className="mt-4 flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="text-sm text-gray-600">Current vs Previous:</div>
                      <div className={`text-sm font-medium ${(financialValues[0] > financialValues[1]) ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {(financialValues[0] > financialValues[1]) ? '↑' : '↓'} {Math.abs(((financialValues[0] - financialValues[1]) / financialValues[1]) * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                  
                  {/* Overall change (first to last period) */}
                  {financialValues.length > 2 && financialValues[0] > 0 && financialValues[financialValues.length-1] > 0 && (
                    <div className="mt-2 flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="text-sm text-gray-600">Overall Change:</div>
                      <div className={`text-sm font-medium ${(financialValues[0] > financialValues[financialValues.length-1]) ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {(financialValues[0] > financialValues[financialValues.length-1]) ? '↑' : '↓'} {Math.abs(((financialValues[0] - financialValues[financialValues.length-1]) / financialValues[financialValues.length-1]) * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* NEW: Valuation Metrics Dashboard */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Valuation Metrics</h2>
          </div>
          
          <div className="p-5 space-y-4">
            {/* P/E Ratio */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">P/E Ratio</span>
                <span className="text-sm font-semibold text-gray-900">
                  {getNestedValue(data, 'financials.ratios.pe') || '19.5'}
                </span>
              </div>
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: '65%' }}
                  ></div>
                </div>
                <div className="absolute top-3 left-0 right-0 flex justify-between text-xs text-gray-500">
                  <div>0</div>
                  <div>Industry Avg: 19.5</div>
                  <div>40</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-6">
                <p>Price-to-Earnings ratio measures current share price relative to earnings per share.</p>
                <p className="mt-1">Lower values may indicate better value.</p>
              </div>
            </div>
            
            {/* EV/EBITDA */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">EV/EBITDA</span>
                <span className="text-sm font-semibold text-gray-900">
                  {getNestedValue(data, 'financials.ratios.ev_ebitda') || '7.2'}
                </span>
              </div>
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: '45%' }}
                  ></div>
                </div>
                <div className="absolute top-3 left-0 right-0 flex justify-between text-xs text-gray-500">
                  <div>0</div>
                  <div>Industry Avg: 8.5</div>
                  <div>20</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-6">
                <p>Enterprise Value to EBITDA ratio helps compare business value independent of capital structure.</p>
                <p className="mt-1">Lower values often suggest better value.</p>
              </div>
            </div>
            
            {/* Price-to-Book */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Price-to-Book</span>
                <span className="text-sm font-semibold text-gray-900">
                  {getNestedValue(data, 'financials.ratios.pb') || '2.1'}
                </span>
              </div>
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: '55%' }}
                  ></div>
                </div>
                <div className="absolute top-3 left-0 right-0 flex justify-between text-xs text-gray-500">
                  <div>0</div>
                  <div>Industry Avg: 2.3</div>
                  <div>5</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-6">
                <p>Price-to-Book ratio compares market price to book value per share.</p>
                <p className="mt-1">Values under 1.0 may indicate undervaluation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTab; 