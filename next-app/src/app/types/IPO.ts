export interface IPO {
  id: string;
  companyName: string;
  symbol?: string;
  industry?: string;
  logoUrl?: string;
  description?: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed' | 'unknown';
  
  // Dates
  openDate?: string;
  closeDate?: string;
  allotmentDate?: string;
  refundDate?: string;
  listingDate?: string;
  
  // Price information
  priceRange?: {
    min: number;
    max: number;
  };
  cutOffPrice?: number;
  lotSize?: number;
  issueSize?: number;
  issueType?: string;
  
  // Listing details
  listingPrice?: number;
  listingGain?: number;
  listingGainPercentage?: number;
  
  // Subscription details
  overallSubscription?: number;
  retailSubscription?: number;
  qibSubscription?: number;
  niiSubscription?: number;
  
  // GMP (Grey Market Premium)
  gmp?: number;
  gmpPercentage?: number;
  
  // Registrar information
  registrarDetails?: {
    name: string;
    website?: string;
    email?: string;
    phone?: string;
  };

  // New properties from API
  listingAt?: string;
  leadManager?: string;
}

export interface IPOStats {
  activeCount: number;
  averageReturn: number;
  upcomingCount: number;
  topSector: {
    name: string;
    return: number;
  };
  totalIPOs?: number;
  listedIPOs?: number;
  closedIPOs?: number;
  openIPOs?: number;
  totalRaisedCrore?: number;
  totalRaisedFormatted?: string;
  successRate?: string;
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