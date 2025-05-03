import React from 'react';
import Link from 'next/link';
import { fetchAllIPOs } from '@/app/api/ipos/handlers';
import { getApiUrl } from '@/config/apiConfig';

// Enable ISR with a revalidation period of 1 hour
export const revalidate = 3600;

interface IPOItem {
  id: string;
  ipo_id?: string;
  companyName?: string;
  company_name?: string;
  status?: string;
}

async function getAllIPOs() {
  try {
    // Try to fetch from API first
    const response = await fetch(getApiUrl('api/ipos/ids'), {
      next: { revalidate }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch IPOs: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching IPOs from API, falling back to handlers:', error);
    // Fallback to handlers
    return await fetchAllIPOs();
  }
}

export default async function IPOsListPage() {
  const ipos = await getAllIPOs();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            All IPOs
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Complete list of all IPOs tracked on our platform
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {ipos.map((ipo: IPOItem) => {
              // Handle different API response formats
              const id = ipo.id || ipo.ipo_id || '';
              const name = ipo.companyName || ipo.company_name || id;
              
              return (
                <li key={id}>
                  <Link 
                    href={`/ipo/${id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                            ${ipo.status === 'open' ? 'bg-green-100 text-green-600' : 
                              ipo.status === 'upcoming' ? 'bg-blue-100 text-blue-600' :
                              ipo.status === 'closed' ? 'bg-orange-100 text-orange-600' :
                              'bg-gray-100 text-gray-600'}`}
                          >
                            {name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {name}
                          </div>
                          {ipo.status && (
                            <div className="text-sm text-gray-500">
                              Status: <span className="capitalize">{ipo.status}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
} 