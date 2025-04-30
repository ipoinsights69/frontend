'use client';

import React from 'react';
import { IPODetailedData } from '@/app/types/IPO';

interface FinancialsTabProps {
  ipoData: IPODetailedData;
  formattedData?: Record<string, any>;
  config?: {
    sections: Record<string, boolean>;
    fieldsMapping: Record<string, Record<string, string>>;
    formatConfig: Record<string, any>;
  };
}

// Define the financial data item type
interface FinancialDataItem {
  period: string;
  revenue?: number;
  profit?: number;
  assets?: number;
  net_worth?: number;
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({ 
  ipoData,
  formattedData = {},
  config
}) => {
  // Get financials data from formatted structure or fallback to direct access
  const financialsData = formattedData?.financials?.data || ipoData.financials?.data || [];
  const ratios = formattedData?.financials?.ratios || ipoData.financials?.ratios;
  const eps = formattedData?.financials?.eps || ipoData.financials?.eps;
  
  // Format currency value
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Check if we have data to display
  const hasData = financialsData && financialsData.length > 0;
  const hasRatios = ratios && Object.keys(ratios).length > 0;
  const hasEps = eps && Object.keys(eps).length > 0;

  // If no financial data is available
  if (!hasData && !hasRatios && !hasEps) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Data Not Available</h3>
        <p className="text-gray-600">
          Detailed financial information for this IPO is currently not available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Performance */}
      {hasData && (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-medium text-gray-800">Financial Performance</h3>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-4 py-2 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-2 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit After Tax
                  </th>
                  <th className="px-4 py-2 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Assets
                  </th>
                  <th className="px-4 py-2 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Worth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialsData.map((item: FinancialDataItem, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                      {item.period}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 text-right whitespace-nowrap">
                      {item.revenue ? formatCurrency(item.revenue) : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 text-right whitespace-nowrap">
                      {item.profit ? formatCurrency(item.profit) : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 text-right whitespace-nowrap">
                      {item.assets ? formatCurrency(item.assets) : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 text-right whitespace-nowrap">
                      {item.net_worth ? formatCurrency(item.net_worth) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Ratios */}
        {hasRatios && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-medium text-gray-800">Financial Ratios</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {ratios.roe !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Return on Equity (ROE)</span>
                    <span className="text-sm font-medium text-gray-800">
                      {ratios.roe.toFixed(2)}%
                    </span>
                  </div>
                )}
                {ratios.roce !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Return on Capital Employed (ROCE)</span>
                    <span className="text-sm font-medium text-gray-800">
                      {ratios.roce.toFixed(2)}%
                    </span>
                  </div>
                )}
                {ratios.pat_margin !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">PAT Margin</span>
                    <span className="text-sm font-medium text-gray-800">
                      {ratios.pat_margin.toFixed(2)}%
                    </span>
                  </div>
                )}
                {ratios.debt_equity !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Debt Equity Ratio</span>
                    <span className="text-sm font-medium text-gray-800">
                      {ratios.debt_equity.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EPS & Valuation */}
        {hasEps && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-medium text-gray-800">EPS & Valuation</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {eps.pre !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">EPS (Pre-Issue)</span>
                    <span className="text-sm font-medium text-gray-800">
                      ₹{eps.pre.toFixed(2)}
                    </span>
                  </div>
                )}
                {eps.post !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">EPS (Post-Issue)</span>
                    <span className="text-sm font-medium text-gray-800">
                      ₹{eps.post.toFixed(2)}
                    </span>
                  </div>
                )}
                {eps.pe_pre !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P/E Ratio (Pre-Issue)</span>
                    <span className="text-sm font-medium text-gray-800">
                      {eps.pe_pre.toFixed(2)}x
                    </span>
                  </div>
                )}
                {eps.pe_post !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P/E Ratio (Post-Issue)</span>
                    <span className="text-sm font-medium text-gray-800">
                      {eps.pe_post.toFixed(2)}x
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Notes about the financial data */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Financial data is based on the company's restated consolidated financial statements as disclosed in the IPO documents.</p>
      </div>
    </div>
  );
};

export default FinancialsTab; 