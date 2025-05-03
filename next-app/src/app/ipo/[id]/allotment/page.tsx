import { fetchDetailedIPOBySlug } from '@/app/api/ipos/handlers';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AllotmentStatusChecker from '@/components/AllotmentCheck/AllotmentStatusChecker';
import Link from 'next/link';

interface IPOAllotmentPageProps {
  params: {
    id: string;
  };
}

// Set the revalidation period
export const revalidate = 3600; // 1 hour

// Generate metadata for SEO
export async function generateMetadata({ params }: IPOAllotmentPageProps): Promise<Metadata> {
  const ipoData = await fetchDetailedIPOBySlug(params.id);
  
  if (!ipoData) {
    return {
      title: 'IPO Allotment Status Not Found',
      description: 'The requested IPO allotment status page could not be found.'
    };
  }
  
  return {
    title: `${ipoData.companyName} IPO Allotment Status - Check ${ipoData.companyName} Allotment Results`,
    description: `Check ${ipoData.companyName} IPO allotment status online. Find out if you have been allotted shares in the ${ipoData.companyName} IPO.`,
    openGraph: {
      title: `${ipoData.companyName} IPO Allotment Status`,
      description: `Check ${ipoData.companyName} IPO allotment status online. Find out if you have been allotted shares in the ${ipoData.companyName} IPO.`,
      images: ipoData.logoUrl ? [{ url: ipoData.logoUrl, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function IPOAllotmentPage({ params }: IPOAllotmentPageProps) {
  const ipoData = await fetchDetailedIPOBySlug(params.id);
  
  if (!ipoData) {
    notFound();
  }
  
  // Check if IPO is in valid status for allotment
  const validStatuses = ['closed', 'listed'];
  if (!validStatuses.includes(ipoData.status)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Allotment Status Not Available Yet</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {ipoData.companyName} IPO is currently in "{ipoData.status}" status. 
              Allotment status will be available once the IPO bidding is closed and shares are allotted.
            </p>
            <div className="mt-6">
              <Link 
                href={`/ipo/${params.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View IPO Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <AllotmentStatusChecker ipoData={ipoData} />
  );
} 