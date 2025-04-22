import React from 'react';
import { Metadata } from 'next';
import { getIPOById, getAllIPOIds } from '@/lib/ipoDetailService';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface PageParams {
  id: string;
}

// For page component props
type PageProps = {
  params: PageParams;
};


// Enable ISR with a revalidation time of 3600 seconds (1 hour)
export const revalidate = 3600;

// Function to extract company name from IPO ID
function extractCompanyNameFromId(ipoId: string): string {
  // Remove year prefix (e.g., "2024_")
  let name = ipoId.replace(/^\d{4}_/, '');
  
  // Remove "_ipo" suffix
  name = name.replace(/_ipo$/, '');
  
  // Replace underscores with spaces
  name = name.replace(/_/g, ' ');
  
  // Capitalize each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Remove common company suffixes
  name = name.replace(/\s+(Limited|Ltd|Pvt Ltd|Private Limited|Inc|Corporation|Corp|LLC|LLP)$/i, '');
  
  return name;
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { id } = await params;
  const ipo = await getIPOById(id);
  if (!ipo) {
    return {
      title: 'IPO Not Found',
      description: 'The requested IPO information could not be found.'
    };
  }
  
  // Extract company name from IPO ID if not available
  const companyName = ipo.company_name || extractCompanyNameFromId(ipo.ipo_id);
  const ipoName = ipo.ipo_name || 'IPO';
  const issuePrice = ipo.issue_price || 'N/A';
  
  return {
    title: `${companyName} IPO Details`,
    description: `Details about ${ipoName} - Issue Price: ${issuePrice}`,
  };
}

export async function generateStaticParams() {
  const ipoIds = await getAllIPOIds();
  
  // Generate static pages for all IPO IDs
  return ipoIds.map(id => ({
    id,
  }));
}

// Helper function to recursively render object properties
function renderObjectProperties(obj: any, depth: number = 0): React.ReactNode {
  if (obj === null) return <span className="text-gray-500">null</span>;
  if (obj === undefined) return <span className="text-gray-500">undefined</span>;
  
  if (typeof obj !== 'object') {
    // Render primitive values
    if (typeof obj === 'string') return <span className="text-green-600">"{obj}"</span>;
    if (typeof obj === 'number') return <span className="text-blue-600">{obj}</span>;
    if (typeof obj === 'boolean') return <span className="text-purple-600">{obj.toString()}</span>;
    return <span>{String(obj)}</span>;
  }
  
  if (Array.isArray(obj)) {
    // Render arrays
    if (obj.length === 0) return <span className="text-gray-500">[]</span>;
    
    return (
      <div className="pl-4">
        [
        <div className="pl-4">
          {obj.map((item, index) => (
            <div key={index}>
              {renderObjectProperties(item, depth + 1)}
              {index < obj.length - 1 && ','}
            </div>
          ))}
        </div>
        ]
      </div>
    );
  }
  
  // Render objects
  const keys = Object.keys(obj);
  if (keys.length === 0) return <span className="text-gray-500">{'{}'}</span>;
  
  return (
    <div className="pl-4">
      {'{'}
      <div className="pl-4">
        {keys.map((key, index) => (
          <div key={key}>
            <span className="text-red-600">"{key}"</span>: {renderObjectProperties(obj[key], depth + 1)}
            {index < keys.length - 1 && ','}
          </div>
        ))}
      </div>
      {'}'}
    </div>
  );
}

export default async function IPODetailPage({ params }: { params: Promise<PageParams> }) {
  const { id } = await params;
  const ipo = await getIPOById(id);

  
  if (!ipo) {
    notFound();
  }
  
  // Extract company name from IPO ID if not available
  const companyName = ipo.company_name || extractCompanyNameFromId(ipo.ipo_id);
  const ipoName = ipo.ipo_name || 'IPO Details';
  
  return (
    <div className="container mx-auto py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{companyName}</h1>
        <p className="text-gray-600">{ipoName}</p>
        <div className="mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${ipo.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
              ipo.status === 'open' ? 'bg-green-100 text-green-800' : 
              ipo.status === 'closed' ? 'bg-yellow-100 text-yellow-800' : 
              ipo.status === 'listed' ? 'bg-purple-100 text-purple-800' : 
              'bg-gray-100 text-gray-800'}`}>
            {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
          </span>
        </div>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Company: {companyName}</h2>
        <div className="overflow-x-auto">
          <pre className="bg-gray-50 p-4 rounded text-sm font-mono whitespace-pre-wrap">
            {renderObjectProperties(ipo)}
          </pre>
        </div>
      </div>
    </div>
  );
} 