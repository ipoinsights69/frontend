import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';

interface FinancialsTabProps {
  data: IPODetailedData;
}

const FinancialsTab = ({ data }: FinancialsTabProps) => {
  const financialsData = data.financials?.data || [];
  
  if (financialsData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-6 flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">No financial data available for this IPO.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Financial Tables */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-800">Financial Performance</h2>
            <p className="text-xs text-gray-500 mt-1">All figures in Crores (₹)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Particulars
                  </th>
                  {financialsData.map((item, idx) => (
                    <th 
                      key={idx}
                      scope="col" 
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {item.period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {['assets', 'revenue', 'profit', 'net_worth', 'total_borrowing'].map((metric, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                      {metric.replace('_', ' ').charAt(0).toUpperCase() + metric.replace('_', ' ').slice(1)}
                    </td>
                    {financialsData.map((item, dataIdx) => (
                      <td 
                        key={dataIdx}
                        className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600"
                      >
                        {item[metric as keyof typeof item] !== undefined ? item[metric as keyof typeof item] : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Key Financial Ratios</h2>
          <div className="space-y-4">
            {[
              { key: 'roe', label: 'ROE', path: 'financials.ratios.roe' },
              { key: 'roce', label: 'ROCE', path: 'financials.ratios.roce' },
              { key: 'pat_margin', label: 'PAT Margin', path: 'financials.ratios.pat_margin' },
              { key: 'debt_equity', label: 'Debt/Equity', path: 'financials.ratios.debt_equity' }
            ].map((ratio, idx) => {
              const value = getNestedValue(data, ratio.path);
              const percentage = ratio.key !== 'debt_equity' ? (value || 0) : (value || 0) * 50;
              
              return (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{ratio.label}</span>
                    <span className="text-sm font-medium text-gray-800">
                      {value !== undefined ? (ratio.key !== 'debt_equity' ? `${value}%` : `${value}x`) : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
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