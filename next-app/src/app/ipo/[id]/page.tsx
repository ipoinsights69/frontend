import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IPODetailPage } from '@/components/IPODetail/IPODetailPage';
import { fetchAllIPOIdsFromAPI, fetchDetailedIPOBySlug } from '@/app/api/ipos/handlers';

// Define revalidation period (10 minutes)
export const revalidate = 600;

type Props = {
  params: { 
    id: string;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Make sure params is properly resolved before accessing properties
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  const ipoData = await fetchDetailedIPOBySlug(id);

  if (!ipoData) {
    return {
      title: 'IPO Not Found',
      description: 'The requested IPO information was not found.'
    };
  }

  return {
    title: `${ipoData.companyName} IPO - Details, Price, Dates & Analysis`,
    description: `Complete details about ${ipoData.companyName} IPO including price, dates, subscription status, financial information, and more.`,
    openGraph: {
      title: `${ipoData.companyName} IPO - Details & Analysis`,
      description: `Complete details about ${ipoData.companyName} IPO including price, dates, subscription status, financial information, and more.`,
      images: ipoData.logoUrl ? [ipoData.logoUrl] : [],
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  try {
    const ipoIds = await fetchAllIPOIdsFromAPI();
    
    // Format ids without year prefix 
    return ipoIds.map(id => {
      // Extract id part without year prefix (2023_example_ipo -> example_ipo)
      const formattedId = id.includes('_') ? id.split('_').slice(1).join('_') : id;
      return { id: formattedId };
    });
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function IPOPage({ params }: Props) {
  // Make sure params is properly resolved before accessing properties
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  // Fetch the IPO data
  const ipoData = await fetchDetailedIPOBySlug(id);
  
  // If no IPO data found, show 404
  if (!ipoData) {
    notFound();
  }
  
  return <IPODetailPage ipoData={ipoData} />;
} 