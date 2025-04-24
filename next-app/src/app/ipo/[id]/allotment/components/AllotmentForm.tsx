'use client';

import React, { useState } from 'react';
import { IPO } from '@/app/types/IPO';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

interface AllotmentFormProps {
  ipoData: IPO;
}

type SearchMethod = 'pan' | 'application' | 'demat';

interface AllotmentResult {
  status: 'success' | 'not_found';
  name?: string;
  applicationNumber?: string;
  pan?: string;
  category?: string;
  bidDetails?: Array<{
    bidPrice: number;
    quantity: number;
    allotted: number;
  }>;
  accountDebit?: string;
  refundAmount?: string;
  refundDate?: string;
  sharesCredit?: {
    date: string;
    quantity: number;
    depositoryParticipant: string;
  };
}

export default function AllotmentForm({ ipoData }: AllotmentFormProps) {
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('pan');
  const [applicationNumber, setApplicationNumber] = useState('');
  const [pan, setPan] = useState('');
  const [dpId, setDpId] = useState('');
  const [clientId, setClientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allotmentResult, setAllotmentResult] = useState<AllotmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  const formSchema = z.object({
    pan: searchMethod === 'pan' ? z.string().length(10, { message: 'PAN must be 10 characters' }) : z.string().optional(),
    applicationNumber: searchMethod === 'application' ? z.string().min(1, { message: 'Application number is required' }) : z.string().optional(),
    dpId: searchMethod === 'demat' ? z.string().min(1, { message: 'DP ID is required' }) : z.string().optional(),
    clientId: searchMethod === 'demat' ? z.string().min(1, { message: 'Client ID is required' }) : z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pan: '',
      applicationNumber: '',
      dpId: '',
      clientId: '',
    },
  });

  const checkAllotmentStatus = async (
    ipoId: string, 
    method: SearchMethod, 
    searchValue: string, 
    dpId?: string, 
    clientId?: string
  ) => {
    try {
      // Create query parameters based on search method
      const params = new URLSearchParams();
      params.append('ipoId', ipoId);
      params.append('method', method);
      
      if (method === 'pan') {
        params.append('pan', searchValue);
      } else if (method === 'application') {
        params.append('applicationNumber', searchValue);
      } else if (method === 'demat') {
        params.append('dpId', dpId || '');
        params.append('clientId', clientId || '');
      }
      
      const response = await fetch(`/api/ipo/allotment?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to check allotment status');
      }
      
      const data = await response.json();
      setAllotmentResult(data);
    } catch (err) {
      console.error('Error checking allotment status:', err);
      throw new Error('Failed to check allotment status. Please try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate input based on search method
      if (searchMethod === 'application' && !applicationNumber) {
        throw new Error('Please enter a valid application number');
      }

      if (searchMethod === 'pan' && !pan) {
        throw new Error('Please enter a valid PAN number');
      }

      if (searchMethod === 'demat' && (!dpId || !clientId)) {
        throw new Error('Please enter both DP ID and Client ID');
      }

      // Determine search value based on method
      let searchValue = '';
      if (searchMethod === 'application') searchValue = applicationNumber;
      if (searchMethod === 'pan') searchValue = pan;

      // Check allotment status
      await checkAllotmentStatus(
        id,
        searchMethod,
        searchValue,
        dpId,
        clientId
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAllotmentResult(null);
    setError(null);
    setApplicationNumber('');
    setPan('');
    setDpId('');
    setClientId('');
  };

  const handleTabChange = (method: SearchMethod) => {
    setSearchMethod(method);
    setError(null);
  };

  return (
    <>
      {!allotmentResult ? (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-800">Check Allotment Status</h2>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="ipo-select" className="block text-sm font-medium text-gray-700 mb-2">Select IPO</label>
              <div className="relative">
                <select 
                  id="ipo-select" 
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                  defaultValue={ipoData.id}
                >
                  <option value={ipoData.id}>{ipoData.companyName} IPO</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
              <div className="mt-1 flex items-center">
                <span className="text-xs text-gray-500 mr-2">Allotment Date: {ipoData.allotmentDate || 'N/A'}</span>
                <span className="bg-green-50 text-green-600 text-xs px-1.5 py-0.5 rounded">
                  {ipoData.status === 'listed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Search Type Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <div className="flex -mb-px">
                <button 
                  className={`py-2 px-4 border-b-2 text-sm font-medium ${searchMethod === 'pan' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabChange('pan')}
                >
                  <i className="far fa-id-card mr-1"></i> PAN
                </button>
                <button 
                  className={`py-2 px-4 border-b-2 text-sm font-medium ${searchMethod === 'application' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabChange('application')}
                >
                  <i className="far fa-file-alt mr-1"></i> Application No.
                </button>
                <button 
                  className={`py-2 px-4 border-b-2 text-sm font-medium ${searchMethod === 'demat' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabChange('demat')}
                >
                  <i className="far fa-folder-open mr-1"></i> DPID/Client ID
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="search-tab-content">
              <form onSubmit={handleSubmit}>
                {/* PAN Input */}
                {searchMethod === 'pan' && (
                  <div className="mb-4">
                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input 
                      type="text" 
                      id="pan" 
                      name="pan" 
                      placeholder="Enter your 10-digit PAN (e.g., ABCDE1234F)" 
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                    />
                  </div>
                )}

                {/* Application Number Input */}
                {searchMethod === 'application' && (
                  <div className="mb-4">
                    <label htmlFor="application-no" className="block text-sm font-medium text-gray-700 mb-2">Application Number</label>
                    <input 
                      type="text" 
                      id="application-no" 
                      name="application-no" 
                      placeholder="Enter your application number" 
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                      value={applicationNumber}
                      onChange={(e) => setApplicationNumber(e.target.value)}
                    />
                  </div>
                )}

                {/* DPID/Client ID Input */}
                {searchMethod === 'demat' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="dpid" className="block text-sm font-medium text-gray-700 mb-2">Depository ID (DPID)</label>
                      <input 
                        type="text" 
                        id="dpid" 
                        name="dpid" 
                        placeholder="Enter your DPID" 
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                        value={dpId}
                        onChange={(e) => setDpId(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="client-id" className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                      <input 
                        type="text" 
                        id="client-id" 
                        name="client-id" 
                        placeholder="Enter your Client ID" 
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      Check Allotment Status
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div id="allotment-result" className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-base font-medium text-gray-800">Allotment Result</h2>
            <div className="flex items-center">
              <div className="h-7 w-7 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-sm mr-2">
                {ipoData.companyName.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-800">{ipoData.companyName} IPO</span>
            </div>
          </div>
          <div className="p-4">
            {allotmentResult.status === 'success' ? (
              <>
                {/* Success Status Banner */}
                <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center mb-4">
                  <div className="flex-shrink-0 mr-3">
                    <i className="fas fa-check-circle text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Congratulations! Your application has been allotted.</h3>
                    <p className="text-xs text-green-700 mt-1">Shares will be credited to your demat account by {allotmentResult.sharesCredit?.date}.</p>
                  </div>
                </div>

                {/* Applicant Details */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Applicant Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">PAN</div>
                      <div className="text-sm font-medium text-gray-800">{allotmentResult.pan}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Application Number</div>
                      <div className="text-sm font-medium text-gray-800">{allotmentResult.applicationNumber}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <div className="text-sm font-medium text-gray-800">{allotmentResult.category}</div>
                    </div>
                  </div>
                </div>

                {/* Allotment Status */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Allotment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Shares Applied</div>
                      <div className="text-sm font-medium text-gray-800">
                        {allotmentResult.bidDetails?.[0].quantity} shares ({Math.ceil((allotmentResult.bidDetails?.[0].quantity || 0) / (ipoData.lotSize || 1))} lot)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Shares Allotted</div>
                      <div className="text-sm font-medium text-green-600">{allotmentResult.bidDetails?.[0].allotted} shares</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Amount Invested</div>
                      <div className="text-sm font-medium text-gray-800">{allotmentResult.accountDebit}</div>
                    </div>
                  </div>
                </div>

                {/* Important Dates */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Important Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Allotment Date</div>
                      <div className="text-sm font-medium text-gray-800">{ipoData.allotmentDate || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Credit of Shares</div>
                      <div className="text-sm font-medium text-gray-800">{allotmentResult.sharesCredit?.date}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Listing Date</div>
                      <div className="text-sm font-medium text-gray-800">{ipoData.listingDate || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Not Found Status
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">No allotment found for your application</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>We couldn't find any allotment details for the information you provided. This could be because:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Your application was not allotted shares</li>
                        <li>The information provided is incorrect</li>
                        <li>The allotment process is still in progress</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              {allotmentResult.status === 'success' && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md text-sm transition-colors duration-200 flex items-center">
                  <i className="fas fa-download mr-1.5"></i> Download Allotment Letter
                </button>
              )}
              <button onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-3 rounded-md text-sm transition-colors duration-200 flex items-center">
                <i className="fas fa-search mr-1.5"></i> Check Another
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 