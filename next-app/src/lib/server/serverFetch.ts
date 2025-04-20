// Server-side data fetching utility for use in Server Components
// This replaces API routes by directly accessing server resources

import fs from 'fs';
import path from 'path';
import { IPODetailedData, IPOSummary, IPOStats, YearCount, IPOYearlyStats } from './ipoDataService';

// Helper function to get output directory path
const getOutputDir = () => {
  const cwd = process.cwd();
  
  // Always prioritize the main project output directory
  const mainOutputDir = path.join(cwd, 'output');
  if (fs.existsSync(mainOutputDir) && fs.statSync(mainOutputDir).isDirectory()) {
    return mainOutputDir;
  }
  
  // Fallback paths
  const possiblePaths = [
    path.join(cwd, '../output'), 
    path.join(cwd, 'public/data'),
    path.join(cwd, 'data'),
  ];
  
  for (const dir of possiblePaths) {
    try {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        return dir;
      }
    } catch (err) {
      console.log(`Path ${dir} does not exist or is not accessible`);
    }
  }
  
  return mainOutputDir;
};

// Get all IPOs summary data
export const getAllIPOsSummarySSR = async (): Promise<IPOSummary[]> => {
  try {
    const outputDir = getOutputDir();
    const filePath = path.join(outputDir, 'all_ipos_meta.json');
    
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as IPOSummary[];
  } catch (error) {
    console.error('Error fetching all IPOs:', error);
    return [];
  }
};

// Get IPO detail by ID (replacing the /api/ipo/[id] route)
export const getIPODetailByIdSSR = async (ipoId: string): Promise<IPODetailedData | null> => {
  try {
    if (!ipoId) {
      return null;
    }
    
    // First, get metadata
    const metaData = await getAllIPOsSummarySSR();
    const ipoMeta = metaData.find(ipo => ipo.ipo_id === ipoId);
    
    if (!ipoMeta) {
      return null;
    }
    
    let rawData = {};
    
    // If raw data path exists, try to get the detailed data
    if (ipoMeta.raw_data_path) {
      const outputDir = getOutputDir();
      const rawDataPath = path.join(outputDir, ipoMeta.raw_data_path);
      
      if (fs.existsSync(rawDataPath)) {
        const rawDataStr = await fs.promises.readFile(rawDataPath, 'utf8');
        rawData = JSON.parse(rawDataStr);
      }
    }
    
    // Combine metadata and raw data
    return {
      ...ipoMeta,
      ...rawData,
      meta: ipoMeta
    } as IPODetailedData;
  } catch (error) {
    console.error(`Error fetching IPO data for ID ${ipoId}:`, error);
    return null;
  }
};

// Get IPOs by status (replacing /api/status/[status] route)
export const getIPOsByStatusSSR = async (status: string): Promise<IPOSummary[]> => {
  try {
    const allIPOs = await getAllIPOsSummarySSR();
    return allIPOs.filter(ipo => ipo.status?.toLowerCase() === status.toLowerCase());
  } catch (error) {
    console.error(`Error fetching IPOs with status ${status}:`, error);
    return [];
  }
};

// Get upcoming IPOs (replacing /api/upcoming route)
export const getUpcomingIPOsSSR = async (): Promise<IPOSummary[]> => {
  return getIPOsByStatusSSR('upcoming');
};

// Search IPOs (replacing /api/search route)
export const searchIPOsSSR = async (query: string): Promise<IPOSummary[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  try {
    const allIPOs = await getAllIPOsSummarySSR();
    const searchTerm = query.toLowerCase();
    
    return allIPOs.filter(ipo => {
      return (
        ipo.ipo_name?.toLowerCase().includes(searchTerm) ||
        ipo.company_name?.toLowerCase().includes(searchTerm)
      );
    });
  } catch (error) {
    console.error(`Error searching IPOs for "${query}":`, error);
    return [];
  }
};

// Get IPO stats (replacing /api/stats route)
export const getIPOStatsSSR = async (): Promise<IPOStats> => {
  try {
    const allIPOs = await getAllIPOsSummarySSR();
    
    // Count IPOs by status
    const statusCounts = {
      upcoming: 0,
      open: 0,
      closed: 0,
      listed: 0,
      unknown: 0
    };
    
    allIPOs.forEach(ipo => {
      const status = ipo.status?.toLowerCase() || 'unknown';
      if (status in statusCounts) {
        statusCounts[status]++;
      } else {
        statusCounts.unknown++;
      }
    });
    
    // Find best and worst performers
    const listedIPOs = allIPOs.filter(ipo => ipo.status === 'listed' && ipo.listing_gains_numeric !== null);
    
    let bestPerformer = null;
    let worstPerformer = null;
    
    if (listedIPOs.length > 0) {
      bestPerformer = listedIPOs.reduce((best, current) => {
        if (current.listing_gains_numeric !== null && 
            (best.listing_gains_numeric === null || current.listing_gains_numeric > best.listing_gains_numeric)) {
          return current;
        }
        return best;
      }, listedIPOs[0]);
      
      worstPerformer = listedIPOs.reduce((worst, current) => {
        if (current.listing_gains_numeric !== null && 
            (worst.listing_gains_numeric === null || current.listing_gains_numeric < worst.listing_gains_numeric)) {
          return current;
        }
        return worst;
      }, listedIPOs[0]);
    }
    
    return {
      totalCount: allIPOs.length,
      byStatus: statusCounts,
      bestPerformer: bestPerformer || {},
      worstPerformer: worstPerformer || {}
    };
  } catch (error) {
    console.error('Error getting IPO stats:', error);
    return {
      totalCount: 0,
      byStatus: {
        upcoming: 0,
        open: 0,
        closed: 0,
        listed: 0,
        unknown: 0
      },
      bestPerformer: {},
      worstPerformer: {}
    };
  }
};

// Get available IPO years (replacing /api/years route)
export const getIPOYearsSSR = async (): Promise<YearCount[]> => {
  try {
    const allIPOs = await getAllIPOsSummarySSR();
    
    // Count IPOs by year
    const yearCounts = new Map<number, number>();
    
    allIPOs.forEach(ipo => {
      if (ipo.year) {
        const count = yearCounts.get(ipo.year) || 0;
        yearCounts.set(ipo.year, count + 1);
      }
    });
    
    // Convert to array and sort by year (descending)
    const result: YearCount[] = Array.from(yearCounts.entries()).map(([year, count]) => ({
      year,
      count
    }));
    
    return result.sort((a, b) => b.year - a.year);
  } catch (error) {
    console.error('Error getting IPO years:', error);
    return [];
  }
};

// Get yearly stats (replacing /api/stats/year/[year] route)
export const getYearlyStatsSSR = async (year: number): Promise<IPOYearlyStats | null> => {
  try {
    const allIPOs = await getAllIPOsSummarySSR();
    const yearIPOs = allIPOs.filter(ipo => ipo.year === year);
    
    if (yearIPOs.length === 0) {
      return null;
    }
    
    // Find listed IPOs with valid listing gains
    const listedIPOs = yearIPOs.filter(ipo => 
      ipo.status === 'listed' && 
      ipo.listing_gains_numeric !== null
    );
    
    // Calculate average listing gain
    let averageListingGain = null;
    if (listedIPOs.length > 0) {
      const sum = listedIPOs.reduce((total, ipo) => total + (ipo.listing_gains_numeric || 0), 0);
      averageListingGain = sum / listedIPOs.length;
    }
    
    // Find best and worst performers
    let bestPerformer = null;
    let worstPerformer = null;
    
    if (listedIPOs.length > 0) {
      bestPerformer = listedIPOs.reduce((best, current) => {
        if (current.listing_gains_numeric !== null && 
            (best.listing_gains_numeric === null || current.listing_gains_numeric > best.listing_gains_numeric)) {
          return current;
        }
        return best;
      }, listedIPOs[0]);
      
      worstPerformer = listedIPOs.reduce((worst, current) => {
        if (current.listing_gains_numeric !== null && 
            (worst.listing_gains_numeric === null || current.listing_gains_numeric < worst.listing_gains_numeric)) {
          return current;
        }
        return worst;
      }, listedIPOs[0]);
    }
    
    return {
      year,
      totalCount: yearIPOs.length,
      averageListingGain,
      bestPerformer,
      worstPerformer
    };
  } catch (error) {
    console.error(`Error getting stats for year ${year}:`, error);
    return null;
  }
}; 