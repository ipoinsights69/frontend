'use client';

import { IPODetailedData } from '@/app/types/IPO';

interface AllotmentCheckerFormProps {
  ipoData: IPODetailedData;
  activeTab: 'pan' | 'application' | 'demat';
  formData: {
    pan: string;
    applicationNo: string;
    dpid: string;
    clientId: string;
  };
  onTabChange: (tab: 'pan' | 'application' | 'demat') => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AllotmentCheckerForm({
  ipoData,
  activeTab,
  formData,
  onTabChange,
  onInputChange,
  onSubmit
}: AllotmentCheckerFormProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-800">Check {ipoData.companyName} IPO Allotment Status</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => onTabChange('pan')}
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'pan'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            PAN Number
          </button>
          <button
            onClick={() => onTabChange('application')}
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'application'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Application Number
          </button>
          <button
            onClick={() => onTabChange('demat')}
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'demat'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Demat Account
          </button>
        </nav>
      </div>
      
      {/* Form */}
      <div className="p-4">
        <form onSubmit={onSubmit}>
          {activeTab === 'pan' && (
            <div>
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                PAN Number
              </label>
              <input
                type="text"
                id="pan"
                name="pan"
                value={formData.pan}
                onChange={onInputChange}
                placeholder="Enter your 10-digit PAN Number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                maxLength={10}
                required
              />
              <p className="mt-1 text-xs text-gray-500">Example: ABCDE1234F</p>
            </div>
          )}
          
          {activeTab === 'application' && (
            <div>
              <label htmlFor="applicationNo" className="block text-sm font-medium text-gray-700 mb-1">
                Application Number
              </label>
              <input
                type="text"
                id="applicationNo"
                name="applicationNo"
                value={formData.applicationNo}
                onChange={onInputChange}
                placeholder="Enter your Application Number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Enter the application number from your IPO application</p>
            </div>
          )}
          
          {activeTab === 'demat' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="dpid" className="block text-sm font-medium text-gray-700 mb-1">
                  DP ID
                </label>
                <input
                  type="text"
                  id="dpid"
                  name="dpid"
                  value={formData.dpid}
                  onChange={onInputChange}
                  placeholder="Enter your DP ID"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={onInputChange}
                  placeholder="Enter your Client ID"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter your 16-digit DPID & Client ID from your demat account
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Check Allotment Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 