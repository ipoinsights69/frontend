import React from 'react';

const AllotmentHelp: React.FC = () => {
  return (
    <section className="py-6 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">How to Check IPO Allotment Status</h2>
          <p className="mt-1 text-sm text-gray-500">
            Follow these simple steps to check your allotment status
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Using Application Number</h3>
              <div className="bg-gray-50 rounded-md p-4 text-sm">
                <ol className="list-decimal list-inside space-y-3">
                  <li>Open your broker's app or website</li>
                  <li>Go to the IPO section and find your applied IPOs</li>
                  <li>Note down the application number mentioned for this IPO</li>
                  <li>Enter the application number in the form above</li>
                </ol>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Using PAN</h3>
              <div className="bg-gray-50 rounded-md p-4 text-sm">
                <ol className="list-decimal list-inside space-y-3">
                  <li>Enter your PAN number exactly as it appears on your PAN card</li>
                  <li>The system will show all applications made using this PAN</li>
                  <li>Note: If you have applied from multiple broker accounts using the same PAN, you will see all applications</li>
                </ol>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Using Demat Account</h3>
              <div className="bg-gray-50 rounded-md p-4 text-sm">
                <ol className="list-decimal list-inside space-y-3">
                  <li>Find your DP ID and Client ID from your demat account statement</li>
                  <li>NSDL format: IN + 12 digits (e.g., IN301330123456)</li>
                  <li>CDSL format: 16-digit beneficiary ID</li>
                  <li>Enter these details in the respective fields above</li>
                </ol>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle mt-0.5 mr-3"></i>
                </div>
                <div>
                  <p className="font-medium mb-1">Important Information</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Allotment status is typically available after 5:00 PM on the allotment date</li>
                    <li>If allotted, shares will be credited to your demat account on the credit date</li>
                    <li>Refund for unallotted shares will be processed within 1-2 working days after allotment</li>
                    <li>For any issues, contact your broker's customer support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllotmentHelp; 