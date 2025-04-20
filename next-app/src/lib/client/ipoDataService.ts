'use client';

import { IPODetailedData, IPOStats, IPOSummary, YearCount } from "../server/ipoDataService";

// In-memory cache for data
let cachedAllIPOs: IPOSummary[] | null = null;
let cachedBestPerforming: Partial<IPOSummary>[] | null = null;
let cachedWorstPerforming: Partial<IPOSummary>[] | null = null;
let cachedStats: IPOStats | null = null;
let cachedYears: YearCount[] | null = null;
const cachedDetailedData: Record<string, IPODetailedData> = {};

// Sample/test data for fallback
const TEST_IPOS: IPOSummary[] = [
  {
    ipo_id: "test-ipo-1",
    original_ipo_id: "test1",
    ipo_name: "Test IPO 1",
    company_name: "Test Company 1",
    year: 2023,
    status: "listed",
    raw_data_path: "test/path1.json",
    issue_price: "₹100",
    issue_price_numeric: 100,
    listing_gains: "+22.5%",
    listing_gains_numeric: 22.5,
    opening_date: "2023-01-10",
    closing_date: "2023-01-12",
    listing_date: "2023-01-20",
    face_value: null,
    issue_size: null,
    issue_size_numeric: null,
    issue_type: null,
    listing_at: null,
    lot_size: null,
    minimum_amount_string: null,
    overall_subscription: 5.2,
    retail_subscription: 3.1,
    nii_subscription: 4.8,
    qib_subscription: 8.5,
    total_applications: null,
    listing_price_open: null,
    listing_price_high: null,
    listing_price_low: null,
    listing_price_last: null,
    logo_url: null,
    market_maker: null,
    registrar_name: null
  },
  {
    ipo_id: "test-ipo-2",
    original_ipo_id: "test2",
    ipo_name: "Test IPO 2",
    company_name: "Test Company 2",
    year: 2023,
    status: "upcoming",
    raw_data_path: "test/path2.json",
    issue_price: "₹150",
    issue_price_numeric: 150,
    opening_date: "2023-08-10",
    closing_date: "2023-08-12",
    listing_date: null,
    face_value: null,
    issue_size: null,
    issue_size_numeric: null,
    issue_type: null,
    listing_at: null,
    lot_size: null,
    minimum_amount_string: null,
    overall_subscription: null,
    retail_subscription: null,
    nii_subscription: null,
    qib_subscription: null,
    total_applications: null,
    listing_gains: null,
    listing_gains_numeric: null,
    listing_price_open: null,
    listing_price_high: null,
    listing_price_low: null,
    listing_price_last: null,
    logo_url: null,
    market_maker: null,
    registrar_name: null
  }
];

// Client-side implementation that directly uses data
export async function getAllIPOsSummary(): Promise<IPOSummary[]> {
  // Use cached data if available
  if (cachedAllIPOs) {
    return cachedAllIPOs;
  }
  
  try {
    // In a real implementation, this would load data from a local source
    // For now, use test data
    cachedAllIPOs = TEST_IPOS;
    return cachedAllIPOs;
  } catch (error) {
    console.error('Error loading IPO data:', error);
    return TEST_IPOS;
  }
}

export async function getIPODetailById(id: string): Promise<IPODetailedData | null> {
  // Use cached data if available
  if (cachedDetailedData[id]) {
    return cachedDetailedData[id];
  }
  
  try {
    // In a real implementation, this would load detailed data from a local source
    const allIpos = await getAllIPOsSummary();
    const ipoMeta = allIpos.find(ipo => ipo.ipo_id === id);
    
    if (!ipoMeta) {
      return null;
    }
    
    // Create basic detailed data from metadata
    const detail: IPODetailedData = {
      _id: ipoMeta.ipo_id,
      ipo_id: ipoMeta.ipo_id,
      ipoName: ipoMeta.ipo_name || '',
      year: ipoMeta.year || 0,
      status: ipoMeta.status || 'unknown',
      basicDetails: {
        companyName: ipoMeta.company_name,
        issuePrice: ipoMeta.issue_price,
        issueSize: ipoMeta.issue_size,
        lotSize: ipoMeta.lot_size,
        faceValue: ipoMeta.face_value
      },
      tentativeDetails: {
        openDate: ipoMeta.opening_date,
        closeDate: ipoMeta.closing_date,
        listingDate: ipoMeta.listing_date
      },
      about: `Details for ${ipoMeta.company_name || ipoMeta.ipo_name}`,
      subscriptionStatus: {
        overall: ipoMeta.overall_subscription,
        retail: ipoMeta.retail_subscription,
        nii: ipoMeta.nii_subscription,
        qib: ipoMeta.qib_subscription
      },
      listingDetail: {
        listingGains: ipoMeta.listing_gains,
        listingGainsNumeric: ipoMeta.listing_gains_numeric
      },
      lotSizes: [],
      contactDetails: {},
      registrarDetails: { name: ipoMeta.registrar_name },
      leadManagers: [],
      listingDayTrading: {},
      faqs: [],
      recommendationSummary: {},
      prospectusLinks: [],
      reservation: {},
      anchorInvestors: {},
      additionalTables: []
    };
    
    // Cache the result
    cachedDetailedData[id] = detail;
    return detail;
  } catch (error) {
    console.error(`Error loading IPO detail for ${id}:`, error);
    return null;
  }
}

export async function getIPOsByStatus(status: string): Promise<IPOSummary[]> {
  try {
    const allIpos = await getAllIPOsSummary();
    return allIpos.filter(ipo => ipo.status === status);
  } catch (error) {
    console.error(`Error filtering IPOs by status ${status}:`, error);
    return TEST_IPOS.filter(ipo => ipo.status === status);
  }
}

export async function getUpcomingIPOs(): Promise<IPOSummary[]> {
  return getIPOsByStatus('upcoming');
}

export async function getOpenIPOs(): Promise<IPOSummary[]> {
  return getIPOsByStatus('open');
}

export async function getBestPerformingIPOs(): Promise<Partial<IPOSummary>[]> {
  // Use cached data if available
  if (cachedBestPerforming) {
    return cachedBestPerforming;
  }
  
  try {
    const allIpos = await getAllIPOsSummary();
    const bestPerforming = allIpos
      .filter(ipo => ipo.listing_gains_numeric !== undefined && ipo.listing_gains_numeric !== null)
      .sort((a, b) => (b.listing_gains_numeric || 0) - (a.listing_gains_numeric || 0))
      .slice(0, 5);
    
    cachedBestPerforming = bestPerforming;
    return bestPerforming;
  } catch (error) {
    console.error('Error getting best performing IPOs:', error);
    return TEST_IPOS
      .filter(ipo => ipo.listing_gains_numeric !== undefined)
      .sort((a, b) => (b.listing_gains_numeric || 0) - (a.listing_gains_numeric || 0))
      .slice(0, 5);
  }
}

export async function getWorstPerformingIPOs(): Promise<Partial<IPOSummary>[]> {
  // Use cached data if available
  if (cachedWorstPerforming) {
    return cachedWorstPerforming;
  }
  
  try {
    const allIpos = await getAllIPOsSummary();
    const worstPerforming = allIpos
      .filter(ipo => ipo.listing_gains_numeric !== undefined && ipo.listing_gains_numeric !== null)
      .sort((a, b) => (a.listing_gains_numeric || 0) - (b.listing_gains_numeric || 0))
      .slice(0, 5);
    
    cachedWorstPerforming = worstPerforming;
    return worstPerforming;
  } catch (error) {
    console.error('Error getting worst performing IPOs:', error);
    return TEST_IPOS
      .filter(ipo => ipo.listing_gains_numeric !== undefined)
      .sort((a, b) => (a.listing_gains_numeric || 0) - (b.listing_gains_numeric || 0))
      .slice(0, 5);
  }
}

export async function getIPOStats(): Promise<IPOStats | null> {
  // Use cached data if available
  if (cachedStats) {
    return cachedStats;
  }
  
  try {
    const allIpos = await getAllIPOsSummary();
    
    // Calculate statistics
    const totalCount = allIpos.length;
    
    // Count by status
    const byStatus = {
      upcoming: 0,
      open: 0,
      closed: 0,
      listed: 0,
      unknown: 0
    };
    
    allIpos.forEach(ipo => {
      if (ipo.status && byStatus.hasOwnProperty(ipo.status)) {
        byStatus[ipo.status as keyof typeof byStatus]++;
      } else {
        byStatus.unknown++;
      }
    });
    
    // Find best and worst performers
    const listedIpos = allIpos.filter(ipo => 
      ipo.listing_gains_numeric !== undefined && ipo.listing_gains_numeric !== null
    );
    
    const bestPerformer = listedIpos.length > 0 
      ? listedIpos.reduce((best, current) => 
          (current.listing_gains_numeric || 0) > (best.listing_gains_numeric || 0) ? current : best
        ) 
      : {};
      
    const worstPerformer = listedIpos.length > 0 
      ? listedIpos.reduce((worst, current) => 
          (current.listing_gains_numeric || 0) < (worst.listing_gains_numeric || 0) ? current : worst
        ) 
      : {};
    
    const stats = {
      totalCount,
      byStatus,
      bestPerformer,
      worstPerformer
    };
    
    cachedStats = stats;
    return stats;
  } catch (error) {
    console.error('Error calculating IPO stats:', error);
    return {
      totalCount: TEST_IPOS.length,
      byStatus: {
        upcoming: TEST_IPOS.filter(ipo => ipo.status === 'upcoming').length,
        open: TEST_IPOS.filter(ipo => ipo.status === 'open').length,
        closed: TEST_IPOS.filter(ipo => ipo.status === 'closed').length,
        listed: TEST_IPOS.filter(ipo => ipo.status === 'listed').length,
        unknown: TEST_IPOS.filter(ipo => !ipo.status || !['upcoming', 'open', 'closed', 'listed'].includes(ipo.status)).length
      },
      bestPerformer: TEST_IPOS.reduce((best, current) => 
        (current.listing_gains_numeric || 0) > (best.listing_gains_numeric || 0) ? current : best, TEST_IPOS[0] || {}
      ),
      worstPerformer: TEST_IPOS.reduce((worst, current) => 
        (current.listing_gains_numeric || 0) < (worst.listing_gains_numeric || 0) ? current : worst, TEST_IPOS[0] || {}
      )
    };
  }
}

export async function getIPOYears(): Promise<YearCount[]> {
  // Use cached data if available
  if (cachedYears) {
    return cachedYears;
  }
  
  try {
    const allIpos = await getAllIPOsSummary();
    
    // Generate years data
    const years = Array.from(new Set(allIpos.map(ipo => ipo.year)))
      .filter(year => year !== null)
      .map(year => ({
        year: year!,
        count: allIpos.filter(ipo => ipo.year === year).length
      }));
    
    cachedYears = years;
    return years;
  } catch (error) {
    console.error('Error generating IPO years data:', error);
    return Array.from(new Set(TEST_IPOS.map(ipo => ipo.year)))
      .filter(year => year !== null)
      .map(year => ({
        year: year!,
        count: TEST_IPOS.filter(ipo => ipo.year === year).length
      }));
  }
}

export async function searchIPOs(query: string): Promise<IPOSummary[]> {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const allIpos = await getAllIPOsSummary();
    const lowercaseQuery = query.toLowerCase();
    
    return allIpos.filter(ipo => {
      // Handle potential null values safely
      const ipoName = (ipo.ipo_name || '').toLowerCase();
      const companyName = (ipo.company_name || '').toLowerCase();
      
      // Also search in other relevant fields
      const issuePrice = (ipo.issue_price || '').toLowerCase();
      const status = (ipo.status || '').toLowerCase();
      const year = ipo.year?.toString() || '';
      
      return ipoName.includes(lowercaseQuery) || 
             companyName.includes(lowercaseQuery) ||
             status.includes(lowercaseQuery) ||
             issuePrice.includes(lowercaseQuery) ||
             year.includes(lowercaseQuery);
    });
  } catch (error) {
    console.error('Error searching IPOs:', error);
    return [];
  }
}

export async function filterIPOs(filters: {
  status?: string;
  year?: number;
  minIssuePrice?: number;
  maxIssuePrice?: number;
  minSubscription?: number;
  minListingGains?: number;
  maxListingGains?: number;
}): Promise<IPOSummary[]> {
  try {
    let filteredIpos = await getAllIPOsSummary();
    
    // Apply filters, handling potential null values safely
    if (filters.status) {
      filteredIpos = filteredIpos.filter(ipo => ipo.status === filters.status);
    }
    
    if (filters.year !== undefined) {
      filteredIpos = filteredIpos.filter(ipo => ipo.year === filters.year);
    }
    
    if (filters.minIssuePrice !== undefined) {
      filteredIpos = filteredIpos.filter(ipo => 
        ipo.issue_price_numeric !== null && ipo.issue_price_numeric >= filters.minIssuePrice!
      );
    }
    
    if (filters.maxIssuePrice !== undefined) {
      filteredIpos = filteredIpos.filter(ipo => 
        ipo.issue_price_numeric !== null && ipo.issue_price_numeric <= filters.maxIssuePrice!
      );
    }
    
    if (filters.minSubscription !== undefined) {
      filteredIpos = filteredIpos.filter(ipo => {
        // Check any of the subscription types that match the minimum
        return (
          (ipo.overall_subscription !== null && ipo.overall_subscription >= filters.minSubscription!) ||
          (ipo.retail_subscription !== null && ipo.retail_subscription >= filters.minSubscription!) ||
          (ipo.nii_subscription !== null && ipo.nii_subscription >= filters.minSubscription!) ||
          (ipo.qib_subscription !== null && ipo.qib_subscription >= filters.minSubscription!)
        );
      });
    }
    
    if (filters.minListingGains !== undefined) {
      filteredIpos = filteredIpos.filter(ipo => 
        ipo.listing_gains_numeric !== null && ipo.listing_gains_numeric >= filters.minListingGains!
      );
    }
    
    if (filters.maxListingGains !== undefined) {
      filteredIpos = filteredIpos.filter(ipo => 
        ipo.listing_gains_numeric !== null && ipo.listing_gains_numeric <= filters.maxListingGains!
      );
    }
    
    return filteredIpos;
  } catch (error) {
    console.error('Error filtering IPOs:', error);
    return [];
  }
}

// Export a default object with all functions for convenience
const ipoDataService = {
  getAllIPOsSummary,
  getIPODetailById,
  getIPOsByStatus,
  getUpcomingIPOs,
  getOpenIPOs,
  getBestPerformingIPOs,
  getWorstPerformingIPOs,
  getIPOStats,
  getIPOYears,
  searchIPOs,
  filterIPOs
};

export default ipoDataService; 