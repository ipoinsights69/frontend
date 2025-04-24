export interface IPO {
  id: string;
  companyName: string;
  symbol?: string;
  industry?: string;
  logoUrl?: string;
  description?: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  
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
} 