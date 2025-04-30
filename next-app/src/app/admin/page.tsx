import { Metadata } from 'next';
import RevalidateButton from '@/app/components/RevalidateButton';

export const metadata: Metadata = {
  title: 'Admin - IPO Insights',
  description: 'Administration panel for IPO Insights',
};

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Data Management</h2>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Cache Revalidation</h3>
            <p className="text-gray-600 mb-4">
              Use this button to refresh the data from the API. This will clear the cache and
              fetch fresh data for all pages.
            </p>
            
            <RevalidateButton />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">System Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Cache Status</h3>
              <p className="text-gray-600 text-sm">
                Next.js ISR cache revalidation period: 3600 seconds (1 hour)
              </p>
            </div>
            
            <div className="border rounded p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">API Endpoint</h3>
              <p className="text-gray-600 text-sm">
                Main API: http://localhost:8000
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 