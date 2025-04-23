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
  current_price?: string;
  gain_percentage?: number;
  loss_percentage?: number;
  listing_price?: string;
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

// Get top performing IPOs
export const getTopPerformingIPOs = (limit = 5): IPOSummary[] => {
  const allIpos = readJsonFile('output/all_ipos_meta.json') || [];
  const listedIpos = allIpos.filter((ipo: IPOSummary) => ipo.status === 'listed');
  
  // Sort by listing gains (if available) or return sample data
  if (listedIpos.length > 0) {
    return [...listedIpos]
      .filter((ipo: IPOSummary) => ipo.listing_gains_numeric && ipo.listing_gains_numeric > 0)
      .sort((a: IPOSummary, b: IPOSummary) => {
        return (b.listing_gains_numeric || 0) - (a.listing_gains_numeric || 0);
      })
      .slice(0, limit)
      .map(ipo => ({
        ...ipo,
        current_price: ipo.issue_price_numeric 
          ? `₹${(ipo.issue_price_numeric * (1 + (ipo.listing_gains_numeric || 0) / 100)).toFixed(2)}`
          : undefined,
        gain_percentage: ipo.listing_gains_numeric
      }));
  }
  
  // Return sample data if no real data available
  return getSamplePerformingIPOs(limit);
};

// Get top losing IPOs
export const getTopLosingIPOs = (limit = 5): IPOSummary[] => {
  const allIpos = readJsonFile('output/all_ipos_meta.json') || [];
  const listedIpos = allIpos.filter((ipo: IPOSummary) => ipo.status === 'listed');
  
  // Sort by listing losses (if available) or return sample data
  if (listedIpos.length > 0) {
    return [...listedIpos]
      .filter((ipo: IPOSummary) => ipo.listing_gains_numeric && ipo.listing_gains_numeric < 0)
      .sort((a: IPOSummary, b: IPOSummary) => {
        return (a.listing_gains_numeric || 0) - (b.listing_gains_numeric || 0);
      })
      .slice(0, limit)
      .map(ipo => ({
        ...ipo,
        current_price: ipo.issue_price_numeric 
          ? `₹${(ipo.issue_price_numeric * (1 + (ipo.listing_gains_numeric || 0) / 100)).toFixed(2)}`
          : undefined,
        loss_percentage: Math.abs(ipo.listing_gains_numeric || 0)
      }));
  }
  
  // Return sample data if no real data available
  return getSampleLosingIPOs(limit);
};

// Helper function to generate sample performing IPOs
function getSamplePerformingIPOs(limit: number): IPOSummary[] {
  const sampleIPOs: IPOSummary[] = [
    {
      ipo_id: 'performingsample1',
      ipo_name: 'TechStar IPO',
      company_name: 'TechStar Solutions Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹900',
      issue_price_numeric: 900,
      current_price: '₹1350',
      gain_percentage: 50,
      listing_date: '2023-06-15'
    },
    {
      ipo_id: 'performingsample2',
      ipo_name: 'GreenEnergy IPO',
      company_name: 'GreenEnergy Power Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹450',
      issue_price_numeric: 450,
      current_price: '₹630',
      gain_percentage: 40,
      listing_date: '2023-05-20'
    },
    {
      ipo_id: 'performingsample3',
      ipo_name: 'HealthPlus IPO',
      company_name: 'HealthPlus Care Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹600',
      issue_price_numeric: 600,
      current_price: '₹810',
      gain_percentage: 35,
      listing_date: '2023-07-05'
    },
    {
      ipo_id: 'performingsample4',
      ipo_name: 'FinTech IPO',
      company_name: 'FinTech Solutions Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹1200',
      issue_price_numeric: 1200,
      current_price: '₹1560',
      gain_percentage: 30,
      listing_date: '2023-08-10'
    },
    {
      ipo_id: 'performingsample5',
      ipo_name: 'EduLearn IPO',
      company_name: 'EduLearn Tech Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹300',
      issue_price_numeric: 300,
      current_price: '₹375',
      gain_percentage: 25,
      listing_date: '2023-09-22'
    }
  ];
  
  return sampleIPOs.slice(0, limit);
}

// Helper function to generate sample losing IPOs
function getSampleLosingIPOs(limit: number): IPOSummary[] {
  const sampleIPOs: IPOSummary[] = [
    {
      ipo_id: 'losingsample1',
      ipo_name: 'RetailChain IPO',
      company_name: 'RetailChain Stores Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹800',
      issue_price_numeric: 800,
      current_price: '₹480',
      loss_percentage: 40,
      listing_date: '2023-04-18'
    },
    {
      ipo_id: 'losingsample2',
      ipo_name: 'TravelEase IPO',
      company_name: 'TravelEase Holidays Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹550',
      issue_price_numeric: 550,
      current_price: '₹357.5',
      loss_percentage: 35,
      listing_date: '2023-03-12'
    },
    {
      ipo_id: 'losingsample3',
      ipo_name: 'AutoParts IPO',
      company_name: 'AutoParts Manufacturing Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹420',
      issue_price_numeric: 420,
      current_price: '₹294',
      loss_percentage: 30,
      listing_date: '2023-05-25'
    },
    {
      ipo_id: 'losingsample4',
      ipo_name: 'MediaConnect IPO',
      company_name: 'MediaConnect Networks Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹650',
      issue_price_numeric: 650,
      current_price: '₹487.5',
      loss_percentage: 25,
      listing_date: '2023-07-20'
    },
    {
      ipo_id: 'losingsample5',
      ipo_name: 'FoodDelivery IPO',
      company_name: 'FoodDelivery App Ltd',
      year: 2023,
      status: 'listed',
      issue_price: '₹950',
      issue_price_numeric: 950,
      current_price: '₹760',
      loss_percentage: 20,
      listing_date: '2023-08-30'
    }
  ];
  
  return sampleIPOs.slice(0, limit);
}

// Search for IPOs by name or company name
export const searchIPOs = (query: string, limit = 10): IPOSummary[] => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  const allIpos = readJsonFile('output/all_ipos_meta.json') || [];
  
  return allIpos
    .filter((ipo: IPOSummary) => {
      const companyName = ipo.company_name.toLowerCase();
      const ipoName = ipo.ipo_name.toLowerCase();
      return companyName.includes(searchTerm) || ipoName.includes(searchTerm);
    })
    .slice(0, limit);
}; 