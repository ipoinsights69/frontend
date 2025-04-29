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