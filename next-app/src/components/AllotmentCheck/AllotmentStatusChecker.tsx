'use client';

import { useState } from 'react';
import { IPODetailedData } from '@/app/types/IPO';
import IPOSummaryCard from './IPOSummaryCard';
import AllotmentForm from './AllotmentForm';
import AllotmentInstructions from './AllotmentInstructions';
import AllotmentOfficialLinks from './AllotmentOfficialLinks';
import AllotmentResult from './AllotmentResult';
import Link from 'next/link';

interface AllotmentStatusCheckerProps {
  ipoData: IPODetailedData;
}

export default function AllotmentStatusChecker({ ipoData }: AllotmentStatusCheckerProps) {
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchType, setSearchType] = useState<'pan' | 'application' | 'demat'>('pan');
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (type: 'pan' | 'application' | 'demat', value: string) => {
    setSearchType(type);
    setSearchValue(value);
    setSearchSubmitted(true);
  };

  const handleReset = () => {
    setSearchSubmitted(false);
    setSearchValue('');
  };

  // Extract registrar details
  const registrarName = ipoData.registrarDetails?.name || 'the Registrar';
  const registrarWebsite = ipoData.registrarDetails?.website || '';
  const registrarEmail = ipoData.registrarDetails?.email || '';
  const registrarPhone = ipoData.registrarDetails?.phone || '';

  // Format dates for display
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formattedOpenDate = formatDate(ipoData.openDate);
  const formattedCloseDate = formatDate(ipoData.closeDate);
  const formattedAllotmentDate = formatDate(ipoData.allotmentDate);
  
  // Calculate bid days
  const calculateBidDays = (): number => {
    if (!ipoData.openDate || !ipoData.closeDate) return 0;
    try {
      const openDate = new Date(ipoData.openDate);
      const closeDate = new Date(ipoData.closeDate);
      return Math.round((closeDate.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    } catch (e) {
      return 0;
    }
  };
  
  const bidDays = calculateBidDays();

  // Check if allotment date is in the future
  const isAllotmentInFuture = (): boolean => {
    if (!ipoData.allotmentDate) return false;
    try {
      return new Date(ipoData.allotmentDate) > new Date();
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {ipoData.companyName} IPO Allotment Status
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Check if you have been allotted shares in the {ipoData.companyName} IPO
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {!searchSubmitted ? (
              <>
                {/* Allotment Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Check Your Allotment Status</h2>
                  </div>
                  <div className="p-6">
                    <AllotmentForm onSubmit={handleSubmit} />
                  </div>
                </div>
                
                {/* Allotment Instructions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">How to Check Allotment Status</h2>
                  </div>
                  <div className="p-6">
                    <AllotmentInstructions registrarName={registrarName} />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Allotment Result */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Allotment Result</h2>
                    <button 
                      onClick={handleReset}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Check Another Application
                    </button>
                  </div>
                  <div className="p-6">
                    <AllotmentResult ipoData={ipoData} />
                  </div>
                </div>
                
                {/* Search Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Search Details</h2>
                  </div>
                  <div className="p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Search Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {searchType === 'pan' ? 'PAN Number' : 
                           searchType === 'application' ? 'Application Number' : 'Demat Account'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Search Value</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {searchType === 'pan' ? 
                            searchValue.replace(/(\w{5})(\w{4})(\w{1})/, '$1****$3') : 
                            searchValue.substring(0, 4) + '****' + searchValue.substring(searchValue.length - 4)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-8">
            {/* IPO Summary Card */}
            <IPOSummaryCard ipoData={ipoData} />
            
            {/* Official Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Official Links</h2>
              </div>
              <div className="p-6">
                <AllotmentOfficialLinks 
                  registrarName={registrarName} 
                  registrarWebsite={registrarWebsite}
                  registrarEmail={registrarEmail}
                  registrarPhone={registrarPhone}
                  companyName={ipoData.companyName}
                />
              </div>
            </div>
            
            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Important Dates</h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">IPO Open Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ipoData.openDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">IPO Close Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ipoData.closeDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Allotment Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ipoData.allotmentDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Refund Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ipoData.refundDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Listing Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ipoData.listingDate}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 