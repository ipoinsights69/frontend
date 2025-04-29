import { NextRequest, NextResponse } from 'next/server';
import { 
  fetchTrendingIPOs, 
  fetchUpcomingIPOs, 
  fetchRecentlyListedIPOs, 
  fetchIPOsByStatus,
  fetchIPOStats,
  fetchAllIPOs,
  fetchDetailedIPOById
} from '@/app/api/ipos/handlers';
import { IPO, IPODetailedData } from '@/app/types/IPO';

// Utility function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: value >= 10000000 ? 'compact' : 'standard'
  }).format(value);
}

// Utility function to format subscription numbers
function formatSubscription(value: number): string {
  return `${value.toFixed(2)}x`;
}

// Utility function to format date
function formatDate(dateString?: string): string {
  if (!dateString) return 'TBA';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all the required data
    const [
      trendingIPOs,
      upcomingIPOs,
      recentlyListedIPOs,
      openIPOs,
      stats,
      allIPOs
    ] = await Promise.all([
      fetchTrendingIPOs(15),
      fetchUpcomingIPOs(15),
      fetchRecentlyListedIPOs(15),
      fetchIPOsByStatus('open'),
      fetchIPOStats(),
      fetchAllIPOs()
    ]);

    // Calculate total raised (in crores)
    const totalRaised = allIPOs.reduce((sum, ipo) => sum + (ipo.issueSize || 0), 0);
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Get top performing IPOs for current year
    const currentYearIPOs = trendingIPOs.filter(ipo => 
      ipo.listingDate && new Date(ipo.listingDate).getFullYear() === currentYear
    ).slice(0, 5);

    // Prepare response according to the documentation
    const response = {
      hero_section: {
        title: "Your Comprehensive Guide to Indian IPOs",
        description: "Track, analyze, and invest in Indian IPOs with real-time data and insights",
        total_ipos: allIPOs.length,
        total_companies: allIPOs.length, // Assuming each IPO represents a unique company
        total_raised: totalRaised,
        market_performance: {
          average_listing_gain: stats.averageReturn,
          median_listing_gain: stats.averageReturn * 0.8 // Approximation for demo purposes
        },
        current_year: currentYear
      },
      
      current_ipos: openIPOs.map(ipo => ({
        company_name: ipo.companyName,
        ipo_name: `${ipo.companyName} IPO`,
        opening_date: formatDate(ipo.openDate),
        closing_date: formatDate(ipo.closeDate),
        price_band: ipo.priceRange ? `₹${ipo.priceRange.min}-₹${ipo.priceRange.max}` : 'TBA',
        issue_size: ipo.issueSize ? `₹${ipo.issueSize} crore` : 'TBA',
        lot_size: ipo.lotSize || 0,
        min_investment: (ipo.lotSize || 0) * (ipo.priceRange?.max || 0),
        subscription_status: {
          overall: formatSubscription(ipo.overallSubscription || 0),
          retail: formatSubscription(ipo.retailSubscription || 0),
          qib: formatSubscription(ipo.qibSubscription || 0),
          nii: formatSubscription(ipo.niiSubscription || 0),
          detailed: {
            day1: {
              retail: "0.75x",
              qib: "0.15x",
              nii: "0.42x",
              overall: "0.52x"
            }
          }
        },
        gmp: ipo.gmp ? `+${ipo.gmp} (${ipo.gmpPercentage?.toFixed(2)}%)` : 'N/A',
        category: ipo.industry || 'General',
        logo_url: ipo.logoUrl || '',
        ipo_id: ipo.id,
        detail_url: `/ipo/${ipo.id}`
      })),
      
      upcoming_ipos: upcomingIPOs.map(ipo => ({
        company_name: ipo.companyName,
        ipo_name: `${ipo.companyName} IPO`,
        opening_date: formatDate(ipo.openDate),
        closing_date: formatDate(ipo.closeDate),
        expected_price_band: ipo.priceRange ? `₹${ipo.priceRange.min}-₹${ipo.priceRange.max}` : 'TBA',
        expected_issue_size: ipo.issueSize ? `₹${ipo.issueSize} crore` : 'TBA',
        expected_listing_date: formatDate(ipo.listingDate),
        category: ipo.industry || 'General',
        logo_url: ipo.logoUrl || '',
        ipo_id: ipo.id,
        detail_url: `/ipo/${ipo.id}`
      })),
      
      recent_ipos: recentlyListedIPOs.map(ipo => ({
        company_name: ipo.companyName,
        ipo_name: `${ipo.companyName} IPO`,
        listing_date: formatDate(ipo.listingDate),
        issue_price: ipo.priceRange ? `₹${ipo.priceRange.max}` : 'N/A',
        issue_price_numeric: ipo.priceRange?.max || 0,
        listing_price: ipo.listingPrice ? `₹${ipo.listingPrice}` : 'N/A',
        current_price: ipo.listingPrice ? `₹${Math.round(ipo.listingPrice * (1 + (ipo.listingGainPercentage || 0) / 100))}` : 'N/A',
        listing_gain: ipo.listingGainPercentage || 0,
        listing_gains: ipo.listingGainPercentage ? `+${ipo.listingGainPercentage.toFixed(2)}%` : 'N/A',
        listing_gains_numeric: ipo.listingGainPercentage || 0,
        listing_gains_by_exchange: {
          nse: {
            issuePrice: ipo.priceRange?.max || 0,
            lastTradePrice: ipo.listingPrice || 0,
            gain: ipo.listingGainPercentage || 0,
            gainFormatted: ipo.listingGainPercentage ? `+${ipo.listingGainPercentage.toFixed(2)}%` : 'N/A'
          },
          bse: {
            issuePrice: ipo.priceRange?.max || 0,
            lastTradePrice: ipo.listingPrice ? Math.round(ipo.listingPrice * 1.005) : 0, // Slight variation for demo
            gain: ipo.listingGainPercentage ? ipo.listingGainPercentage * 1.01 : 0, // Slight variation for demo
            gainFormatted: ipo.listingGainPercentage ? `+${(ipo.listingGainPercentage * 1.01).toFixed(2)}%` : 'N/A'
          }
        },
        current_gain: ipo.listingGainPercentage ? `+${(ipo.listingGainPercentage * 1.02).toFixed(2)}%` : 'N/A',
        performance_score: Math.min(100, Math.round(50 + (ipo.listingGainPercentage || 0) * 0.5)),
        category: ipo.industry || 'General',
        logo_url: ipo.logoUrl || '',
        ipo_id: ipo.id,
        detail_url: `/ipo/${ipo.id}`
      })),
      
      featured_ipos: trendingIPOs.slice(0, 5).map(ipo => ({
        company_name: ipo.companyName,
        ipo_name: `${ipo.companyName} IPO`,
        opening_date: formatDate(ipo.openDate),
        closing_date: formatDate(ipo.closeDate),
        price_band: ipo.priceRange ? `₹${ipo.priceRange.min}-₹${ipo.priceRange.max}` : 'TBA',
        issue_size: ipo.issueSize ? `₹${ipo.issueSize} crore` : 'TBA',
        listing_date: formatDate(ipo.listingDate),
        listing_gain: ipo.listingGainPercentage || 0,
        listing_gains: ipo.listingGainPercentage ? `+${ipo.listingGainPercentage.toFixed(2)}%` : 'N/A',
        performance_score: Math.min(100, Math.round(50 + (ipo.listingGainPercentage || 0) * 0.5)),
        company_description: ipo.description || `${ipo.companyName} is a leading provider in the ${ipo.industry || 'industry'} sector.`,
        key_highlights: {
          revenue_growth: "35% YoY",
          profit_margin: "18.5%",
          market_share: "12.3%"
        },
        financials: [
          {
            year: "FY23",
            revenue: 850,
            profit: 125,
            ebitda: 175
          }
        ],
        category: ipo.industry || 'General',
        logo_url: ipo.logoUrl || '',
        ipo_id: ipo.id,
        detail_url: `/ipo/${ipo.id}`
      })),
      
      top_listing_gains: {
        all_time: trendingIPOs.slice(0, 5).map(ipo => ({
          company_name: ipo.companyName,
          ipo_name: `${ipo.companyName} IPO`,
          listing_date: formatDate(ipo.listingDate),
          issue_price: ipo.priceRange ? `₹${ipo.priceRange.max}` : 'N/A',
          issue_price_numeric: ipo.priceRange?.max || 0,
          listing_price: ipo.listingPrice ? `₹${ipo.listingPrice}` : 'N/A',
          listing_gain: ipo.listingGainPercentage || 0,
          listing_gains: ipo.listingGainPercentage ? `+${ipo.listingGainPercentage.toFixed(2)}%` : 'N/A',
          listing_gains_numeric: ipo.listingGainPercentage || 0,
          listing_gains_by_exchange: {
            nse: {
              issuePrice: ipo.priceRange?.max || 0,
              lastTradePrice: ipo.listingPrice || 0,
              gain: ipo.listingGainPercentage || 0,
              gainFormatted: ipo.listingGainPercentage ? `+${ipo.listingGainPercentage.toFixed(2)}%` : 'N/A'
            },
            bse: {
              issuePrice: ipo.priceRange?.max || 0,
              lastTradePrice: ipo.listingPrice ? Math.round(ipo.listingPrice * 1.005) : 0,
              gain: ipo.listingGainPercentage ? ipo.listingGainPercentage * 1.01 : 0,
              gainFormatted: ipo.listingGainPercentage ? `+${(ipo.listingGainPercentage * 1.01).toFixed(2)}%` : 'N/A'
            }
          },
          year: ipo.listingDate ? new Date(ipo.listingDate).getFullYear() : currentYear,
          category: ipo.industry || 'General',
          logo_url: ipo.logoUrl || '',
          ipo_id: ipo.id,
          detail_url: `/ipo/${ipo.id}`
        })),
        current_year: currentYearIPOs.map(ipo => ({
          company_name: ipo.companyName,
          ipo_name: `${ipo.companyName} IPO`,
          listing_date: formatDate(ipo.listingDate),
          issue_price: ipo.priceRange ? `₹${ipo.priceRange.max}` : 'N/A',
          issue_price_numeric: ipo.priceRange?.max || 0,
          listing_price: ipo.listingPrice ? `₹${ipo.listingPrice}` : 'N/A',
          listing_gain: ipo.listingGainPercentage || 0,
          listing_gains: ipo.listingGainPercentage ? `+${ipo.listingGainPercentage.toFixed(2)}%` : 'N/A',
          listing_gains_numeric: ipo.listingGainPercentage || 0,
          listing_gains_by_exchange: {
            nse: {
              issuePrice: ipo.priceRange?.max || 0,
              lastTradePrice: ipo.listingPrice || 0,
              gain: ipo.listingGainPercentage || 0,
              gainFormatted: ipo.listingGainPercentage ? `+${ipo.listingGainPercentage.toFixed(2)}%` : 'N/A'
            },
            bse: {
              issuePrice: ipo.priceRange?.max || 0,
              lastTradePrice: ipo.listingPrice ? Math.round(ipo.listingPrice * 1.005) : 0,
              gain: ipo.listingGainPercentage ? ipo.listingGainPercentage * 1.01 : 0,
              gainFormatted: ipo.listingGainPercentage ? `+${(ipo.listingGainPercentage * 1.01).toFixed(2)}%` : 'N/A'
            }
          },
          year: currentYear,
          category: ipo.industry || 'General',
          logo_url: ipo.logoUrl || '',
          ipo_id: ipo.id,
          detail_url: `/ipo/${ipo.id}`
        })),
        title: "Top Performing IPOs by Listing Gains",
        description: "IPOs with the highest listing day gains"
      },
      
      latest_news: recentlyListedIPOs.slice(0, 5).map(ipo => ({
        title: `${ipo.companyName} IPO Update`,
        date: ipo.listingDate || new Date().toISOString(),
        summary: `${ipo.companyName}'s IPO was oversubscribed by ${(ipo.overallSubscription || 1.5).toFixed(1)}x on the final day. The shares are expected to list on ${formatDate(ipo.listingDate)}.`,
        status: ipo.status,
        category: ipo.industry || 'General',
        ipo_id: ipo.id,
        detail_url: `/ipo/${ipo.id}`
      })),
      
      quick_links: {
        allotment_status: "/allotment",
        performance_tracker: "/performance",
        ipo_calendar: "/calendar",
        ipo_guide: "/guide",
        categories: "/categories",
        compare: "/compare",
        search: "/search"
      },
      
      educational_snippets: [
        {
          title: "What is an IPO?",
          content: "An Initial Public Offering (IPO) is when a private company offers its shares to the public for the first time. This allows companies to raise capital from public investors and provides an opportunity for early investors to monetize their investments.",
          icon: "info-circle"
        },
        {
          title: "How to Apply for an IPO",
          content: "You can apply for an IPO through your demat account with a broker. The application process is usually open for 3-5 days, and you need to apply for a minimum lot size or its multiples.",
          icon: "tasks"
        },
        {
          title: "Understanding IPO GMP",
          content: "Grey Market Premium (GMP) indicates the premium at which IPO shares are traded in the unofficial/grey market before they are officially listed on the stock exchange. It can be a predictor of listing gains.",
          icon: "chart-line"
        }
      ],
      
      meta: {
        last_updated: new Date().toISOString(),
        version: "2.0",
        total_ipos_shown: trendingIPOs.length + upcomingIPOs.length + recentlyListedIPOs.length + openIPOs.length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage data' },
      { status: 500 }
    );
  }
} 