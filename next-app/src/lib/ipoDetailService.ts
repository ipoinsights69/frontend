import fs from 'fs';
import path from 'path';

export interface IPODetailedData {
  ipo_id: string;
  original_ipo_id: string;
  company_name: string;
  ipo_name: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed' | 'unknown';
  year: number;
  issue_price?: string;
  issue_price_numeric?: number;
  face_value?: string;
  face_value_numeric?: number;
  issue_size?: string;
  issue_size_numeric?: number;
  fresh_issue?: string;
  offer_for_sale?: string;
  issue_type?: string;
  listing_at?: string;
  opening_date?: string;
  closing_date?: string;
  allotment_date?: string;
  refund_date?: string;
  credit_of_shares?: string;
  listing_date?: string;
  listing_price?: string;
  listing_price_open?: string;
  listing_price_high?: string;
  listing_price_low?: string;
  listing_price_last?: string;
  listing_gains?: string;
  listing_gains_numeric?: number;
  lot_size?: number;
  minimum_amount_string?: string;
  minimum_amount?: number;
  overall_subscription?: string;
  overall_subscription_numeric?: number;
  retail_subscription?: string;
  retail_subscription_numeric?: number;
  nii_subscription?: string;
  nii_subscription_numeric?: number;
  qib_subscription?: string;
  qib_subscription_numeric?: number;
  total_applications?: number;
  promoter_holding_pre?: number;
  promoter_holding_post?: number;
  logo_url?: string;
  market_maker?: string;
  registrar_name?: string;
  about?: string;
  business_segments?: Array<{
    name: string;
    description: string;
    icon?: string;
  }>;
  competitive_strengths?: string[];
  ipo_objectives?: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  promoters?: string[];
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  financials?: {
    data?: Array<{
      period: string;
      assets?: number;
      revenue?: number;
      profit?: number;
      net_worth?: number;
      total_borrowing?: number;
    }>;
    ratios?: {
      roe?: number;
      roce?: number;
      pat_margin?: number;
      debt_equity?: number;
    };
    eps?: {
      pre?: number;
      post?: number;
      pe_pre?: number;
      pe_post?: number;
    };
    debt_equity_trend?: Array<{
      period: string;
      value: number;
    }>;
  };
  subscription_details?: {
    status: {
      overall: number;
      retail: number;
      nii: number;
      qib?: number;
    };
    day_wise?: Array<{
      day: string;
      overall: number;
      retail: number;
      nii: number;
      qib?: number;
    }>;
    total_applications?: number;
    reservation?: {
      retail: number;
      nii: number;
      qib?: number;
      market_maker?: number;
    };
    lot_size?: {
      retail: {
        lots: number;
        shares: number;
        amount: number;
      };
      hni: {
        lots: number;
        shares: number;
        amount: number;
      };
    };
  };
  listing_performance?: {
    listing_date: string;
    issue_price: number;
    listing_price: number;
    listing_gain: number;
    day_high: number;
    day_low: number;
    closing_price: number;
    day_data?: Array<{
      time: string;
      price: number;
    }>;
    exchange?: string;
    script_code?: string;
    isin?: string;
  };
  details?: {
    issue_type?: string;
    issue_size?: string;
    fresh_issue?: string;
    face_value?: string;
    issue_price?: string;
    lot_size?: string;
    market_maker_portion?: string;
    listing_at?: string;
    pre_issue_share_holding?: {
      promoters: number;
      others: number;
    };
    post_issue_share_holding?: {
      promoters: number;
      public: number;
    };
    total_shares_pre?: number;
    total_shares_post?: number;
  };
  prospectus_links?: Array<{
    name: string;
    url: string;
  }>;
  important_dates?: {
    open_date?: string;
    close_date?: string;
    allotment_date?: string;
    refund_date?: string;
    credit_date?: string;
    listing_date?: string;
  };
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  lead_managers?: Array<{
    name: string;
    abbr?: string;
  }>;
  registrar?: {
    name: string;
    email?: string;
  };
  recommendation_summary?: {
    subscribe: number;
    neutral: number;
    avoid: number;
    total: number;
  };
  hasOverview: boolean;
  hasFinancials: boolean;
  hasSubscription: boolean;
  hasListingPerformance: boolean;
  hasDetails: boolean;
  hasFaqs: boolean;
}

export async function getIPOById(id: string): Promise<IPODetailedData | null> {
  try {
    // First try to find the year from the id (usually starts with year_)
    let year = '';
    const yearMatch = id.match(/^(\d{4})_/);
    if (yearMatch) {
      year = yearMatch[1];
    } else {
      // If no year prefix, try to find the IPO in all_ipos_meta.json
      const allIposMetaPath = path.join(process.cwd(), 'output', 'all_ipos_meta.json');
      const allIposMetaContent = fs.readFileSync(allIposMetaPath, 'utf8');
      const allIposMeta = JSON.parse(allIposMetaContent);
      
      const ipoMeta = allIposMeta.find((ipo: any) => ipo.ipo_id === id);
      if (ipoMeta) {
        year = ipoMeta.year.toString();
      } else {
        return null;
      }
    }

    // Find the raw IPO data file
    const rawFilePath = path.join(process.cwd(), 'output', 'raw', year, `${id}.json`);
    
    if (!fs.existsSync(rawFilePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(rawFilePath, 'utf8');
    const ipoData = JSON.parse(fileContent);
    
    // Determine which sections are available
    const hasOverview = !!(ipoData.about || ipoData.business_segments || ipoData.competitive_strengths);
    const hasFinancials = !!(ipoData.financials && (ipoData.financials.data || ipoData.financials.ratios));
    const hasSubscription = !!(ipoData.subscription_details && ipoData.subscription_details.status);
    const hasListingPerformance = !!(ipoData.listing_performance && ipoData.status === 'listed');
    const hasDetails = !!(ipoData.details || ipoData.issue_type || ipoData.issue_size);
    const hasFaqs = !!(ipoData.faqs && ipoData.faqs.length > 0);

    return {
      ...ipoData,
      hasOverview,
      hasFinancials,
      hasSubscription,
      hasListingPerformance,
      hasDetails,
      hasFaqs
    };
  } catch (error) {
    console.error(`Error getting IPO by id ${id}:`, error);
    return null;
  }
}

export async function getRelatedIPOs(id: string, limit = 4): Promise<any[]> {
  try {
    const allIposMetaPath = path.join(process.cwd(), 'output', 'all_ipos_meta.json');
    const allIposMetaContent = fs.readFileSync(allIposMetaPath, 'utf8');
    const allIposMeta = JSON.parse(allIposMetaContent);
    
    // Get the current IPO to find related ones with similar attributes
    const currentIPO = allIposMeta.find((ipo: any) => ipo.ipo_id === id);
    
    if (!currentIPO) {
      return [];
    }
    
    // Find IPOs with the same status or listing date close to the current one
    const relatedIPOs = allIposMeta
      .filter((ipo: any) => ipo.ipo_id !== id)
      .sort((a: any, b: any) => {
        // Prioritize IPOs with the same status
        if (a.status === currentIPO.status && b.status !== currentIPO.status) {
          return -1;
        }
        if (a.status !== currentIPO.status && b.status === currentIPO.status) {
          return 1;
        }
        
        // Then sort by listing date (most recent first)
        const dateA = a.listing_date ? new Date(a.listing_date) : new Date(0);
        const dateB = b.listing_date ? new Date(b.listing_date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
    
    return relatedIPOs;
  } catch (error) {
    console.error('Error getting related IPOs:', error);
    return [];
  }
}

export async function getAllIPOIds(): Promise<string[]> {
  try {
    const idsPath = path.join(process.cwd(), 'output', 'ipo_ids.json');
    const idsContent = fs.readFileSync(idsPath, 'utf8');
    const idsData = JSON.parse(idsContent);
    
    return idsData.map((item: any) => item.ipo_id);
  } catch (error) {
    console.error('Error getting all IPO IDs:', error);
    return [];
  }
} 