import { IPO, IPODetailedData, IPOStats } from '@/app/types/IPO';

// Mock IPO data for development purposes
const mockIPOs: IPO[] = [
  {
    id: 'rvnl',
    companyName: 'Rail Vikas Nigam Limited',
    symbol: 'RVNL',
    industry: 'Railways',
    logoUrl: '/images/companies/rvnl.png',
    description: 'RVNL is a Miniratna Central Public Sector Enterprise under the Ministry of Railways, primarily engaged in building engineering works for Indian Railways.',
    status: 'listed',
    
    openDate: '2023-08-21',
    closeDate: '2023-08-23',
    allotmentDate: '2023-08-25',
    refundDate: '2023-08-26',
    listingDate: '2023-08-28',
    
    priceRange: {
      min: 540,
      max: 570
    },
    cutOffPrice: 570,
    lotSize: 26,
    issueSize: 5000,
    issueType: 'Book Built',
    
    listingPrice: 592,
    listingGain: 22,
    listingGainPercentage: 3.85,
    
    overallSubscription: 9.43,
    retailSubscription: 7.01,
    qibSubscription: 12.56,
    niiSubscription: 8.71,
    
    gmp: 32,
    gmpPercentage: 5.61
  },
  {
    id: 'ireda',
    companyName: 'Indian Renewable Energy Development Agency',
    symbol: 'IREDA',
    industry: 'Financial Services',
    logoUrl: '/images/companies/ireda.png',
    description: 'IREDA is a financing institution dedicated to promoting, developing and extending financial assistance for renewable energy and energy efficiency projects.',
    status: 'listed',
    
    openDate: '2023-11-22',
    closeDate: '2023-11-24',
    allotmentDate: '2023-11-27',
    refundDate: '2023-11-28',
    listingDate: '2023-11-29',
    
    priceRange: {
      min: 30,
      max: 32
    },
    cutOffPrice: 32,
    lotSize: 460,
    issueSize: 2150,
    issueType: 'Book Built',
    
    listingPrice: 50,
    listingGain: 18,
    listingGainPercentage: 56.25,
    
    overallSubscription: 7.23,
    retailSubscription: 4.14,
    qibSubscription: 12.55,
    niiSubscription: 5.18,
    
    gmp: 6,
    gmpPercentage: 18.75
  },
  {
    id: 'mazagon',
    companyName: 'Mazagon Dock Shipbuilders',
    symbol: 'MAZAGON',
    industry: 'Shipbuilding',
    logoUrl: '/images/companies/mazagon.png',
    description: 'Mazagon Dock Shipbuilders Limited is a public sector undertaking under the Ministry of Defence, primarily engaged in building warships and submarines for the Indian Navy.',
    status: 'open',
    
    openDate: '2024-04-20',
    closeDate: '2024-04-22',
    allotmentDate: '2024-04-24',
    refundDate: '2024-04-25',
    listingDate: '2024-04-26',
    
    priceRange: {
      min: 1080,
      max: 1140
    },
    cutOffPrice: 0,
    lotSize: 13,
    issueSize: 3500,
    issueType: 'Book Built',
    
    overallSubscription: 0,
    retailSubscription: 0,
    qibSubscription: 0,
    niiSubscription: 0,
    
    gmp: 45,
    gmpPercentage: 3.95
  },
  {
    id: 'zomato',
    companyName: 'Zomato Ltd',
    symbol: 'ZOMATO',
    industry: 'Technology',
    logoUrl: '/images/companies/zomato.png',
    description: 'Zomato is an Indian multinational restaurant aggregator and food delivery company.',
    status: 'upcoming',
    
    openDate: '2024-05-15',
    closeDate: '2024-05-17',
    allotmentDate: '2024-05-20',
    refundDate: '2024-05-21',
    listingDate: '2024-05-24',
    
    priceRange: {
      min: 72,
      max: 76
    },
    lotSize: 195,
    issueSize: 9375,
    issueType: 'Book Built',
    
    gmp: 25,
    gmpPercentage: 32.89
  },
  {
    id: 'paytm',
    companyName: 'Paytm (One97 Communications)',
    symbol: 'PAYTM',
    industry: 'Financial Technology',
    logoUrl: '/images/companies/paytm.png',
    description: 'Paytm is an Indian multinational financial technology company specializing in digital payment systems, e-commerce and financial services.',
    status: 'closed',
    
    openDate: '2023-12-05',
    closeDate: '2023-12-07',
    allotmentDate: '2023-12-10',
    refundDate: '2023-12-11',
    listingDate: '2023-12-14',
    
    priceRange: {
      min: 2080,
      max: 2150
    },
    cutOffPrice: 2150,
    lotSize: 6,
    issueSize: 18300,
    issueType: 'Book Built',
    
    overallSubscription: 1.89,
    retailSubscription: 1.66,
    qibSubscription: 2.79,
    niiSubscription: 0.24,
    
    gmp: -15,
    gmpPercentage: -0.70
  }
];

// Mock detailed IPO data
const mockDetailedIPOs: Record<string, IPODetailedData> = {
  'rvnl': {
    id: 'rvnl',
    companyName: 'Rail Vikas Nigam Limited',
    symbol: 'RVNL',
    industry: 'Railways',
    logoUrl: '/images/companies/rvnl.png',
    description: 'RVNL is a Miniratna Central Public Sector Enterprise under the Ministry of Railways, primarily engaged in building engineering works for Indian Railways.',
    status: 'listed',
    
    openDate: '2023-08-21',
    closeDate: '2023-08-23',
    allotmentDate: '2023-08-25',
    refundDate: '2023-08-26',
    listingDate: '2023-08-28',
    
    priceRange: {
      min: 540,
      max: 570
    },
    cutOffPrice: 570,
    lotSize: 26,
    issueSize: 5000,
    issueType: 'Book Built',
    
    listingPrice: 592,
    listingGain: 22,
    listingGainPercentage: 3.85,
    
    overallSubscription: 9.43,
    retailSubscription: 7.01,
    qibSubscription: 12.56,
    niiSubscription: 8.71,
    
    gmp: 32,
    gmpPercentage: 5.61,
    
    // Detailed data
    financials: {
      data: [
        { period: '2022-2023', revenue: 19381, profit: 1662, assets: 49325 },
        { period: '2021-2022', revenue: 15404, profit: 1124, assets: 45636 },
        { period: '2020-2021', revenue: 14531, profit: 904, assets: 42008 }
      ],
      ratios: {
        roe: 10.12,
        roce: 11.85,
        pat_margin: 8.57,
        debt_equity: 0.32
      },
      eps: {
        pre: 7.98,
        post: 7.98,
        pe_pre: 71.43,
        pe_post: 71.43
      }
    },
    subscription_details: {
      status: {
        overall: 9.43,
        retail: 7.01,
        nii: 8.71,
        qib: 12.56
      },
      day_wise: [
        { day: 'Day 1', overall: 2.75, retail: 3.12, nii: 1.56, qib: 3.58 },
        { day: 'Day 2', overall: 5.27, retail: 4.89, nii: 4.12, qib: 6.83 },
        { day: 'Day 3', overall: 9.43, retail: 7.01, nii: 8.71, qib: 12.56 }
      ]
    },
    listing_performance: {
      listing_date: '2023-08-28',
      issue_price: 570,
      listing_price: 592,
      listing_gain: 22,
      day_high: 605,
      day_low: 585,
      closing_price: 600
    },
    business_segments: [
      {
        name: 'Railway Infrastructure',
        description: 'Construction of new lines, doubling, gauge conversion, railway electrification, metro projects, workshops, etc.',
        icon: 'train'
      },
      {
        name: 'Consultancy',
        description: 'Project management consultancy services for various railway infrastructure projects',
        icon: 'briefcase'
      }
    ],
    competitive_strengths: [
      'Established relationship with Indian Railways',
      'Specialized knowledge and technical expertise',
      'Strong project execution capabilities',
      'Robust order book providing visibility for future growth'
    ],
    promoters: ['President of India acting through Ministry of Railways'],
    prospectus_links: [
      { name: 'Draft Red Herring Prospectus', url: '#' },
      { name: 'Red Herring Prospectus', url: '#' },
      { name: 'Prospectus', url: '#' }
    ],
    faqs: [
      {
        question: 'What is the minimum investment amount for RVNL IPO?',
        answer: 'The minimum investment amount is for 1 lot which consists of 26 shares. At the upper price band of ₹570, this amounts to ₹14,820.'
      },
      {
        question: 'When will the allotment of RVNL IPO take place?',
        answer: 'The allotment of RVNL IPO is expected to be finalized on August 25, 2023.'
      }
    ]
  }
};

// Mock stats data
const mockIPOStats: IPOStats = {
  activeCount: 5,
  averageReturn: 24.7,
  upcomingCount: 8,
  topSector: {
    name: 'Technology',
    return: 42.5
  }
};

/**
 * Fetch all IPOs
 */
export async function fetchAllIPOs(): Promise<IPO[]> {
  return mockIPOs;
}

/**
 * Fetch an IPO by its ID
 */
export async function fetchIPOById(id: string): Promise<IPO | null> {
  const ipo = mockIPOs.find(ipo => ipo.id === id);
  return ipo || null;
}

/**
 * Fetch IPOs by status
 */
export async function fetchIPOsByStatus(status: IPO['status']): Promise<IPO[]> {
  return mockIPOs.filter(ipo => ipo.status === status);
}

/**
 * Fetch trending IPOs (best performers)
 */
export async function fetchTrendingIPOs(limit = 4): Promise<IPO[]> {
  const listedIpos = mockIPOs.filter(ipo => ipo.status === 'listed');
  
  return [...listedIpos]
    .sort((a, b) => (b.listingGainPercentage || 0) - (a.listingGainPercentage || 0))
    .slice(0, limit);
}

/**
 * Fetch upcoming IPOs
 */
export async function fetchUpcomingIPOs(limit = 4): Promise<IPO[]> {
  const upcoming = mockIPOs.filter(ipo => ipo.status === 'upcoming');
  return upcoming.slice(0, limit);
}

/**
 * Fetch recently listed IPOs
 */
export async function fetchRecentlyListedIPOs(limit = 4): Promise<IPO[]> {
  const listed = mockIPOs.filter(ipo => ipo.status === 'listed');
  
  // Sort by listing date (newest first) and take the most recent ones
  return [...listed]
    .filter(ipo => ipo.listingDate)
    .sort((a, b) => {
      const dateA = new Date(a.listingDate || '');
      const dateB = new Date(b.listingDate || '');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);
}

/**
 * Fetch closed IPOs
 */
export async function fetchClosedIPOs(limit = 4): Promise<IPO[]> {
  const closed = mockIPOs.filter(ipo => ipo.status === 'closed');
  return closed.slice(0, limit);
}

/**
 * Fetch IPO market statistics
 */
export async function fetchIPOStats(): Promise<IPOStats> {
  return mockIPOStats;
}

/**
 * Fetch detailed IPO data by ID
 */
export async function fetchDetailedIPOById(id: string): Promise<IPODetailedData | null> {
  // First check if we have detailed data
  if (id in mockDetailedIPOs) {
    return mockDetailedIPOs[id];
  }
  
  // If not, try to get basic data and return it
  const basicIpo = await fetchIPOById(id);
  if (!basicIpo) return null;
  
  // Convert basic IPO to detailed format
  return basicIpo as IPODetailedData;
}

/**
 * Fetch related IPOs
 */
export async function fetchRelatedIPOs(id: string, limit = 4): Promise<IPO[]> {
  const ipo = await fetchIPOById(id);
  if (!ipo) return [];
  
  // Find IPOs in the same industry
  const relatedIpos = mockIPOs
    .filter(item => item.id !== id && item.industry === ipo.industry)
    .slice(0, limit);
  
  // If not enough related IPOs in the same industry, add some others
  if (relatedIpos.length < limit) {
    const others = mockIPOs
      .filter(item => item.id !== id && !relatedIpos.some(related => related.id === item.id))
      .slice(0, limit - relatedIpos.length);
    
    relatedIpos.push(...others);
  }
  
  return relatedIpos;
}

/**
 * Search for IPOs
 */
export async function searchIPOs(query: string, limit = 10): Promise<IPO[]> {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return mockIPOs
    .filter(ipo => 
      ipo.companyName.toLowerCase().includes(lowerQuery) || 
      ipo.symbol?.toLowerCase().includes(lowerQuery) ||
      ipo.industry?.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}

/**
 * Get all IPO IDs
 */
export async function fetchAllIPOIds(): Promise<string[]> {
  return mockIPOs.map(ipo => ipo.id);
}

/**
 * Fetch all IPO IDs from the external API
 */
export async function fetchAllIPOIdsFromAPI(revalidateSeconds = 7200): Promise<string[]> {
  try {
    const response = await fetch(`http://localhost:8000/api/ipos/ids`, {
      next: { revalidate: revalidateSeconds }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch IPO IDs: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching IPO IDs:', error);
    return [];
  }
}

/**
 * Fetch detailed IPO data by slug from the external API
 */
export async function fetchDetailedIPOBySlug(slug: string, revalidateSeconds = 7200): Promise<IPODetailedData | null> {
  try {
    // Add back the year prefix if it's been removed
    const ipoId = slug.startsWith('20') ? slug : `2025_${slug}`;
    
    const response = await fetch(`http://localhost:8000/api/ipos/${ipoId}`, {
      next: { revalidate: revalidateSeconds }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch IPO data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract financials from additionalTables if available
    const financialsTable = data.additionalTables?.find((table: any) => 
      table.sanitizedHeading === 'financials' || 
      table.heading?.toLowerCase().includes('financial')
    );
    
    const kpiTable = data.additionalTables?.find((table: any) => 
      table.headers?.includes('KPI') || 
      table.sanitizedHeading?.includes('kpi')
    );
    
    // Transform the API response to match our IPODetailedData interface
    return {
      id: data.ipo_id || ipoId,
      companyName: data.company_name?.replace(' IPO', '') || '',
      symbol: data.company_name || '',
      industry: data.listing_at || '',
      description: data.about?.details || '',
      status: data.listing_date === 'Not yet listed' ? 'upcoming' : (data.closing_date ? 'closed' : 'listed'),
      
      // Dates
      openDate: data.opening_date || data.basicDetails?.ipoOpenDate,
      closeDate: data.closing_date || data.basicDetails?.ipoCloseDate,
      allotmentDate: data.tentativeDetails?.tentative_allotment,
      refundDate: data.tentativeDetails?.initiation_of_refunds,
      listingDate: data.listing_date !== 'Not yet listed' ? data.listing_date : data.basicDetails?.ipoListingDate,
      
      // Price information
      priceRange: data.issue_price ? {
        min: parseInt(data.issue_price),
        max: parseInt(data.issue_price)
      } : undefined,
      cutOffPrice: data.issue_price ? parseInt(data.issue_price) : undefined,
      lotSize: data.lotSize?.applications?.retail_min?.shares ? parseInt(data.lotSize.applications.retail_min.shares) : undefined,
      issueSize: data.issue_amount ? parseFloat(data.issue_amount) : undefined,
      issueType: data.basicDetails?.issueType,
      
      // Listing details
      listingPrice: data.listing_price ? parseFloat(data.listing_price) : undefined,
      listingGain: data.listing_gain || 0,
      listingGainPercentage: data.listing_gains_numeric || 0,
      
      // Subscription details
      overallSubscription: data.subscriptionHistory?.overall_subscription?.overall,
      retailSubscription: data.subscriptionHistory?.overall_subscription?.retail,
      qibSubscription: data.subscriptionHistory?.overall_subscription?.qib,
      niiSubscription: data.subscriptionHistory?.overall_subscription?.nii,
      
      // GMP (Grey Market Premium)
      gmp: data.gmp,
      gmpPercentage: data.gmp_percentage,
      
      // Additional fields
      listingAt: data.basicDetails?.listingAt || data.listing_at,
      leadManager: data.lead_manager,
      logoUrl: data.logo,
      
      // Detailed data
      financials: financialsTable ? {
        data: financialsTable.rows?.map((row: string[], index: number) => {
          // Find the column headers
          const periods = financialsTable.headers?.slice(1) || [];
          const periodData = [];
          
          // Create a data point for each period (year)
          for (let i = 1; i < (row.length || 0); i++) {
            if (row[0].toLowerCase().includes('asset')) {
              periodData.push({
                period: periods[i-1] || `Period ${i}`,
                assets: parseFloat(row[i])
              });
            } else if (row[0].toLowerCase().includes('revenue')) {
              periodData.push({
                period: periods[i-1] || `Period ${i}`,
                revenue: parseFloat(row[i])
              });
            } else if (row[0].toLowerCase().includes('profit')) {
              periodData.push({
                period: periods[i-1] || `Period ${i}`,
                profit: parseFloat(row[i])
              });
            } else if (row[0].toLowerCase().includes('net worth')) {
              periodData.push({
                period: periods[i-1] || `Period ${i}`,
                net_worth: parseFloat(row[i])
              });
            }
          }
          
          return periodData;
        }).flat().filter(Boolean),
        
        // Extract financial ratios from KPI table if available
        ratios: kpiTable ? {
          roe: kpiTable.rows.find((r: string[]) => r[0].includes('ROE'))?.length > 1 ? 
            parseFloat(kpiTable.rows.find((r: string[]) => r[0].includes('ROE'))[1]) : undefined,
          roce: kpiTable.rows.find((r: string[]) => r[0].includes('ROCE'))?.length > 1 ? 
            parseFloat(kpiTable.rows.find((r: string[]) => r[0].includes('ROCE'))[1]) : undefined,
          pat_margin: kpiTable.rows.find((r: string[]) => r[0].includes('PAT'))?.length > 1 ? 
            parseFloat(kpiTable.rows.find((r: string[]) => r[0].includes('PAT'))[1]) : undefined,
          debt_equity: kpiTable.rows.find((r: string[]) => r[0].includes('Debt'))?.length > 1 ? 
            parseFloat(kpiTable.rows.find((r: string[]) => r[0].includes('Debt'))[1]) : undefined,
        } : undefined
      } : undefined,
      
      // Subscription details
      subscription_details: data.subscriptionHistory?.day_wise_subscription?.length ? {
        status: {
          overall: data.subscriptionHistory.overall_subscription.overall || 0,
          retail: data.subscriptionHistory.overall_subscription.retail || 0,
          nii: data.subscriptionHistory.overall_subscription.nii || 0,
          qib: data.subscriptionHistory.overall_subscription.qib || 0
        },
        day_wise: data.subscriptionHistory.day_wise_subscription.map((day: any) => ({
          day: day.day,
          overall: day.overall || 0,
          retail: day.retail || 0,
          nii: day.nii || 0,
          qib: day.qib || 0
        }))
      } : undefined,
      
      // Company info
      business_segments: data.about?.details ? 
        extractBusinessSegments(data.about.details) : undefined,
      
      competitive_strengths: data.about?.details ? 
        extractCompetitiveStrengths(data.about.details) : undefined,
      
      promoters: data.promoterHolding?.promoters ? 
        data.promoterHolding.promoters.split(', ') : undefined,
      
      prospectus_links: data.prospectusLinks?.map((link: any) => ({
        name: link.text,
        url: link.url
      })),
      
      faqs: data.faqs?.map((faq: any) => ({
        question: faq.question,
        answer: stripHtmlTags(faq.answer)
      })),
      
      registrarDetails: data.registrarDetails ? {
        name: data.registrarDetails.name,
        website: data.registrarDetails.website,
        email: data.registrarDetails.email,
        phone: data.registrarDetails.phone
      } : undefined
    } as IPODetailedData;
  } catch (error) {
    console.error(`Error fetching IPO data for ${slug}:`, error);
    
    // Fallback to mock data if available
    const mockId = slug.replace(/^\d{4}_/, '').replace(/_ipo$/, '');
    return await fetchDetailedIPOById(mockId);
  }
}

// Helper function to extract business segments from the about details
function extractBusinessSegments(aboutDetails: string): Array<{name: string, description: string, icon?: string}> {
  // Look for products or business segments section in the about details
  const segments = [];
  const productMatch = aboutDetails.match(/<strong>Products?:<\/strong>.*?<ul>(.*?)<\/ul>/s);
  
  if (productMatch && productMatch[1]) {
    const productItems = productMatch[1].match(/<li>(.*?)<\/li>/g);
    if (productItems) {
      productItems.forEach(item => {
        const content = item.replace(/<li>(.*?)<\/li>/s, '$1');
        const parts = content.split(':');
        
        if (parts.length > 1) {
          segments.push({
            name: parts[0].replace(/<.*?>/g, '').trim(),
            description: parts[1].replace(/<.*?>/g, '').trim(),
            icon: getIconForSegment(parts[0].trim())
          });
        } else {
          segments.push({
            name: content.replace(/<.*?>/g, '').trim(),
            description: '',
            icon: getIconForSegment(content.trim())
          });
        }
      });
    }
  }
  
  return segments.length > 0 ? segments : [
    { name: 'Jewellery', description: 'Gold and Diamond Jewellery', icon: 'diamond' }
  ];
}

// Helper function to extract competitive strengths from the about details
function extractCompetitiveStrengths(aboutDetails: string): string[] {
  const strengthsMatch = aboutDetails.match(/<strong>Competitive Strengths?:<\/strong>.*?<ul>(.*?)<\/ul>/s);
  
  if (strengthsMatch && strengthsMatch[1]) {
    const strengthItems = strengthsMatch[1].match(/<li>(.*?)<\/li>/g);
    if (strengthItems) {
      return strengthItems.map(item => item.replace(/<li>(.*?)<\/li>/s, '$1').replace(/<.*?>/g, '').trim());
    }
  }
  
  return ['Quality Products', 'Customer Satisfaction', 'Experienced Management'];
}

// Helper function to get an icon for a business segment
function getIconForSegment(name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('gold')) return 'gold';
  if (nameLower.includes('silver')) return 'silver';
  if (nameLower.includes('diamond')) return 'diamond';
  if (nameLower.includes('coin')) return 'coin';
  if (nameLower.includes('watch')) return 'watch';
  return 'jewellery';
}

// Helper function to strip HTML tags
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
} 