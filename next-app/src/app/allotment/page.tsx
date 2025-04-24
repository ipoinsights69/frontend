import React from 'react';
import Link from 'next/link';
import { getUpcomingIPOs, getRecentlyListedIPOs, IPOSummary } from '@/lib/ipoDataService';
import { formatDate } from '@/app/utils/dateUtils';

// Set revalidation time to 1 hour (3600 seconds)
export const revalidate = 3600;

export const metadata = {
  title: 'IPO Allotment Status Checker | IPO Insights',
  description: 'Check the allotment status of your IPO applications instantly using your PAN, Application Number, or Demat Account details.'
};

// Mock function for open IPOs - in a real app, you would implement this in ipoDataService
async function getOpenIPOs(): Promise<IPOSummary[]> {
  // For now, return an empty array or some mock data
  return [];
}

// Mock function for closed IPOs - in a real app, you would implement this in ipoDataService
async function getClosedIPOs(): Promise<IPOSummary[]> {
  // For now, return an empty array or some mock data
  return [];
}

// Extended IPO type with allotment date
interface ExtendedIPO extends IPOSummary {
  allotment_date?: string;
}

export default async function AllotmentPage() {
  // Get all IPOs by status
  const upcomingIPOs = await getUpcomingIPOs();
  const openIPOs = await getOpenIPOs();
  const closedIPOs = await getClosedIPOs();
  const listedIPOs = await getRecentlyListedIPOs(20);
  
  // Current date for display
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = currentDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 text-white rounded-md flex items-center justify-center mr-2">
                <i className="fas fa-chart-line text-sm"></i>
              </div>
              <span className="text-base font-medium text-gray-800">IPO<span className="text-blue-600">Insight</span></span>
            </div>
            <div className="text-sm font-medium text-gray-800">
              {formattedDate}, {formattedTime} IST
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">IPO Allotment Status Checker</h1>
              <p className="text-gray-600 max-w-2xl">Check your IPO application status instantly using your PAN, Application Number, or Demat Account details</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <i className="fas fa-info-circle text-blue-600"></i>
                <span>Status available up to 1 week after issue close</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Listed IPOs */}
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-800">Recently Listed IPOs - Check Allotment Status</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listedIPOs.map((ipo) => (
                  <Link 
                    href={`/ipo/${ipo.ipo_id}/allotment`} 
                    key={ipo.ipo_id}
                    className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-lg mr-3">
                      {ipo.company_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{ipo.company_name}</h3>
                      <p className="text-xs text-gray-500">
                        Allotment Date: {(ipo as ExtendedIPO).allotment_date ? formatDate((ipo as ExtendedIPO).allotment_date || '') : 'TBA'}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-green-50 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        Listed
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Closed IPOs */}
          {closedIPOs.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">Closed IPOs - Allotment In Process</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {closedIPOs.map((ipo) => (
                    <Link 
                      href={`/ipo/${ipo.ipo_id}/allotment`} 
                      key={ipo.ipo_id}
                      className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center text-yellow-600 font-semibold text-lg mr-3">
                        {ipo.company_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{ipo.company_name}</h3>
                        <p className="text-xs text-gray-500">
                          Allotment Date: {(ipo as ExtendedIPO).allotment_date ? formatDate((ipo as ExtendedIPO).allotment_date || '') : 'TBA'}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className="bg-yellow-50 text-yellow-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          Closed
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Open IPOs */}
          {openIPOs.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">Open IPOs - Apply Now</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openIPOs.map((ipo) => (
                    <Link 
                      href={`/ipo/${ipo.ipo_id}`} 
                      key={ipo.ipo_id}
                      className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center text-green-600 font-semibold text-lg mr-3">
                        {ipo.company_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{ipo.company_name}</h3>
                        <p className="text-xs text-gray-500">
                          Closes: {ipo.closing_date ? formatDate(ipo.closing_date) : 'TBA'}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className="bg-green-50 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          Open
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Upcoming IPOs */}
          {upcomingIPOs.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">Upcoming IPOs</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingIPOs.map((ipo) => (
                    <Link 
                      href={`/ipo/${ipo.ipo_id}`} 
                      key={ipo.ipo_id}
                      className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-lg mr-3">
                        {ipo.company_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{ipo.company_name}</h3>
                        <p className="text-xs text-gray-500">
                          Opens: {ipo.opening_date ? formatDate(ipo.opening_date) : 'TBA'}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          Upcoming
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-blue-600 text-white rounded-md flex items-center justify-center mr-2">
                  <i className="fas fa-chart-line text-sm"></i>
                </div>
                <span className="text-base font-medium text-gray-800">IPO<span className="text-blue-600">Insight</span></span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive tracking and analysis of initial public offerings worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Upcoming IPOs</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">IPO Calendar</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Market Analysis</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/allotment" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Allotment Checker</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Lot Size Calculator</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">IPO Performance Tracker</Link></li>
                <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Subscription Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">support@ipoinsight.com</li>
                <li className="text-sm text-gray-600">+91 98765 43210</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} IPO Insight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 