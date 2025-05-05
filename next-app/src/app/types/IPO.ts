export interface IPO {
  id: string;
  companyName: string;
  symbol?: string;
  industry?: string;
  logoUrl?: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  openDate?: string;
  closeDate?: string;
  listingDate?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  cutOffPrice?: number;
  issueSize?: string | number;
  issuePrice?: string;
  lotSize?: number;
  listingGainPercentage?: number;
  listingAt?: string;
}

export interface IPOStats {
  totalIPOs?: number;
  activeCount?: number;
  openIPOs?: number;
  upcomingCount?: number;
  averageReturn?: number;
  totalRaisedCrore?: number;
  totalRaisedFormatted?: string;
  currentYear?: number;
}

export interface IPODetailedData extends IPO {
  // Base information
  sharesOffered?: number;
  totalApplications?: number;
  
  // Charts and visualization data
  listingDayPrices?: number[];
  
  // Detailed information
  contactDetails?: {
    full_address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  
  basicDetails?: {
    issuePrice?: number;
    faceValue?: number;
    issueSize?: number;
    lotSize?: number;
    ipoListingDate?: string;
    creditOfSharesToDemat?: string;
    refundDate?: string;
  };
  
  // Lead managers
  leadManagers?: Array<{
    name: string;
    website?: string;
    email?: string;
    phone?: string;
  }>;
  
  // Listing details
  listingDetails?: {
    scriptCode?: string;
    isin?: string;
    exchange?: string;
  };
  
  // Reservation information
  reservation?: {
    allocation: Array<{
      investor_category: string;
      shares_offered: string;
      percentage?: number;
    }>;
  };
  
  // Financial information
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
  };
  
  // Shareholding pattern
  promoterHolding?: {
    holdings: {
      share_holding_pre_issue?: string;
      share_holding_post_issue?: string;
    };
  };
  
  // Subscription details
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
  };
  
  // Additional tables (like objectives)
  additionalTables?: Array<{
    heading?: string;
    sanitizedHeading?: string;
    headers?: string[];
    rows?: Array<string[]>;
  }>;
  
  listing_performance?: {
    listing_date: string;
    issue_price: number;
    listing_price: number;
    listing_gain: number;
    day_high: number;
    day_low: number;
    closing_price: number;
  };
  
  business_segments?: Array<{
    name: string;
    description: string;
    icon?: string;
  }>;
  
  competitive_strengths?: string[];
  
  promoters?: string[];
  
  prospectus_links?: Array<{
    name: string;
    url: string;
  }>;
  
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface SearchIPO {
  company_name: string;
  detail_url: string;
  opening_date: string;
  closing_date: string;
  listing_date: string;
  issue_price: string | null;
  issue_amount: string;
  listing_at: string;
  lead_manager: string;
  status: string;
  ipo_id: string;
  year: number;
} 