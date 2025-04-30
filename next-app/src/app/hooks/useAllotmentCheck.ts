'use client';

import { useState } from 'react';
import { IPO } from '@/app/types/IPO';

export type SearchMethod = 'pan' | 'application' | 'demat';

export interface AllotmentResult {
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

interface UseAllotmentCheckProps {
  ipoData: IPO;
}

export function useAllotmentCheck({ ipoData }: UseAllotmentCheckProps) {
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('pan');
  const [applicationNumber, setApplicationNumber] = useState('');
  const [pan, setPan] = useState('');
  const [dpId, setDpId] = useState('');
  const [clientId, setClientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allotmentResult, setAllotmentResult] = useState<AllotmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAllotmentStatus = async (
    method: SearchMethod,
    searchValue: string,
    dpId?: string,
    clientId?: string
  ): Promise<AllotmentResult> => {
    try {
      // Create query parameters based on search method
      const params = new URLSearchParams();
      params.append('ipoId', ipoData.id);
      params.append('method', method);
      
      if (method === 'pan') {
        params.append('pan', searchValue);
      } else if (method === 'application') {
        params.append('applicationNumber', searchValue);
      } else if (method === 'demat') {
        params.append('dpId', dpId || '');
        params.append('clientId', clientId || '');
      }
      
      const response = await fetch(`/api/ipo/allotment?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to check allotment status');
      }
      
      const data = await response.json();
      return data;
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
      const result = await checkAllotmentStatus(
        searchMethod,
        searchValue,
        dpId,
        clientId
      );
      
      setAllotmentResult(result);
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

  const handleSearchMethodChange = (method: SearchMethod) => {
    setSearchMethod(method);
    setError(null);
  };

  return {
    searchMethod,
    applicationNumber,
    pan,
    dpId,
    clientId,
    isLoading,
    allotmentResult,
    error,
    setApplicationNumber,
    setPan,
    setDpId,
    setClientId,
    handleSubmit,
    resetForm,
    handleSearchMethodChange
  };
} 