import fs from 'fs';
import path from 'path';

// Define interfaces for IPO data
export interface IPOSummary {
  ipo_id: string;
  original_ipo_id?: string;
  ipo_name: string;
  company_name: string;
  year: number;
  status: 'upcoming' | 'open' | 'closed' | 'listed' | 'unknown';
  opening_date?: string;
  closing_date?: string;
  listing_date?: string;
  issue_price?: string;
  issue_price_numeric?: number;
  issue_size?: string;
  issue_size_numeric?: number;
  listing_gains?: string;
  listing_gains_numeric?: number;
  logo_url?: string;
}

export interface IPOStats {
  activeCount: number;
  averageReturn: number;
  upcomingCount: number;
  topSector: {
    name: string;
    return: number;
  };
}

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

// Get trending IPOs (best performers)
export const getTrendingIPOs = (limit = 4): IPOSummary[] => {
  const best = readJsonFile('output/performance/best.json') || [];
  return best.slice(0, limit);
};

// Get upcoming IPOs
export const getUpcomingIPOs = (limit = 4): IPOSummary[] => {
  const upcoming = readJsonFile('output/status/upcoming.json') || [];
  return upcoming.slice(0, limit);
};

// Get recently listed IPOs
export const getRecentlyListedIPOs = (limit = 4): IPOSummary[] => {
  const listed = readJsonFile('output/status/listed.json') || [];
  
  // Sort by listing date (newest first) and take the most recent ones
  return [...listed]
    .filter((ipo: IPOSummary) => ipo.listing_date)
    .sort((a: IPOSummary, b: IPOSummary) => {
      const dateA = new Date(a.listing_date || '');
      const dateB = new Date(b.listing_date || '');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);
};

// Get closed IPOs
export const getClosedIPOs = (limit = 4): IPOSummary[] => {
  const closed = readJsonFile('output/status/closed.json') || [];
  return closed.slice(0, limit);
};

// Get IPO market statistics
export const getIPOStats = (): IPOStats => {
  // Get data needed for stats
  const allIpos = readJsonFile('output/all_ipos_meta.json') || [];
  const listed = allIpos.filter((ipo: IPOSummary) => ipo.status === 'listed');
  const upcoming = allIpos.filter((ipo: IPOSummary) => ipo.status === 'upcoming');
  
  // Calculate stats
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  
  const activeThisMonth = listed.filter((ipo: IPOSummary) => {
    const listingDate = new Date(ipo.listing_date || '');
    return listingDate > lastMonthDate;
  });
  
  // Calculate average return for listed IPOs with gain data
  const iposWithGains = listed.filter((ipo: IPOSummary) => ipo.listing_gains_numeric !== undefined && ipo.listing_gains_numeric !== null);
  const averageReturn = iposWithGains.length > 0
    ? iposWithGains.reduce((sum: number, ipo: IPOSummary) => sum + (ipo.listing_gains_numeric || 0), 0) / iposWithGains.length
    : 0;
  
  // Find top performing sector (this is a simplified version)
  // In a real app, you'd analyze the data more thoroughly
  const topSector = {
    name: 'Technology',
    return: 35.8
  };
  
  return {
    activeCount: activeThisMonth.length,
    averageReturn,
    upcomingCount: upcoming.length,
    topSector
  };
}; 