import { useEffect, useRef } from 'react';
import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';

interface StickyCardProps {
  data: IPODetailedData;
}

const StickyCard = ({ data }: StickyCardProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only import and init chart.js on client side
    if (typeof window !== 'undefined' && chartRef.current) {
      import('chart.js').then(({ Chart, registerables }) => {
        Chart.register(...registerables);
        
        // Clear any existing charts
        Chart.getChart(chartRef.current!)?.destroy();
        
        // Create new chart
        new Chart(chartRef.current!, {
          type: 'line',
          data: {
            labels: ['9:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'],
            datasets: [{
              label: 'Price',
              data: data.listingDayPrices || [
                (data.listingPrice || 0) * 0.98, 
                (data.listingPrice || 0) * 0.99, 
                (data.listingPrice || 0) * 1.01, 
                (data.listingPrice || 0) * 1.005, 
                (data.listingPrice || 0) * 1.02, 
                (data.listingPrice || 0) * 1.03, 
                (data.listingPrice || 0) * 1.025, 
                (data.listingPrice || 0) * 1.03
              ],
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                ticks: {
                  font: {
                    size: 10
                  }
                },
                grid: {
                  display: true,
                  drawOnChartArea: true
                }
              },
              x: {
                ticks: {
                  font: {
                    size: 10
                  }
                },
                grid: {
                  display: false
                }
              }
            }
          }
        });
      });
    }
  }, [data.listingPrice, data.listingDayPrices]);

  // Calculate percentage values for progress bars
  const getSubscriptionPercentage = (value: number) => {
    if (!value || value < 0) return 0;
    return Math.min(value * 25, 100); // Scale: 1x = 25%, 4x = 100%
  };

  const listingGain = data.listingGainPercentage || 0;
  const overallSubscription = Number(data.overallSubscription) || 0;
  const retailSubscription = Number(data.retailSubscription) || 0;
  const niiSubscription = Number(data.niiSubscription) || 0;
  const issuePrice = data.priceRange?.max || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-md sticky top-4">
      {/* Listing Day Performance */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Listing Day Performance</h3>
        <div className="text-center mb-3">
          <div className={`text-3xl font-semibold ${listingGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {listingGain > 0 ? '+' : ''}{listingGain.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-600">
            Listed at ₹{data.listingPrice || 0} vs Issue Price ₹{issuePrice}
          </div>
        </div>
        <div className="h-36">
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
          <div>
            <div className="text-gray-500">Open</div>
            <div className="font-medium text-green-600">₹{((data.listingDayPrices?.[0] || data.listingPrice || 0)).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-500">High</div>
            <div className="font-medium text-green-600">₹{Math.max(...(data.listingDayPrices || [data.listingPrice || 0])).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-500">Low</div>
            <div className="font-medium text-green-600">₹{Math.min(...(data.listingDayPrices || [data.listingPrice || 0])).toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Subscription Status */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Subscription Status</h3>
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600">Overall</span>
            <span className="text-xs font-medium text-gray-700">{overallSubscription.toFixed(2)}x</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${getSubscriptionPercentage(overallSubscription)}%` }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">Retail</span>
              <span className="text-xs font-medium text-gray-700">{retailSubscription.toFixed(2)}x</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-600 h-1.5 rounded-full" 
                style={{ width: `${getSubscriptionPercentage(retailSubscription)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">NII</span>
              <span className="text-xs font-medium text-gray-700">{niiSubscription.toFixed(2)}x</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-purple-600 h-1.5 rounded-full" 
                style={{ width: `${getSubscriptionPercentage(niiSubscription)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Total Applications: {data.totalApplications || 'N/A'}
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Key Metrics</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">ROE</span>
            <span className="text-xs font-medium text-gray-800">
              {getNestedValue(data, 'financials.ratios.roe') ? `${getNestedValue(data, 'financials.ratios.roe')}%` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">ROCE</span>
            <span className="text-xs font-medium text-gray-800">
              {getNestedValue(data, 'financials.ratios.roce') ? `${getNestedValue(data, 'financials.ratios.roce')}%` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">P/E (Post IPO)</span>
            <span className="text-xs font-medium text-gray-800">
              {getNestedValue(data, 'financials.eps.pe_post') ? `${getNestedValue(data, 'financials.eps.pe_post')}x` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">EPS (Post IPO)</span>
            <span className="text-xs font-medium text-gray-800">
              {getNestedValue(data, 'financials.eps.post') ? `₹${getNestedValue(data, 'financials.eps.post')}` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Lot Size</span>
            <span className="text-xs font-medium text-gray-800">
              {data.lotSize ? `${data.lotSize} shares (₹${data.lotSize * (data.priceRange?.max || 0)})` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCard; 