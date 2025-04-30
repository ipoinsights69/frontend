import { Metadata } from 'next';
import { fetchDetailedIPOById, fetchRelatedIPOs, fetchDetailedIPOBySlug, fetchAllIPOIdsFromAPI } from '@/app/api/ipos/handlers';
import { notFound } from 'next/navigation';
import IPOHero from '@/app/components/IPODetail/IPOHero';
import IPOTabs from '@/app/components/IPODetail/IPOTabs';
import RelatedIPOs from '@/app/components/IPODetail/RelatedIPOsList';

// Set revalidation time to 2 hours (7200 seconds)
export const revalidate = 7200;

interface PageParams {
  id: string;
}

// Generate static paths for all IPOs
export async function generateStaticParams() {
  const ipoIds = await fetchAllIPOIdsFromAPI();
  
  return ipoIds.map(id => {
    // Remove year prefix from the ID for cleaner URLs
    const cleanId = id.replace(/^\d{4}_/, '');
    return { id: cleanId };
  });
}

function extractCompanyNameFromId(ipoId: string): string {
  let name = ipoId.replace(/^\d{4}_/, '');
  name = name.replace(/_ipo$/, '');
  name = name.replace(/_/g, ' ');
  name = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  name = name.replace(/\s+(Limited|Ltd|Pvt Ltd|Private Limited|Inc|Corporation|Corp|LLC|LLP)$/i, '');
  return name;
}

// ✅ generateMetadata
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { id } = params;
  const ipo = await fetchDetailedIPOBySlug(id);

  if (!ipo) {
    return {
      title: 'IPO Not Found',
      description: 'The requested IPO information could not be found.',
    };
  }

  const companyName = ipo.companyName || extractCompanyNameFromId(ipo.id);
  const ipoName = ipo.symbol || 'IPO';
  const issuePrice = ipo.priceRange ? `₹${ipo.priceRange.min}-${ipo.priceRange.max}` : 'N/A';

  return {
    title: `${companyName} IPO Details`,
    description: `Details about ${ipoName} - Issue Price: ${issuePrice}`,
  };
}

// ✅ Page component
export default async function IPODetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = params;
  const ipoData = await fetchDetailedIPOBySlug(id);
  
  if (!ipoData) {
    notFound();
  }
  
  // Fetch related IPOs based on the current IPO
  const relatedIPOs = await fetchRelatedIPOs(ipoData.id);

  return (
    <main className="bg-gray-50">
      <IPOHero ipoData={ipoData} />
      <IPOTabs ipoData={ipoData} />
      <RelatedIPOs ipos={relatedIPOs} />
    </main>
  );
}