'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Fix the imports to use inline type definition
// import { IPODetailedData } from '@/types/ipo';
// Remove the getStatusColorClass import
// import { getStatusColorClass } from '@/lib/utils';

// Define the IPO type based on what we're using in this component
interface IPODetailedData {
  ipo_id: string;
  company_name: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed' | 'unknown';
  issue_price?: string;
  issue_size?: string;
  lot_size?: number;
  logo_url?: string;
  listing_date?: string;
  opening_date?: string;
  closing_date?: string;
  listing_at?: string;
  exchange?: string;
  sector?: string;
  industries?: string[];
  about?: string;
  incorporation_date?: string;
  business_segments?: Array<{
    name: string;
    description: string;
    icon?: string;
  }>;
  financials?: any;
  listing_price?: string;
  listing_gains?: string;
  listing_gains_numeric?: number;
  day_high?: string;
  day_low?: string;
  overall_subscription?: string;
  retail_subscription?: string;
  nii_subscription?: string;
  total_applications?: number;
  [key: string]: any; // Allow any other properties
}

// Add a simple Badge component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantStyle = 
    variant === 'outline' 
      ? "border border-gray-200 bg-white" 
      : "bg-blue-50 text-blue-700";
  
  return (
    <span className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </span>
  );
};

interface IPODetailClientPageProps {
  ipo: IPODetailedData;
  companyName: string;
  ipoName: string;
}

// Add a helper function for icons since we don't have FontAwesome directly
const IconPlaceholder = ({ name, className = "" }: { name: string, className?: string }) => {
  const getIcon = () => {
    switch(name) {
      case 'calendar-alt': return '📅';
      case 'industry': return '🏭';
      case 'exchange-alt': return '🔄';
      case 'tools': return '🔧';
      case 'check': return '✓';
      default: return '📄';
    }
  };
  
  return <span className={`mr-1.5 ${className}`}>{getIcon()}</span>;
};

const IPODetailClientPage: React.FC<IPODetailClientPageProps> = ({ ipo, companyName, ipoName }) => {
  // First, ensure we handle the possibility that ipo contains objects that can't be rendered
  const safeIpo = React.useMemo(() => {
    // Create a safe copy of the IPO data
    const processValue = (value: any): any => {
      if (value === null || value === undefined) {
        return value;
      }
      
      if (typeof value === 'object' && !React.isValidElement(value)) {
        if (Array.isArray(value)) {
          return value.map(item => processValue(item));
        } else {
          // Process each property of the object
          const result: any = {};
          Object.keys(value).forEach(key => {
            result[key] = processValue(value[key]);
          });
          return result;
        }
      }
      
      return value;
    };
    
    return processValue(ipo);
  }, [ipo]);
  
  // Helper function to format date strings
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Get initials for company logo
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Implement the getStatusColorClass function directly
  const getStatusColorClass = (status: string): string => {
    switch(status?.toLowerCase()) {
      case 'upcoming': return 'bg-blue-50 text-blue-600';
      case 'open': return 'bg-green-50 text-green-600';
      case 'closed': return 'bg-yellow-50 text-yellow-600';
      case 'listed': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start mb-6">
            <div className="h-14 w-14 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-xl mr-5 flex-shrink-0">
              {safeIpo.logo_url ? (
                <Image 
                  src={safeIpo.logo_url} 
                  alt={`${companyName} Logo`} 
                  width={56} 
                  height={56} 
                  className="object-contain"
                />
              ) : (
                getInitials(companyName)
              )}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl font-semibold text-gray-800">{companyName} IPO</h1>
                <Badge className={getStatusColorClass(safeIpo.status)}>
                  {safeIpo.status?.charAt(0).toUpperCase() + safeIpo.status?.slice(1) || 'Unknown'}
                </Badge>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <span>{safeIpo.listing_at || 'BSE SME'}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span>{safeIpo.sector || 'Manufacturing'}</span>
                {safeIpo.listing_date && (
                  <>
                    <span className="mx-2 text-gray-400">•</span>
                    <span>Listed on {formatDate(safeIpo.listing_date)}</span>
                  </>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {safeIpo.industries && safeIpo.industries.length > 0 ? (
                  safeIpo.industries.map((industry: string, index: number) => (
                    <Badge key={index} className="bg-blue-50 text-blue-700">
                      {industry}
                    </Badge>
                  ))
                ) : (
                  <>
                    <Badge className="bg-blue-50 text-blue-700">
                      Manufacturing
                    </Badge>
                    <Badge className="bg-blue-50 text-blue-700">
                      {safeIpo.issue_type || 'SME IPO'}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Metrics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Issue Price</span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                  Face Value: {safeIpo.face_value || '₹10'}
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-800">{safeIpo.issue_price || '₹N/A'}</div>
              <div className="mt-1 text-xs text-gray-500">{safeIpo.issue_type || 'Fixed Price Issue'}</div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Listing Price</span>
                {safeIpo.listing_gains_numeric && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${safeIpo.listing_gains_numeric > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {safeIpo.listing_gains_numeric > 0 ? '+' : ''}{safeIpo.listing_gains || '0%'}
                  </span>
                )}
              </div>
              <div className={`text-2xl font-semibold ${safeIpo.listing_gains_numeric && safeIpo.listing_gains_numeric > 0 ? 'text-green-600' : safeIpo.listing_gains_numeric && safeIpo.listing_gains_numeric < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {safeIpo.listing_price || '₹N/A'}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {safeIpo.listing_date ? `Listed on ${formatDate(safeIpo.listing_date)}` : 'Not Listed Yet'}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Subscription</span>
                {safeIpo.total_applications && (
                  <span className="text-xs px-2 py-0.5 bg-blue-50 rounded-full text-blue-600">
                    {safeIpo.total_applications.toLocaleString()} Applications
                  </span>
                )}
              </div>
              <div className="text-2xl font-semibold text-gray-800">
                {safeIpo.overall_subscription || 'N/A'}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                NII: {safeIpo.nii_subscription || 'N/A'} | Retail: {safeIpo.retail_subscription || 'N/A'}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Issue Size</span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                  {safeIpo.fresh_issue ? 'Fresh Issue' : safeIpo.offer_for_sale ? 'Offer for Sale' : 'Mixed Issue'}
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-800">{safeIpo.issue_size || '₹N/A'}</div>
              <div className="mt-1 text-xs text-gray-500">
                {safeIpo.lot_size ? `${safeIpo.lot_size.toLocaleString()} shares` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Column */}
          <div className="w-full lg:w-2/3">
            {/* Company Overview Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Company Overview</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <IconPlaceholder name="calendar-alt" />
                  <span>Incorporated: {safeIpo.incorporation_date ? formatDate(safeIpo.incorporation_date) : 'Aug 17, 2012'}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="prose max-w-none text-gray-600">
                  {safeIpo.about ? (
                    <>
                      <p>{safeIpo.about}</p>
                    </>
                  ) : (
                    <>
                      <p>Spinaroo Commercial Limited is engaged in the manufacturing of aluminum foil containers, aluminum home foil, paper cups, paper plates, paper bowls, and semi-processed materials for paper cups, including paper coating, printing, and blanking.</p>
                      <p className="mt-3">They also offer a range of paper cup-related machinery, such as high-speed paper cup-making machines, flexo printing machines, and automatic roll die-cutting machines, providing comprehensive end-to-end support.</p>
                    </>
                  )}
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {safeIpo.business_segments && safeIpo.business_segments.length > 0 ? (
                    safeIpo.business_segments.map((segment: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className={`h-10 w-10 rounded-md ${index === 0 ? 'bg-blue-100 text-blue-600' : index === 1 ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center mr-3`}>
                            <IconPlaceholder name={index === 0 ? 'industry' : index === 1 ? 'exchange-alt' : 'tools'} className="" />
                          </div>
                          <h3 className="font-medium text-gray-800">{segment.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{segment.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <IconPlaceholder name="industry" />
                          </div>
                          <h3 className="font-medium text-gray-800">Manufacturing</h3>
                        </div>
                        <p className="text-sm text-gray-600">Aluminum foil containers, home foils, paper cups, plates, and bowls using food-grade materials.</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <IconPlaceholder name="exchange-alt" />
                          </div>
                          <h3 className="font-medium text-gray-800">Trading</h3>
                        </div>
                        <p className="text-sm text-gray-600">Trading of aluminum foils, containers, and paper products in domestic markets.</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                            <IconPlaceholder name="tools" />
                          </div>
                          <h3 className="font-medium text-gray-800">Job Work</h3>
                        </div>
                        <p className="text-sm text-gray-600">Specialized job work services, including processing, shaping, and printing on paper products.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Financial Performance Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-800">Financial Performance</h2>
              </div>
              <div className="p-6">
                <div className="h-72 mb-6 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div id="financialChart" className="w-full h-full">
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-gray-500">Financial Chart Placeholder</p>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Particulars</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">30 Sep 2024</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">31 Mar 2024</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">31 Mar 2023</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">31 Mar 2022</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">Revenue</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹21.02 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹41.21 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹53.19 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹47.58 Cr</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">Profit After Tax</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹0.61 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹1.40 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹0.93 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹0.52 Cr</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">Net Worth</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹6.64 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹6.03 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹4.63 Cr</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">₹3.70 Cr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Listing Performance Card */}
            {safeIpo.status === 'listed' && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-800">Listing Performance</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-gray-500 mb-1">Issue Price</div>
                      <div className="text-xl font-medium text-gray-800">{safeIpo.issue_price || '₹51.00'}</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-gray-500 mb-1">Listing Price</div>
                      <div className="text-xl font-medium text-green-600">{safeIpo.listing_price || '₹52.85'}</div>
                      <div className="text-xs text-green-600">{safeIpo.listing_gains || '+3.63%'}</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-gray-500 mb-1">Day High</div>
                      <div className="text-xl font-medium text-green-600">{safeIpo.day_high || '₹55.00'}</div>
                      <div className="text-xs text-green-600">{safeIpo.day_high_gain || '+7.84%'}</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-gray-500 mb-1">Day Low</div>
                      <div className="text-xl font-medium text-green-600">{safeIpo.day_low || '₹52.60'}</div>
                      <div className="text-xs text-green-600">{safeIpo.day_low_gain || '+3.14%'}</div>
                    </div>
                  </div>
                  
                  <div className="h-80 mb-6 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div id="listingPerformanceChart" className="w-full h-full">
                      <div className="h-full w-full flex items-center justify-center">
                        <p className="text-gray-500">Listing Performance Chart Placeholder</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Closing Price</div>
                    <div className="text-3xl font-semibold text-green-600">{safeIpo.closing_price || '₹54.44'}</div>
                    <div className="text-sm text-green-600">{safeIpo.closing_gain || '+6.75% from issue price'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            {/* IPO Timeline Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-base font-medium text-gray-800">IPO Timeline</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  <div className="absolute left-0 ml-2.5 h-full w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    <div className="relative flex items-start">
                      <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="ml-4">
                        <div className="flex flex-wrap justify-between">
                          <div className="text-sm font-medium text-gray-800">Open Date</div>
                          <div className="text-xs text-gray-500">
                            {safeIpo.opening_date ? formatDate(safeIpo.opening_date) : 'Mar 28, 2025'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{safeIpo.opening_date ? formatDate(safeIpo.opening_date) : 'Mar 28, 2025'}</div>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="ml-4">
                        <div className="flex flex-wrap justify-between">
                          <div className="text-sm font-medium text-gray-800">Close Date</div>
                          <div className="text-xs text-gray-500">
                            {safeIpo.closing_date ? formatDate(safeIpo.closing_date) : 'Apr 3, 2025'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{safeIpo.closing_date ? formatDate(safeIpo.closing_date) : 'Apr 3, 2025'}</div>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="ml-4">
                        <div className="flex flex-wrap justify-between">
                          <div className="text-sm font-medium text-gray-800">Allotment Date</div>
                          <div className="text-xs text-gray-500">
                            {safeIpo.allotment_date ? formatDate(safeIpo.allotment_date) : 'Apr 4, 2025'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{safeIpo.allotment_date ? formatDate(safeIpo.allotment_date) : 'Apr 4, 2025'}</div>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="ml-4">
                        <div className="flex flex-wrap justify-between">
                          <div className="text-sm font-medium text-gray-800">Credit of Shares</div>
                          <div className="text-xs text-gray-500">
                            {safeIpo.credit_of_shares ? formatDate(safeIpo.credit_of_shares) : 'Apr 7, 2025'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{safeIpo.credit_of_shares ? formatDate(safeIpo.credit_of_shares) : 'Apr 7, 2025'}</div>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className={`h-5 w-5 rounded-full border-2 ${safeIpo.status === 'listed' ? 'border-green-600 bg-green-600' : 'border-blue-600 bg-white'} z-10 flex items-center justify-center mt-0.5`}>
                        {safeIpo.status === 'listed' ? (
                          <IconPlaceholder name="check" className="text-white text-xs" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex flex-wrap justify-between">
                          <div className="text-sm font-medium text-gray-800">Listing Date</div>
                          <div className="text-xs text-gray-500">
                            {safeIpo.listing_date ? formatDate(safeIpo.listing_date) : 'Apr 8, 2025'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{safeIpo.listing_date ? formatDate(safeIpo.listing_date) : 'Apr 8, 2025'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subscription Status Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-base font-medium text-gray-800">Subscription Status</h2>
              </div>
              <div className="p-6">
                <div className="mb-5">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Overall Subscription</span>
                    <span className="text-sm font-medium text-gray-700">{safeIpo.overall_subscription || '1.52x'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((safeIpo.overall_subscription_numeric || 1.52) * 25, 100)}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Retail Individual Investors</span>
                      <span className="text-sm font-medium text-gray-700">{safeIpo.retail_subscription || '1.20x'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min((safeIpo.retail_subscription_numeric || 1.20) * 25, 100)}%` }}></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>Shares Offered: {safeIpo.retail_shares_offered || '947,000'}</span>
                      <span className="mx-2">•</span>
                      <span>Shares Bid: {safeIpo.retail_shares_bid || '1,140,000'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Non-Institutional Investors</span>
                      <span className="text-sm font-medium text-gray-700">{safeIpo.nii_subscription || '1.84x'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.min((safeIpo.nii_subscription_numeric || 1.84) * 25, 100)}%` }}></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>Shares Offered: {safeIpo.nii_shares_offered || '947,000'}</span>
                      <span className="mx-2">•</span>
                      <span>Shares Bid: {safeIpo.nii_shares_bid || '1,738,000'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div id="subscriptionChart" className="w-full h-full">
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-gray-500">Subscription Chart Placeholder</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  <span className="font-medium">Total Applications:</span> {safeIpo.total_applications?.toLocaleString() || '713'}
                </div>
              </div>
            </div>
            
            {/* Key Metrics Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-base font-medium text-gray-800">Key Metrics</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">ROE</div>
                    <div className="text-xl font-medium text-gray-800">
                      {safeIpo.financials?.ratios?.roe || '23.23'}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">ROCE</div>
                    <div className="text-xl font-medium text-gray-800">
                      {safeIpo.financials?.ratios?.roce || '37.58'}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">P/E Ratio</div>
                    <div className="text-xl font-medium text-gray-800">
                      {safeIpo.financials?.eps?.pe_post || '29.01'}x
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">EPS</div>
                    <div className="text-xl font-medium text-gray-800">
                      ₹{safeIpo.financials?.eps?.post || '1.76'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lot Size</span>
                    <span className="text-sm font-medium text-gray-800">
                      {safeIpo.lot_size ? `${safeIpo.lot_size.toLocaleString()} shares` : '2,000 shares'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Minimum Investment</span>
                    <span className="text-sm font-medium text-gray-800">
                      {safeIpo.minimum_amount ? `₹${safeIpo.minimum_amount.toLocaleString()}` : '₹1,02,000'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Face Value</span>
                    <span className="text-sm font-medium text-gray-800">
                      {safeIpo.face_value || '₹10.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Issue Type</span>
                    <span className="text-sm font-medium text-gray-800">
                      {safeIpo.issue_type || 'Fixed Price'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IPODetailClientPage; 