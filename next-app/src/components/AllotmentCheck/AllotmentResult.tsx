'use client';

import { useState, useEffect } from 'react';
import { IPODetailedData } from '@/app/types/IPO';

interface AllotmentResultProps {
  ipoData: IPODetailedData;
}

type AllotmentStatus = 'loading' | 'success' | 'failure';

interface AllotmentDetails {
  sharesApplied: number;
  sharesAllotted: number;
  amountPaid: number;
  refundAmount: number;
  dpId?: string;
  clientId?: string;
  cutOffPrice: number;
}

export default function AllotmentResult({ ipoData }: AllotmentResultProps) {
  const [allotmentStatus, setAllotmentStatus] = useState<AllotmentStatus>('loading');
  const [allotmentDetails, setAllotmentDetails] = useState<AllotmentDetails | null>(null);

  // Simulate API call to check allotment status
  useEffect(() => {
    // In a real app, this would be an API call
    const checkAllotment = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random success/failure based on IPO data
      // This is just a simulation - real implementation would call an actual API
      const isSuccess = Math.random() > 0.5;
      
      if (isSuccess) {
        const lotSize = ipoData.lotSize || 10;
        const pricePerShare = ipoData.priceRange?.max || 100;
        const lotsApplied = Math.floor(Math.random() * 5) + 1;
        const lotsAllotted = Math.floor(Math.random() * (lotsApplied + 1));
        
        setAllotmentDetails({
          sharesApplied: lotsApplied * lotSize,
          sharesAllotted: lotsAllotted * lotSize,
          amountPaid: lotsApplied * lotSize * pricePerShare,
          refundAmount: (lotsApplied - lotsAllotted) * lotSize * pricePerShare,
          dpId: 'IN300476',
          clientId: '12345678',
          cutOffPrice: ipoData.cutOffPrice || pricePerShare
        });
        
        setAllotmentStatus('success');
      } else {
        const lotSize = ipoData.lotSize || 10;
        const pricePerShare = ipoData.priceRange?.max || 100;
        const lotsApplied = Math.floor(Math.random() * 5) + 1;
        
        setAllotmentDetails({
          sharesApplied: lotsApplied * lotSize,
          sharesAllotted: 0,
          amountPaid: lotsApplied * lotSize * pricePerShare,
          refundAmount: lotsApplied * lotSize * pricePerShare,
          cutOffPrice: ipoData.cutOffPrice || pricePerShare
        });
        
        setAllotmentStatus('failure');
      }
    };
    
    checkAllotment();
  }, [ipoData]);

  if (allotmentStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg text-gray-700">Checking allotment status...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
      </div>
    );
  }

  if (allotmentStatus === 'success' && allotmentDetails) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-1">Congratulations!</h3>
          <p className="text-lg text-gray-600">
            Your application for {ipoData.companyName} IPO has been allotted
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Shares Applied</p>
            <p className="text-lg font-medium text-gray-900">{allotmentDetails.sharesApplied}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Shares Allotted</p>
            <p className="text-lg font-medium text-gray-900">{allotmentDetails.sharesAllotted}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
            <p className="text-lg font-medium text-gray-900">₹{allotmentDetails.amountPaid.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Refund Amount</p>
            <p className="text-lg font-medium text-gray-900">₹{allotmentDetails.refundAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Cut-off Price</p>
            <p className="text-lg font-medium text-gray-900">₹{allotmentDetails.cutOffPrice}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Listing Date</p>
            <p className="text-lg font-medium text-gray-900">{ipoData.listingDate || 'Coming Soon'}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-base font-medium text-gray-900 mb-2">Next Steps</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Shares will be credited to your demat account on {ipoData.listingDate || 'the listing date'}</li>
            <li>Refunds (if any) will be processed by {ipoData.refundDate || 'the refund date'}</li>
            <li>The shares will be listed on {ipoData.listingDate || 'the listing date'}</li>
          </ul>
        </div>
      </div>
    );
  }

  if (allotmentStatus === 'failure' && allotmentDetails) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-1">Not Allotted</h3>
          <p className="text-lg text-gray-600">
            Your application for {ipoData.companyName} IPO was not allotted
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Shares Applied</p>
            <p className="text-lg font-medium text-gray-900">{allotmentDetails.sharesApplied}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
            <p className="text-lg font-medium text-gray-900">₹{allotmentDetails.amountPaid.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Refund Amount</p>
            <p className="text-lg font-medium text-gray-900">₹{allotmentDetails.refundAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Cut-off Price</p>
            <p className="text-lg font-medium text-gray-900">₹{allotmentDetails.cutOffPrice}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-base font-medium text-gray-900 mb-2">Next Steps</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Full refund will be processed by {ipoData.refundDate || 'the refund date'}</li>
            <li>Refund will be credited to your original payment method</li>
            <li>For any refund queries, please contact {ipoData.registrarDetails?.name || 'the registrar'}</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
} 