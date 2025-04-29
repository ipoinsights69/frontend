import React from 'react';
import { notFound } from 'next/navigation';
import AllotmentForm from './components/AllotmentForm';
import IPOTimeline from './components/IPOTimeline';
import Link from 'next/link';
import { formatDate } from '@/app/utils/dateUtils';
import { fetchDetailedIPOById } from '@/app/api/ipos/handlers';
import { IPO } from '@/app/types/IPO';

// Define the PageProps type for dynamic route params
interface PageProps {
  params: {
    id: string;
  };
}

// Set revalidation time to 1 hour (3600 seconds)
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps) {
  const ipoData = await fetchDetailedIPOById(params.id);
  
  if (!ipoData) {
    return {
      title: 'IPO Not Found | IPO Insights',
      description: 'The requested IPO information could not be found.',
    };
  }

  return {
    title: `${ipoData.companyName} IPO Allotment Status | IPO Insights`,
    description: `Check your application status for ${ipoData.companyName} IPO. Find out if you've been allotted shares in this IPO.`,
  };
}

export default async function AllotmentPage({ params }: PageProps) {
  const ipoData = await fetchDetailedIPOById(params.id);
  
  if (!ipoData) {
    notFound();
  }

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
              <p className="text-gray-600 max-w-2xl">Check your {ipoData.companyName || 'IPO'} application status instantly using your PAN, Application Number, or Demat Account details</p>
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

      {/* IPO Timeline */}
      <IPOTimeline ipoData={ipoData} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Allotment Checker */}
          <div className="lg:col-span-2 space-y-6">
            {/* Allotment Checker Card */}
            <AllotmentForm ipoData={ipoData} />

            {/* How to Check IPO Allotment Status */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">How to Check IPO Allotment Status</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">There are multiple ways to check your IPO allotment status. Follow these simple steps based on your preferred method:</p>
                </div>

                {/* Method 1: Using PAN */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Check Using PAN Number</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-1">
                        <li>Select the IPO name from the dropdown</li>
                        <li>Enter your 10-digit PAN number (e.g., ABCDE1234F)</li>
                        <li>Click on &quot;Check Allotment Status&quot;</li>
                        <li>Your allotment status will be displayed instantly</li>
                      </ol>
                      <div className="mt-2 text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i> Using PAN will show all applications made with that PAN
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method 2: Using Application Number */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Check Using Application Number</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-1">
                        <li>Find your application number from your online/offline IPO application</li>
                        <li>Enter the application number in the form</li>
                        <li>Click on &quot;Check Allotment Status&quot;</li>
                        <li>Your allotment status will be displayed instantly</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Method 3: Using Demat Account */}
                <div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Check Using Demat Account</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-1">
                        <li>Enter your Depository (NSDL/CDSL)</li>
                        <li>Enter your DP ID and Client ID</li>
                        <li>Click on &quot;Check Allotment Status&quot;</li>
                        <li>Your allotment status will be displayed instantly</li>
                      </ol>
                      <div className="mt-2 text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i> For CDSL: Enter your 16-digit Demat account number as the Client ID
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Company Info & Registrar Card */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">IPO Details</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-6">
                  <div className="h-14 w-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-xl mr-4">
                    {ipoData.companyName?.charAt(0) ?? "I"}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">{ipoData.companyName}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ipoData.status === 'listed' ? 'bg-green-100 text-green-800' :
                        ipoData.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        ipoData.status === 'open' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ipoData.status.charAt(0).toUpperCase() + ipoData.status.slice(1)}
                      </span>
                      {ipoData.industry && (
                        <span className="text-xs text-gray-500 ml-2">
                          {ipoData.industry}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-500">Issue Price</td>
                        <td className="py-2 text-right font-medium text-gray-800">
                          {ipoData.priceRange ? `₹${ipoData.priceRange.min} - ₹${ipoData.priceRange.max}` : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500">Lot Size</td>
                        <td className="py-2 text-right font-medium text-gray-800">
                          {ipoData.lotSize ? `${ipoData.lotSize} shares` : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500">Issue Type</td>
                        <td className="py-2 text-right font-medium text-gray-800">
                          {ipoData.issueType || 'Book Built Issue'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500">Issue Size</td>
                        <td className="py-2 text-right font-medium text-gray-800">
                          {ipoData.issueSize ? `₹${ipoData.issueSize} Cr` : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500">Allotment Date</td>
                        <td className="py-2 text-right font-medium text-gray-800">
                          {ipoData.allotmentDate ? formatDate(ipoData.allotmentDate) : 'TBA'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500">Listing Date</td>
                        <td className="py-2 text-right font-medium text-gray-800">
                          {ipoData.listingDate ? formatDate(ipoData.listingDate) : 'TBA'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <Link 
                    href={`/ipo/${ipoData.id}`}
                    className="text-blue-600 text-sm font-medium hover:underline w-full inline-block text-center"
                  >
                    View Complete IPO Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Registrar Card */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-800">Registrar Information</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 mr-3">
                    <i className="fas fa-building"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {ipoData.registrarDetails?.name || 'Link Intime India Pvt Ltd'}
                    </h3>
                    <p className="text-xs text-gray-500">IPO Registrar</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex items-start">
                    <div className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="text-sm text-gray-600 break-all">
                      {ipoData.registrarDetails?.email || 'ipo@linkintime.co.in'}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="text-sm text-gray-600">
                      {ipoData.registrarDetails?.phone || '+91 22 4918 6200'}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5">
                      <i className="fas fa-globe"></i>
                    </div>
                    <div className="text-sm text-gray-600 break-all">
                      {ipoData.registrarDetails?.website || 'www.linkintime.co.in'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    For any queries related to allotment, please contact the registrar directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                <li>
                  <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/calendar" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    IPO Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">
                  <i className="fas fa-envelope mr-2 text-blue-600"></i>
                  support@ipoinsight.com
                </li>
                <li className="text-sm text-gray-600">
                  <i className="fas fa-phone mr-2 text-blue-600"></i>
                  +91 9876543210
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} IPO Insight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 