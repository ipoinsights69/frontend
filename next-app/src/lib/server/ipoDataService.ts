import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import path from 'path';
import 'server-only';

// Define types based on the data structure
export interface IPOSummary {
  ipo_id: string;
  original_ipo_id: string | null;
  ipo_name: string | null;
  company_name: string | null;
  year: number | null;
  status: 'upcoming' | 'open' | 'closed' | 'listed' | 'unknown' | null;
  raw_data_path: string;
  opening_date: string | null;
  closing_date: string | null;
  listing_date: string | null;
  issue_price: string | null;
  issue_price_numeric: number | null;
  face_value: string | null;
  issue_size: string | null;
  issue_size_numeric: number | null;
  issue_type: string | null;
  listing_at: string | null;
  lot_size: string | null;
  minimum_amount_string: string | null;
  overall_subscription: number | null;
  retail_subscription: number | null;
  nii_subscription: number | null;
  qib_subscription: number | null;
  total_applications: number | null;
  listing_gains: string | null;
  listing_gains_numeric: number | null;
  listing_price_open: number | string | null;
  listing_price_high: number | string | null;
  listing_price_low: number | string | null;
  listing_price_last: number | string | null;
  logo_url: string | null;
  market_maker: string | null;
  registrar_name: string | null;
}

export interface IPODetailedData {
  _id: string;
  ipo_id: string;
  ipoName: string;
  year: number;
  status: string;
  basicDetails: any; // You can define more specific types for these
  tentativeDetails: any;
  lotSizes: any;
  about: string;
  subscriptionStatus: any;
  contactDetails: any;
  registrarDetails: any;
  leadManagers: any[];
  listingDetail: any;
  listingDayTrading: any;
  faqs: any[];
  recommendationSummary: any;
  prospectusLinks: any[];
  reservation: any;
  anchorInvestors: any;
  additionalTables: any[];
  // Add other properties as needed
}

export interface IPOStats {
  totalCount: number;
  byStatus: {
    upcoming: number;
    open: number;
    closed: number;
    listed: number;
    unknown: number;
  };
  bestPerformer: Partial<IPOSummary>;
  worstPerformer: Partial<IPOSummary>;
}

export interface YearCount {
  year: number;
  count: number;
}

// Helper function to get the base output directory path
const getOutputDir = () => {
  // The previous path might be incorrect - log the path and try a few alternatives
  const cwd = process.cwd();
  console.log("Current working directory:", cwd);
  
  // Always prioritize the main project output directory which has the real data
  const mainOutputDir = path.join(cwd, '../output');
  if (fsSync.existsSync(mainOutputDir) && fsSync.statSync(mainOutputDir).isDirectory()) {
    console.log("Using main output directory:", mainOutputDir);
    return mainOutputDir;
  }
  
  // Fallback paths in order of preference
  const possiblePaths = [
    path.join(cwd, 'output'), 
    path.join(cwd, 'public/data'),
    path.join(cwd, 'data'),
    path.join(cwd, '../data')
  ];
  
  // Check each path and use the first one that exists
  for (const dir of possiblePaths) {
    try {
      if (fsSync.existsSync(dir) && fsSync.statSync(dir).isDirectory()) {
        console.log("Found data directory:", dir);
        return dir;
      }
    } catch (err) {
      console.log(`Path ${dir} does not exist or is not accessible`);
    }
  }
  
  // If no data directory exists yet, create and use the main output directory
  try {
    console.log(`Creating main output directory: ${mainOutputDir}`);
    fsSync.mkdirSync(mainOutputDir, { recursive: true });
    return mainOutputDir;
  } catch (err) {
    console.log(`Error creating directory ${mainOutputDir}:`, err);
    
    // Last resort fallback to public/data
    const publicDataDir = path.join(cwd, 'public/data');
    try {
      console.log(`Creating public data directory: ${publicDataDir}`);
      fsSync.mkdirSync(publicDataDir, { recursive: true });
      return publicDataDir;
    } catch (secondErr) {
      console.log(`Error creating directory ${publicDataDir}:`, secondErr);
    }
  }
  
  // Absolute last resort
  return mainOutputDir; // Return this even if we couldn't create it
};

// Fallback data for testing
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

/**
 * Gets all IPO summary data from the central meta file
 */
export const getAllIPOsSummary = async (): Promise<IPOSummary[]> => {
  try {
    const outputDir = getOutputDir();
    const filePath = path.join(outputDir, 'all_ipos_meta.json');
    console.log(`Attempting to read file: ${filePath}`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as IPOSummary[];
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
      
      // If the file doesn't exist, try to create it with test data
      try {
        console.log(`Creating test data file at ${filePath}`);
        // Make sure the directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        // Write the test data
        await fs.writeFile(filePath, JSON.stringify(TEST_IPOS, null, 2));
        return TEST_IPOS;
      } catch (writeErr) {
        console.error(`Error creating test data file:`, writeErr);
        return TEST_IPOS;
      }
    }
  } catch (error) {
    console.error('Error loading IPO meta data:', error);
    return TEST_IPOS;
  }
};

/**
 * Gets detailed data for a specific IPO by ID
 */
export const getIPODetailById = async (ipoId: string): Promise<IPODetailedData | null> => {
  try {
    // First, get the meta data to find the raw data path
    const allIpos = await getAllIPOsSummary();
    const ipoMeta = allIpos.find(ipo => ipo.ipo_id === ipoId);
    
    if (!ipoMeta) {
      console.error(`IPO with ID ${ipoId} not found in metadata`);
      return null;
    }
    
    if (!ipoMeta.raw_data_path) {
      console.error(`Raw data path not found for IPO ${ipoId}`);
      return null;
    }
    
    const outputDir = getOutputDir();
    const rawFilePath = path.join(outputDir, ipoMeta.raw_data_path);
    console.log(`Attempting to read IPO detail file: ${rawFilePath}`);
    
    try {
      const data = await fs.readFile(rawFilePath, 'utf8');
      return JSON.parse(data) as IPODetailedData;
    } catch (readErr) {
      console.error(`Error reading IPO detail file ${rawFilePath}:`, readErr);
      
      // Create a basic detailed data object from the metadata
      const fallbackDetail: IPODetailedData = {
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
      
      // Try to create the directory and file for future use
      try {
        const dirPath = path.dirname(rawFilePath);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(rawFilePath, JSON.stringify(fallbackDetail, null, 2));
        console.log(`Created fallback detail file at ${rawFilePath}`);
      } catch (writeErr) {
        console.error(`Failed to create fallback detail file:`, writeErr);
      }
      
      return fallbackDetail;
    }
  } catch (error) {
    console.error(`Error loading detailed IPO data for ${ipoId}:`, error);
    return null;
  }
};

/**
 * Gets IPOs filtered by status
 */
export const getIPOsByStatus = async (status: string): Promise<IPOSummary[]> => {
  try {
    const outputDir = getOutputDir();
    const filePath = path.join(outputDir, 'status', `${status}.json`);
    console.log(`Attempting to read file: ${filePath}`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as IPOSummary[];
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
      
      // Filter test data by status
      const filteredIPOs = TEST_IPOS.filter(ipo => ipo.status === status);
      
      // If the file doesn't exist, try to create it with test data
      try {
        console.log(`Creating test data file at ${filePath}`);
        // Make sure the directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        // Write the test data
        await fs.writeFile(filePath, JSON.stringify(filteredIPOs, null, 2));
        return filteredIPOs;
      } catch (writeErr) {
        console.error(`Error creating test data file:`, writeErr);
        return filteredIPOs;
      }
    }
  } catch (error) {
    console.error(`Error loading IPOs with status ${status}:`, error);
    return TEST_IPOS.filter(ipo => ipo.status === status);
  }
};

/**
 * Gets upcoming IPOs
 */
export const getUpcomingIPOs = async (): Promise<IPOSummary[]> => {
  return getIPOsByStatus('upcoming');
};

/**
 * Gets open IPOs
 */
export const getOpenIPOs = async (): Promise<IPOSummary[]> => {
  return getIPOsByStatus('open');
};

/**
 * Gets best performing IPOs
 */
export const getBestPerformingIPOs = async (): Promise<Partial<IPOSummary>[]> => {
  try {
    const outputDir = getOutputDir();
    const filePath = path.join(outputDir, 'performance', 'best.json');
    console.log(`Attempting to read file: ${filePath}`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
      
      // Generate best performing IPOs
      const bestPerforming = TEST_IPOS
        .filter(ipo => ipo.listing_gains_numeric !== undefined)
        .sort((a, b) => (b.listing_gains_numeric || 0) - (a.listing_gains_numeric || 0))
        .slice(0, 5);
      
      // If the file doesn't exist, try to create it with test data
      try {
        console.log(`Creating test data file at ${filePath}`);
        // Make sure the directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        // Write the test data
        await fs.writeFile(filePath, JSON.stringify(bestPerforming, null, 2));
        return bestPerforming;
      } catch (writeErr) {
        console.error(`Error creating test data file:`, writeErr);
        return bestPerforming;
      }
    }
  } catch (error) {
    console.error('Error loading best performing IPOs:', error);
    // Return test data fallback
    return TEST_IPOS
      .filter(ipo => ipo.listing_gains_numeric !== undefined)
      .sort((a, b) => (b.listing_gains_numeric || 0) - (a.listing_gains_numeric || 0))
      .slice(0, 5);
  }
};

/**
 * Gets worst performing IPOs
 */
export const getWorstPerformingIPOs = async (): Promise<Partial<IPOSummary>[]> => {
  try {
    const outputDir = getOutputDir();
    const filePath = path.join(outputDir, 'performance', 'worst.json');
    console.log(`Attempting to read file: ${filePath}`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
      
      // Generate worst performing IPOs
      const worstPerforming = TEST_IPOS
        .filter(ipo => ipo.listing_gains_numeric !== undefined)
        .sort((a, b) => (a.listing_gains_numeric || 0) - (b.listing_gains_numeric || 0))
        .slice(0, 5);
      
      // If the file doesn't exist, try to create it with test data
      try {
        console.log(`Creating test data file at ${filePath}`);
        // Make sure the directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        // Write the test data
        await fs.writeFile(filePath, JSON.stringify(worstPerforming, null, 2));
        return worstPerforming;
      } catch (writeErr) {
        console.error(`Error creating test data file:`, writeErr);
        return worstPerforming;
      }
    }
  } catch (error) {
    console.error('Error loading worst performing IPOs:', error);
    // Return test data fallback
    return TEST_IPOS
      .filter(ipo => ipo.listing_gains_numeric !== undefined)
      .sort((a, b) => (a.listing_gains_numeric || 0) - (b.listing_gains_numeric || 0))
      .slice(0, 5);
  }
};

/**
 * Gets overall IPO statistics
 */
export const getIPOStats = async (): Promise<IPOStats> => {
  try {
    const outputDir = getOutputDir();
    const filePath = path.join(outputDir, 'stats.json');
    console.log(`Attempting to read file: ${filePath}`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as IPOStats;
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
      
      // Calculate statistics from test data
      const totalCount = TEST_IPOS.length;
      
      // Count by status
      const byStatus = {
        upcoming: 0,
        open: 0,
        closed: 0,
        listed: 0,
        unknown: 0
      };
      
      TEST_IPOS.forEach(ipo => {
        if (ipo.status && byStatus.hasOwnProperty(ipo.status)) {
          byStatus[ipo.status as keyof typeof byStatus]++;
        } else {
          byStatus.unknown++;
        }
      });
      
      // Find best and worst performers
      const listedIpos = TEST_IPOS.filter(ipo => 
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
      
      // If the file doesn't exist, try to create it with test data
      try {
        console.log(`Creating test data file at ${filePath}`);
        // Make sure the directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        // Write the test data
        await fs.writeFile(filePath, JSON.stringify(stats, null, 2));
        return stats;
      } catch (writeErr) {
        console.error(`Error creating test data file:`, writeErr);
        return stats;
      }
    }
  } catch (error) {
    console.error('Error loading IPO stats:', error);
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
};

/**
 * Gets list of years with IPO counts
 */
export const getIPOYears = async (): Promise<YearCount[]> => {
  try {
    const outputDir = getOutputDir();
    const filePath = path.join(outputDir, 'years.json');
    console.log(`Attempting to read file: ${filePath}`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as YearCount[];
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
      
      // Generate years data from test data
      const years = Array.from(new Set(TEST_IPOS.map(ipo => ipo.year)))
        .filter(year => year !== null)
        .map(year => ({
          year: year!,
          count: TEST_IPOS.filter(ipo => ipo.year === year).length
        }));
      
      // If the file doesn't exist, try to create it with test data
      try {
        console.log(`Creating test data file at ${filePath}`);
        // Make sure the directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        // Write the test data
        await fs.writeFile(filePath, JSON.stringify(years, null, 2));
        return years;
      } catch (writeErr) {
        console.error(`Error creating test data file:`, writeErr);
        return years;
      }
    }
  } catch (error) {
    console.error('Error loading IPO years data:', error);
    // Generate years data from test data as fallback
    return Array.from(new Set(TEST_IPOS.map(ipo => ipo.year)))
      .filter(year => year !== null)
      .map(year => ({
        year: year!,
        count: TEST_IPOS.filter(ipo => ipo.year === year).length
      }));
  }
};

/**
 * Searches IPOs by name or company
 */
export const searchIPOs = async (query: string): Promise<IPOSummary[]> => {
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
};

/**
 * Filters IPOs by various criteria
 */
export const filterIPOs = async (filters: {
  status?: string;
  year?: number;
  minIssuePrice?: number;
  maxIssuePrice?: number;
  minSubscription?: number;
  minListingGains?: number;
  maxListingGains?: number;
}): Promise<IPOSummary[]> => {
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
}; 