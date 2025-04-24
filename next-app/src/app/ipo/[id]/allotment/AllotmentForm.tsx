'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface AllotmentFormProps {
  ipoId: string;
}

type AllotmentMethod = 'pan' | 'application' | 'demat';

export default function AllotmentForm({ ipoId }: AllotmentFormProps) {
  const router = useRouter();
  const [method, setMethod] = useState<AllotmentMethod>('pan');
  const [panNumber, setPanNumber] = useState('');
  const [applicationNumber, setApplicationNumber] = useState('');
  const [dematAccount, setDematAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    // Build query params based on selected method
    let queryParams = new URLSearchParams({
      ipoId,
      method,
    });

    if (method === 'pan') {
      queryParams.append('pan', panNumber);
    } else if (method === 'application') {
      queryParams.append('applicationNumber', applicationNumber);
    } else if (method === 'demat') {
      queryParams.append('dematAccount', dematAccount);
    }

    try {
      const response = await fetch(`/api/ipo/allotment?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check allotment status');
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setMethod('pan')}
            className={`px-4 py-2 rounded ${
              method === 'pan' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            PAN
          </button>
          <button
            type="button"
            onClick={() => setMethod('application')}
            className={`px-4 py-2 rounded ${
              method === 'application' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Application Number
          </button>
          <button
            type="button"
            onClick={() => setMethod('demat')}
            className={`px-4 py-2 rounded ${
              method === 'demat' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Demat Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {method === 'pan' && (
            <div className="mb-4">
              <label htmlFor="panNumber" className="block mb-2 font-medium">
                PAN Number
              </label>
              <input
                type="text"
                id="panNumber"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded"
                placeholder="Enter PAN Number"
                required
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-1">Format: AAAPL1234C</p>
            </div>
          )}

          {method === 'application' && (
            <div className="mb-4">
              <label htmlFor="applicationNumber" className="block mb-2 font-medium">
                Application Number
              </label>
              <input
                type="text"
                id="applicationNumber"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter Application Number"
                required
              />
            </div>
          )}

          {method === 'demat' && (
            <div className="mb-4">
              <label htmlFor="dematAccount" className="block mb-2 font-medium">
                Demat Account Number
              </label>
              <input
                type="text"
                id="dematAccount"
                value={dematAccount}
                onChange={(e) => setDematAccount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter Demat Account Number"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Format: IN123456789012</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Checking...' : 'Check Allotment Status'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">Allotment Result</h3>
            <div className="bg-gray-100 p-3 rounded">
              <p className="font-medium">Status: {result.status}</p>
              {result.allocated && (
                <>
                  <p className="mt-2">Shares Allocated: {result.shares_allocated}</p>
                  <p>Amount to Pay: ₹{result.amount}</p>
                </>
              )}
              {!result.allocated && result.status !== 'pending' && (
                <p className="mt-2">Your application was not allocated any shares in this IPO.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 