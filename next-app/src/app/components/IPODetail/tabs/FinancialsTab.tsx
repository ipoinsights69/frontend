'use client';

import React from 'react';

interface FinancialsTabProps {
  ipoData: any;
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({ ipoData }) => {
  // Extract financials from various sources in the data
  const financials = ipoData.financials || {};
  const additionalTables = ipoData.additionalTables || [];
  
  // Find tables with financial information
  const financialTables = additionalTables.filter((table: any) => 
    table.sanitizedHeading?.toLowerCase().includes('financials') ||
    table.heading?.toLowerCase().includes('financial')
  );

  if (!financials && financialTables.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Financial information not available</h3>
        <p className="text-gray-600">Financial details for this IPO will be added soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Financial Tables from additionalTables */}
      {financialTables.map((table: any, tableIndex: number) => (
        <div key={tableIndex} className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
          <h2 className="text-base font-medium text-gray-800 mb-3">{table.heading}</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {table.headers.map((header: string, index: number) => (
                  <th 
                    key={index} 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header || ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {cell || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Financial Ratios */}
      {financials.ratios && (
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Key Financial Ratios</h2>
          <div className="space-y-2">
            {Object.entries(financials.ratios).map(([key, value]: [string, any]) => (
              <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {value !== null && value !== undefined ? String(value) : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EPS Data */}
      {financials.eps && (
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Earnings Per Share</h2>
          <div className="space-y-2">
            {Object.entries(financials.eps).map(([key, value]: [string, any]) => (
              <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  {key === 'pre' ? 'Pre-IPO EPS' :
                   key === 'post' ? 'Post-IPO EPS' :
                   key === 'pe_pre' ? 'Pre-IPO P/E Ratio' :
                   key === 'pe_post' ? 'Post-IPO P/E Ratio' :
                   key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {value !== null && value !== undefined ? 
                    (typeof value === 'number' ? value.toFixed(2) : String(value)) : 
                    'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Financial Information - Stock Quote & Charts */}
      {additionalTables.filter((table: any) => 
        table.sanitizedHeading?.toLowerCase().includes('stock_quote') ||
        table.heading?.toLowerCase().includes('stock quote')
      ).map((table: any, tableIndex: number) => (
        <div key={`stock-${tableIndex}`} className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">{table.heading}</h2>
          <div className="space-y-2">
            {table.rows.map((row: any, rowIndex: number) => (
              <div key={rowIndex} className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-sm text-gray-600">{row[0] || ''}</span>
                <span className="text-sm font-medium text-gray-800">{row[1] || ''}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialsTab; 