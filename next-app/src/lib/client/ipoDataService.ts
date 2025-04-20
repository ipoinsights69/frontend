'use client';

// Import all necessary types
import { IPODetailedData, IPOStats, IPOSummary, YearCount, IPOYearlyStats } from "../server/ipoDataService";

// --- Caching ---
// Simple in-memory cache. Consider more robust solutions for production (e.g., React Query, SWR, localStorage).
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(key: string, url: string): Promise<T> {
  const now = Date.now();
  if (cache[key] && (now - cache[key].timestamp < CACHE_DURATION)) {
    // console.log(`[Cache HIT] ${key}`);
    return cache[key].data as T;
  }

  // console.log(`[Cache MISS] Fetching ${key} from ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error for ${url}: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
  }
  const data = await response.json();
  cache[key] = { data, timestamp: now };
  return data as T;
}

// --- API Fetching Functions ---

/**
 * Fetches all IPO summary data from meta endpoint
 */
export async function getAllIPOsSummary(): Promise<IPOSummary[]> {
  // The meta endpoint returns a paginated response like { total, page, limit, total_pages, data }
  const result = await fetchWithCache<{ data: IPOSummary[] }>('allIPOsSummary', '/api/meta');
  return result.data || []; // Extract the actual IPO array from the 'data' property
}

/**
 * Fetches detailed data for a specific IPO by ID
 */
export async function getIPODetailById(id: string): Promise<IPODetailedData | null> {
  if (!id) return null;
  // Cache key includes the ID
  return fetchWithCache<IPODetailedData | null>(`ipoDetail_${id}`, `/api/ipo/${id}`);
}

/**
 * Fetches IPOs filtered by status
 */
export async function getIPOsByStatus(status: string): Promise<IPOSummary[]> {
  if (!status) return [];
  // Cache key includes the status
  const result = await fetchWithCache<{ data: IPOSummary[] }>(`iposByStatus_${status}`, `/api/status/${status}`);
  return result.data || [];
}

/**
 * Fetches upcoming IPOs
 */
export async function getUpcomingIPOs(): Promise<IPOSummary[]> {
  // Using the dedicated upcoming endpoint if it exists, otherwise fallback to status
  // Let's assume /api/upcoming exists based on the API structure
   return fetchWithCache<IPOSummary[]>('upcomingIPOs', '/api/upcoming');
  // Fallback: return getIPOsByStatus('upcoming');
}

/**
 * Fetches open IPOs
 */
export async function getOpenIPOs(): Promise<IPOSummary[]> {
  return getIPOsByStatus('open'); // Reuses the status fetch function
}

/**
 * Fetches best performing IPOs
 */
export async function getBestPerformingIPOs(): Promise<Partial<IPOSummary>[]> {
   const result = await fetchWithCache<{ data: Partial<IPOSummary>[] }>('bestPerforming', '/api/performance/best');
   return result.data || [];
}

/**
 * Fetches worst performing IPOs
 */
export async function getWorstPerformingIPOs(): Promise<Partial<IPOSummary>[]> {
   const result = await fetchWithCache<{ data: Partial<IPOSummary>[] }>('worstPerforming', '/api/performance/worst');
   return result.data || [];
}

/**
 * Fetches overall IPO statistics
 */
export async function getIPOStats(): Promise<IPOStats | null> {
   try {
     // First, try to fetch from the regular stats endpoint
     const stats = await fetchWithCache<IPOStats | null>('ipoStats', '/api/stats');
     
     // If we got valid stats with totalCount, return them
     if (stats && typeof stats.totalCount === 'number') {
       return stats;
     }
     
     // If stats are missing or incomplete, use the calculate endpoint
     console.log('Stats data incomplete, using calculate endpoint instead');
     return fetchWithCache<IPOStats | null>('ipoStatsCalculated', '/api/stats/calculate');
   } catch (error) {
     console.error('Error fetching IPO stats:', error);
     // Last resort, try the calculate endpoint directly
     try {
       return fetchWithCache<IPOStats | null>('ipoStatsCalculated', '/api/stats/calculate');
     } catch (calcError) {
       console.error('Error fetching calculated IPO stats:', calcError);
       return null;
     }
   }
}

/**
 * Fetches list of years with IPO counts
 */
export async function getIPOYears(): Promise<YearCount[]> {
   return fetchWithCache<YearCount[]>('ipoYears', '/api/years');
}

/**
 * Fetches search results for a given query
 */
export async function searchIPOs(query: string): Promise<IPOSummary[]> {
  if (!query || query.trim() === '') {
    return [];
  }
  const encodedQuery = encodeURIComponent(query.trim());
  // No caching for search results usually, as they depend on the query
  const response = await fetch(`/api/search?q=${encodedQuery}`);
  if (!response.ok) {
    throw new Error(`Failed to search IPOs for query "${query}": ${response.statusText}`);
  }
  // The search endpoint returns a paginated response with { total, page, limit, total_pages, data }
  const result = await response.json();
  return result.data || [];
}

/**
 * Fetches statistics for a specific year from the API
 */
export async function getIPOStatsByYear(year: number): Promise<IPOYearlyStats | null> {
  if (isNaN(year) || year <= 0) return null;
  // Cache key includes the year
  return fetchWithCache<IPOYearlyStats | null>(`statsByYear_${year}`, `/api/stats/year/${year}`);
}

/**
 * Filters IPOs by various criteria (Client-side filtering as fallback)
 * NOTE: Ideally, this should be handled by a dedicated API endpoint `/api/filter`
 *       that accepts filter parameters. Implementing client-side for now.
 */
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
    // Fetch all IPOs first (uses cache if available)
    let filteredIpos = await getAllIPOsSummary();

    // Apply filters locally
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
    // ... (add other filters similarly) ...
     if (filters.maxIssuePrice !== undefined) {
       filteredIpos = filteredIpos.filter(ipo =>
         ipo.issue_price_numeric !== null && ipo.issue_price_numeric <= filters.maxIssuePrice!
       );
     }
     if (filters.minSubscription !== undefined) {
       filteredIpos = filteredIpos.filter(ipo => {
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
    console.error('Error filtering IPOs client-side:', error);
    return []; // Return empty array on error
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
  filterIPOs, // Still exported, but uses client-side filtering
  getIPOStatsByYear
};

export default ipoDataService;
