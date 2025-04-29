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
  issue_type?: string;
  listing_at?: string;
  lot_size?: string | number;
  face_value?: string;
  fresh_issue?: string;
  offer_for_sale?: string;
  minimum_amount_string?: string;
  registrar_name?: string;
}

export interface IPOStats {
  upcomingCount: number;
  averageReturn: number;
  topSector: {
    name: string;
    return: number;
  };
}

export interface IPODataProps {
  upcomingIPOs: IPOSummary[];
  stats: IPOStats;
}

// Helper function to read JSON file (server-side only)
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

// Get upcoming IPOs data
export async function getUpcomingIPOData(): Promise<IPODataProps> {
  // Read upcoming IPOs
  const upcoming = readJsonFile('output/status/upcoming.json') || [];
  
  // Create stats
  const stats = {
    upcomingCount: upcoming.length,
    averageReturn: 21.7,
    topSector: {
      name: 'Technology',
      return: 35.8
    }
  };
  
  return {
    upcomingIPOs: upcoming,
    stats
  };
} 