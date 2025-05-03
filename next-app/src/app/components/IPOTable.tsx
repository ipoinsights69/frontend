'use client';

import React from 'react';
import { IPO } from '@/app/types/IPO';

interface IPOTableProps {
  title: string;
  description: string;
  ipos: IPO[];
  columns: Array<{
    key: string;
    label: string;
    render?: (ipo: IPO) => React.ReactNode;
  }>;
  viewAllLink?: string;
}

const IPOTable: React.FC<IPOTableProps> = ({ 
  title, 
  description, 
  ipos, 
  columns,
  viewAllLink 
}) => {
  // Format date display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Format price display
  const formatPrice = (ipo: IPO) => {
    if (ipo.priceRange) {
      return `₹${ipo.priceRange.min}-${ipo.priceRange.max}`;
    }
    if (ipo.cutOffPrice) {
      return `₹${ipo.cutOffPrice}`;
    }
    if (ipo.issueSize) {
      return `₹${ipo.issueSize} Cr`;
    }
    return 'N/A';
  };

  // Generate a status badge based on IPO status
  const getStatusBadge = (ipo: IPO) => {
    switch (ipo.status) {
      case 'upcoming':
        return (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-blue-500 gap-x-2 bg-blue-100/60">
            Upcoming
          </div>
        );
      case 'open':
        return (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60">
            Open
          </div>
        );
      case 'closed':
        return (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-orange-500 gap-x-2 bg-orange-100/60">
            Closed
          </div>
        );
      case 'listed':
        return (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-gray-500 gap-x-2 bg-gray-100">
            Listed
          </div>
        );
      default:
        return (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-gray-500 gap-x-2 bg-gray-100">
            {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
          </div>
        );
    }
  };

  // Get cell value based on column key
  const getCellValue = (ipo: IPO, key: string) => {
    switch (key) {
      case 'company':
        return (
          <div>
            <h2 className="font-medium text-gray-800">{ipo.companyName}</h2>
            <p className="text-sm font-normal text-gray-600">{ipo.listingAt || ipo.industry || ''}</p>
          </div>
        );
      case 'status':
        return getStatusBadge(ipo);
      case 'date':
        if (ipo.status === 'upcoming' || ipo.status === 'open') {
          return (
            <div>
              <p className="text-gray-700">{formatDate(ipo.openDate)}</p>
              <p className="text-gray-500">{formatDate(ipo.closeDate)}</p>
            </div>
          );
        } else if (ipo.status === 'listed') {
          return (
            <div>
              <p className="text-gray-700">{formatDate(ipo.listingDate)}</p>
            </div>
          );
        } else {
          return (
            <div>
              <p className="text-gray-700">{formatDate(ipo.closeDate)}</p>
            </div>
          );
        }
      case 'price':
        return (
          <div>
            <p className="text-gray-700">{formatPrice(ipo)}</p>
          </div>
        );
      case 'issueSize':
        return (
          <div>
            <p className="text-gray-700">{ipo.issueSize ? `₹${ipo.issueSize} Cr` : 'N/A'}</p>
          </div>
        );
      case 'listingGain':
        if (ipo.listingGainPercentage !== undefined) {
          const isPositive = ipo.listingGainPercentage >= 0;
          return (
            <div className={`inline px-3 py-1 text-sm font-normal rounded-full ${isPositive ? 'text-emerald-500 bg-emerald-100/60' : 'text-red-500 bg-red-100/60'}`}>
              {isPositive ? '+' : ''}{ipo.listingGainPercentage.toFixed(2)}%
            </div>
          );
        }
        return 'N/A';
      default:
        // Use custom render function if provided
        const column = columns.find(col => col.key === key);
        if (column?.render) {
          return column.render(ipo);
        }
        return 'N/A';
    }
  };

  return (
    <section className="container px-4 mx-auto my-12">
      <h2 className="text-lg font-medium text-gray-800">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, index) => (
                      <th 
                        key={index}
                        scope="col" 
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        <div className="flex items-center gap-x-3">
                          <span>{column.label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ipos.length > 0 ? (
                    ipos.map((ipo, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {columns.map((column, colIndex) => (
                          <td key={colIndex} className="px-4 py-4 text-sm whitespace-nowrap">
                            {getCellValue(ipo, column.key)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-8 text-sm text-center text-gray-500">
                        No IPOs available in this category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IPOTable; 