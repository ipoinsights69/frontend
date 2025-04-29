'use client';

import React from 'react';
import Image from 'next/image';

interface TableColumn {
  key: string;
  title: string;
  render?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  title?: string;
  description?: string;
  columns: TableColumn[];
  data: any[] | any;
  showActions?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  description, 
  columns, 
  data, 
  showActions = false 
}) => {
  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : data?.data || [];

  return (
    <section className="container mx-auto">
      {title && <h2 className="text-lg font-medium text-gray-800">{title}</h2>}
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th 
                        key={column.key} 
                        scope="col" 
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        {column.title}
                      </th>
                    ))}
                    {showActions && (
                      <th scope="col" className="relative py-3.5 px-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataArray.length > 0 ? (
                    dataArray.map((item: any, index: number) => (
                      <tr key={index}>
                        {columns.map((column) => (
                          <td key={`${index}-${column.key}`} className="px-4 py-4 text-sm whitespace-nowrap">
                            {column.render ? column.render(item) : item[column.key]}
                          </td>
                        ))}
                        {showActions && (
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <button className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                              </svg>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-4 py-8 text-sm text-center text-gray-500">
                        No data available
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

export default DataTable; 