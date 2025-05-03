'use client';

import { useState } from 'react';

interface AllotmentFormProps {
  onSubmit: (type: 'pan' | 'application' | 'demat', value: string) => void;
}

export default function AllotmentForm({ onSubmit }: AllotmentFormProps) {
  const [activeTab, setActiveTab] = useState<'pan' | 'application' | 'demat'>('pan');
  const [panNumber, setPanNumber] = useState('');
  const [applicationNumber, setApplicationNumber] = useState('');
  const [dpId, setDpId] = useState('');
  const [clientId, setClientId] = useState('');
  const [errors, setErrors] = useState<{
    pan?: string;
    application?: string;
    dpId?: string;
    clientId?: string;
  }>({});

  const handleTabChange = (tab: 'pan' | 'application' | 'demat') => {
    setActiveTab(tab);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: {
      pan?: string;
      application?: string;
      dpId?: string;
      clientId?: string;
    } = {};
    let isValid = true;

    if (activeTab === 'pan') {
      if (!panNumber) {
        newErrors.pan = 'PAN number is required';
        isValid = false;
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
        newErrors.pan = 'Enter a valid 10-character PAN number';
        isValid = false;
      }
    } else if (activeTab === 'application') {
      if (!applicationNumber) {
        newErrors.application = 'Application number is required';
        isValid = false;
      } else if (applicationNumber.length < 8) {
        newErrors.application = 'Enter a valid application number';
        isValid = false;
      }
    } else if (activeTab === 'demat') {
      if (!dpId) {
        newErrors.dpId = 'DP ID is required';
        isValid = false;
      } else if (dpId.length < 8) {
        newErrors.dpId = 'Enter a valid DP ID';
        isValid = false;
      }
      
      if (!clientId) {
        newErrors.clientId = 'Client ID is required';
        isValid = false;
      } else if (clientId.length < 8) {
        newErrors.clientId = 'Enter a valid Client ID';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (activeTab === 'pan') {
      onSubmit('pan', panNumber);
    } else if (activeTab === 'application') {
      onSubmit('application', applicationNumber);
    } else if (activeTab === 'demat') {
      onSubmit('demat', `${dpId}-${clientId}`);
    }
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => handleTabChange('pan')}
            className={`${
              activeTab === 'pan'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            PAN Number
          </button>
          <button
            onClick={() => handleTabChange('application')}
            className={`${
              activeTab === 'application'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Application Number
          </button>
          <button
            onClick={() => handleTabChange('demat')}
            className={`${
              activeTab === 'demat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Demat Account
          </button>
        </nav>
      </div>

      {/* Form */}
      <div className="mt-6">
        <form onSubmit={handleSubmit}>
          {activeTab === 'pan' && (
            <div>
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                PAN Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="pan"
                  id="pan"
                  placeholder="e.g., ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  autoComplete="off"
                  maxLength={10}
                />
                {errors.pan && <p className="mt-1 text-sm text-red-600">{errors.pan}</p>}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your 10-digit PAN (Permanent Account Number) used during IPO application
              </p>
            </div>
          )}

          {activeTab === 'application' && (
            <div>
              <label htmlFor="application" className="block text-sm font-medium text-gray-700">
                Application Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="application"
                  id="application"
                  placeholder="e.g., 1234567890"
                  value={applicationNumber}
                  onChange={(e) => setApplicationNumber(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  autoComplete="off"
                />
                {errors.application && <p className="mt-1 text-sm text-red-600">{errors.application}</p>}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your application number from bidding confirmation slip
              </p>
            </div>
          )}

          {activeTab === 'demat' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="dpid" className="block text-sm font-medium text-gray-700">
                  DP ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="dpid"
                    id="dpid"
                    placeholder="e.g., IN300476"
                    value={dpId}
                    onChange={(e) => setDpId(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    autoComplete="off"
                  />
                  {errors.dpId && <p className="mt-1 text-sm text-red-600">{errors.dpId}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="clientid" className="block text-sm font-medium text-gray-700">
                  Client ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="clientid"
                    id="clientid"
                    placeholder="e.g., 12345678"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    autoComplete="off"
                  />
                  {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>}
                </div>
              </div>
              
              <p className="mt-1 text-sm text-gray-500">
                Enter your Demat Account details used during IPO application
              </p>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Check Allotment Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 