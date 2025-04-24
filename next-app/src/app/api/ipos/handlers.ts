import { IPO } from '@/app/types/IPO';

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
  }
];

/**
 * Fetch all IPOs
 */
export async function fetchAllIPOs(): Promise<IPO[]> {
  // In a real application, this would be a database or API call
  return mockIPOs;
}

/**
 * Fetch an IPO by its ID
 */
export async function fetchIPOById(id: string): Promise<IPO | null> {
  // In a real application, this would be a database or API call
  const ipo = mockIPOs.find(ipo => ipo.id === id);
  return ipo || null;
}

/**
 * Fetch IPOs by status
 */
export async function fetchIPOsByStatus(status: IPO['status']): Promise<IPO[]> {
  // In a real application, this would be a database or API call
  return mockIPOs.filter(ipo => ipo.status === status);
} 