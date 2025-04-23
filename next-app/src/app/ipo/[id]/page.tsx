import { Metadata } from 'next';
import { getIPOById, getRelatedIPOs } from '@/lib/ipoDetailService';
import { notFound } from 'next/navigation';
import IPOHero from '@/app/components/IPODetail/IPOHero';
import IPOTabs from '@/app/components/IPODetail/IPOTabs';
import RelatedIPOs from '@/app/components/IPODetail/RelatedIPOsList';

export const revalidate = 3600;

interface PageParams {
  id: string;
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
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const ipo = await getIPOById(id);

  if (!ipo) {
    return {
      title: 'IPO Not Found',
      description: 'The requested IPO information could not be found.',
    };
  }

  const companyName = ipo.company_name || extractCompanyNameFromId(ipo.ipo_id);
  const ipoName = ipo.ipo_name || 'IPO';
  const issuePrice = ipo.issue_price || 'N/A';

  return {
    title: `${companyName} IPO Details`,
    description: `Details about ${ipoName} - Issue Price: ${issuePrice}`,
  };
}

// ✅ Page component
export default async function IPODetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = await params;
  const ipoData = await getIPOById(id);
  const relatedIPOs = await getRelatedIPOs(id);

  if (!ipoData) {
    notFound();
  }

  return (
    <main className="bg-gray-50">
      <IPOHero ipoData={ipoData} />
      <IPOTabs ipoData={ipoData} />
      <RelatedIPOs ipos={relatedIPOs} />
    </main>
  );
}