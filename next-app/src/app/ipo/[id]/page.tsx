import { Metadata } from 'next';
import { fetchDetailedIPOById, fetchRelatedIPOs, fetchDetailedIPOBySlug, fetchAllIPOIdsFromAPI } from '@/app/api/ipos/handlers';
import { notFound } from 'next/navigation';
import IPOHero from '@/app/components/IPODetail/IPOHero';
import IPOTabs from '@/app/components/IPODetail/IPOTabs';
import RelatedIPOs from '@/app/components/IPODetail/RelatedIPOsList';
import { IPODetailedData } from '@/app/types/IPO';

// Set revalidation time to 2 hours (7200 seconds)
export const revalidate = 7200;

interface PageParams {
  id: string;
}

// IPO Detail Page configuration for data mapping
// This allows easy customization of how API data is displayed in the UI
export const IPO_DETAIL_CONFIG = {
  // Main sections that should be displayed in the UI
  sections: {
    hero: true,            // Hero banner with IPO overview
    overview: true,        // General overview and company info
    financials: true,      // Financial data and ratios
    subscription: true,    // Subscription status and trends
    dates: true,           // Important dates timeline
    allotment: true,       // Allotment information
    company: true,         // Company background and details
    faqs: true             // Frequently asked questions
  },
  
  // Fields mapping for each section
  // This maps API response fields to display names in the UI
  fieldsMapping: {
    // Hero section fields
    hero: {
      title: 'companyName',
      subtitle: 'symbol',
      status: 'status',
      priceRange: 'priceRange',
      issueSize: 'issueSize',
      issueType: 'issueType',
      listingAt: 'listingAt',
      logoUrl: 'logoUrl'
    },
    
    // Overview section fields
    overview: {
      description: 'description',
      industry: 'industry',
      openDate: 'openDate',
      closeDate: 'closeDate',
      listingDate: 'listingDate',
      lotSize: 'lotSize',
      leadManager: 'leadManager'
    },
    
    // Financials section fields
    financials: {
      data: 'financials.data',
      ratios: 'financials.ratios',
      eps: 'financials.eps'
    },
    
    // Subscription section fields
    subscription: {
      overall: 'overallSubscription',
      retail: 'retailSubscription',
      nii: 'niiSubscription',
      qib: 'qibSubscription',
      dayWise: 'subscription_details.day_wise'
    },
    
    // Dates section fields
    dates: {
      openDate: 'openDate',
      closeDate: 'closeDate',
      allotmentDate: 'allotmentDate',
      refundDate: 'refundDate',
      listingDate: 'listingDate'
    },
    
    // Company section fields
    company: {
      description: 'description',
      business: 'business_segments',
      strengths: 'competitive_strengths',
      promoters: 'promoters'
    },
    
    // FAQ section fields
    faqs: {
      items: 'faqs'
    },
    
    // Links to prospectus and other documents
    links: {
      prospectus: 'prospectus_links'
    }
  },
  
  // Format configurations for displaying data
  formatConfig: {
    currency: {
      format: 'en-IN',
      options: {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }
    },
    date: {
      format: 'en-IN',
      options: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    },
    percentage: {
      suffix: '%',
      precision: 2
    }
  }
};

// Helper function to get value from nested path
export function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
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

// Format the IPO data by applying the mapping configuration
export function formatIPOData(ipoData: IPODetailedData): Record<string, any> {
  const result: Record<string, any> = {};
  
  // Process each section in the config
  Object.entries(IPO_DETAIL_CONFIG.fieldsMapping).forEach(([section, fields]) => {
    result[section] = {};
    
    // Process each field in the section
    Object.entries(fields).forEach(([displayName, apiPath]) => {
      const value = typeof apiPath === 'string' ? getNestedValue(ipoData, apiPath) : undefined;
      result[section][displayName] = value;
    });
  });
  
  return result;
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
  const statusText = ipo.status === 'upcoming' ? 'Upcoming' : ipo.status === 'open' ? 'Open' : ipo.status === 'closed' ? 'Closed' : 'Listed';

  return {
    title: `${companyName} IPO - ${statusText} | IPO Insights`,
    description: `${companyName} ${ipoName} details - Issue Price: ${issuePrice}, Issue Size: ₹${ipo.issueSize} Cr, Listing at: ${ipo.listingAt}`,
    openGraph: {
      title: `${companyName} IPO - ${statusText} | IPO Insights`,
      description: `${companyName} ${ipoName} details - Issue Price: ${issuePrice}, Issue Size: ₹${ipo.issueSize} Cr, Listing at: ${ipo.listingAt}`,
      images: ipo.logoUrl ? [ipo.logoUrl] : undefined,
    },
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
  
  // Format the IPO data according to the mapping configuration
  const formattedData = formatIPOData(ipoData);
  
  // Fetch related IPOs based on the current IPO
  const relatedIPOs = await fetchRelatedIPOs(ipoData.id);

  return (
    <main className="bg-gray-50">
      <IPOHero ipoData={ipoData} formattedData={formattedData} config={IPO_DETAIL_CONFIG} />
      <IPOTabs ipoData={ipoData} formattedData={formattedData} config={IPO_DETAIL_CONFIG} />
      <RelatedIPOs ipos={relatedIPOs} />
    </main>
  );
}