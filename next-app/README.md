# IPO Insights

A comprehensive Next.js application for tracking, analyzing, and exploring Initial Public Offerings (IPOs) in the Indian stock market.

## Project Overview

IPO Insights provides real-time data and detailed analytics on IPOs across various categories:
- Upcoming IPOs
- Open IPOs 
- Recently Listed IPOs
- Trending IPOs (Best Performers)
- Historical IPO Performance Data

The application offers in-depth information about each IPO, including subscription rates, financial data, company background, listing performance, and more.

## Project Structure

```
next-app/
├── src/
│   ├── app/                     # Next.js app directory
│   │   ├── components/          # UI components
│   │   ├── ipo/                 # IPO detail pages
│   │   ├── about/               # About page
│   │   ├── data/                # Data related pages
│   │   ├── page.tsx             # Homepage
│   │   └── layout.tsx           # Root layout
│   └── lib/                     # Core services and utilities
│       ├── ipoDataService.ts    # Service for fetching IPO metadata
│       └── ipoDetailService.ts  # Service for fetching detailed IPO information
├── output/                      # Generated data files
│   ├── all_ipos_meta.json       # Consolidated IPO metadata
│   ├── stats.json               # Overall IPO statistics
│   ├── years.json               # IPO data by years
│   ├── ipo_ids.json             # List of all IPO IDs
│   ├── performance/             # Performance-related data
│   ├── status/                  # Status-related data (upcoming, listed, etc.)
│   └── raw/                     # Raw IPO data files organized by year
├── public/                      # Static assets
└── package.json                 # Project dependencies
```

## Data Schema

### IPO Summary (Basic Metadata)

```typescript
interface IPOSummary {
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
```

### IPO Detailed Data

The detailed IPO schema is comprehensive and includes:

- Basic Details (company name, IPO name, status, etc.)
- Financial Information (assets, revenue, profit, etc.)
- Subscription Details (overall, retail, NII, QIB, etc.)
- Listing Performance (listing price, gains, day data, etc.)
- Company Information (about, business segments, promoters, etc.)
- Important Dates (open, close, allotment, listing, etc.)
- Contact Information (address, phone, email, website)
- Prospectus Links
- FAQs
- Recommendation Summaries
- And more...

## Database Schema

The application currently uses a file-based data storage system, with all IPO data stored in JSON format within the `output` directory. This functions as our database, with organized files serving specific data retrieval needs.

### Data Organization

```
output/
├── all_ipos_meta.json       # Primary database for all IPO summary data
├── stats.json               # Statistical aggregations of IPO data
├── years.json               # Available years for filtering
├── ipo_ids.json             # List of all unique identifiers
├── performance/             # Performance-categorized data
│   ├── best.json            # Top performing IPOs
│   └── worst.json           # Worst performing IPOs
├── status/                  # Status-categorized data
│   ├── upcoming.json        # Upcoming IPOs
│   ├── open.json            # Currently open IPOs
│   ├── closed.json          # Closed but not yet listed IPOs
│   └── listed.json          # Listed IPOs
└── raw/                     # Complete IPO data organized by year
    ├── 2017/                # Year-specific directories
    ├── 2018/
    ├── ...
    └── 2024/
```

### Database Schema Details

#### Primary IPO Data (Raw Data Files)

Each individual IPO record in the `output/raw/YYYY/` directory contains the complete detailed information about a specific IPO. The schema is extensive:

```typescript
interface IPODetailedData {
  // Basic Identifiers
  ipo_id: string;
  original_ipo_id: string;
  company_name: string;
  ipo_name: string;
  year: number;
  status: 'upcoming' | 'open' | 'closed' | 'listed' | 'unknown';
  
  // Issue Details
  issue_price?: string;
  issue_price_numeric?: number;
  face_value?: string;
  face_value_numeric?: number;
  issue_size?: string;
  issue_size_numeric?: number;
  fresh_issue?: string;
  offer_for_sale?: string;
  issue_type?: string;
  lot_size?: number;
  minimum_amount_string?: string;
  minimum_amount?: number;
  
  // Listing Information
  listing_at?: string;
  listing_price?: string;
  listing_price_open?: string;
  listing_price_high?: string;
  listing_price_low?: string;
  listing_price_last?: string;
  listing_gains?: string;
  listing_gains_numeric?: number;
  
  // Important Dates
  opening_date?: string;
  closing_date?: string;
  allotment_date?: string;
  refund_date?: string;
  credit_of_shares?: string;
  listing_date?: string;
  
  // Subscription Details
  overall_subscription?: string;
  overall_subscription_numeric?: number;
  retail_subscription?: string;
  retail_subscription_numeric?: number;
  nii_subscription?: string;
  nii_subscription_numeric?: number;
  qib_subscription?: string;
  qib_subscription_numeric?: number;
  total_applications?: number;
  
  // Company Information
  promoter_holding_pre?: number;
  promoter_holding_post?: number;
  logo_url?: string;
  market_maker?: string;
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
  
  // Contact & Registration
  registrar_name?: string;
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  
  // Financial Data
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
  
  // Detailed Subscription Data
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
  
  // Detailed Listing Performance
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
  
  // Additional Details
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
  
  // Documentation & Resources
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
  
  // Feature Flags
  hasOverview: boolean;
  hasFinancials: boolean;
  hasSubscription: boolean;
  hasListingPerformance: boolean;
  hasDetails: boolean;
}
```

#### Aggregate Data Collections

**all_ipos_meta.json**: Contains summary information for all IPOs with the following structure:

```typescript
type IPOSummaryCollection = Array<{
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
}>;
```

**stats.json**: Contains aggregate statistics about the IPO market:

```typescript
interface IPOStats {
  totalCount: number;
  byStatus: {
    upcoming: number;
    open: number;
    closed: number;
    listed: number;
    unknown: number;
  };
  bestPerformer: {
    ipo_id: string;
    company_name: string;
    listing_gains_numeric: number;
  };
  worstPerformer: {
    ipo_id: string;
    company_name: string;
    listing_gains_numeric: number;
  };
}
```

**Categorized Collections**: Files like `performance/best.json` or `status/upcoming.json` contain subsets of the IPO summary data, filtered by specific criteria.

### Data Access Layer

The application's data access is managed through two core services:

1. **ipoDataService.ts**: Handles aggregate operations and metadata retrieval
2. **ipoDetailService.ts**: Manages detailed IPO information retrieval

These services abstract the file-based nature of the database, providing an interface similar to traditional database queries.

## Core Services

### IPODataService (src/lib/ipoDataService.ts)

This service handles fetching and processing IPO metadata and summary information:

- `getTrendingIPOs()`: Fetches best-performing IPOs
- `getUpcomingIPOs()`: Fetches upcoming IPOs
- `getRecentlyListedIPOs()`: Fetches recently listed IPOs
- `getClosedIPOs()`: Fetches IPOs that have closed but not yet listed
- `getIPOStats()`: Gets overall IPO market statistics
- `getTopPerformingIPOs()`: Gets top IPOs by listing gains
- `getTopLosingIPOs()`: Gets worst-performing IPOs by listing losses

### IPODetailService (src/lib/ipoDetailService.ts)

This service handles fetching and processing detailed IPO information:

- `getIPOById(id)`: Fetches complete detailed information for a specific IPO
- `getRelatedIPOs(id)`: Finds IPOs related to the specified IPO
- `getAllIPOIds()`: Gets a list of all IPO IDs for generating static paths

## Feature: IPO Allotment Status Checking

The application includes a comprehensive IPO allotment status checking feature that allows users to verify whether they have been allotted shares in an IPO they applied for.

### Components

The allotment status feature consists of the following components:

- `AllotmentPage`: The main page component that loads the IPO data and renders the form and help components
- `AllotmentForm`: A form component that allows users to check their allotment status using three different methods:
  - Application Number
  - PAN
  - Demat Account (DP ID & Client ID)
- `AllotmentHelp`: A component that provides detailed instructions on how to find and use each identification method

### File Structure

```
src/app/ipo/[id]/allotment/
├── page.tsx                  # Main allotment page component
└── components/               # Allotment-related components
    ├── AllotmentForm.tsx     # Form for checking allotment status
    └── AllotmentHelp.tsx     # Help guide for finding application details
```

### Data Flow

1. User navigates to an IPO's allotment page (`/ipo/[id]/allotment`)
2. The page fetches the IPO data using the `fetchIPOById()` function
3. User enters their details (application number, PAN, or demat account)
4. On submission, the form sends the data to the backend (currently mocked for development)
5. Results are displayed showing whether shares were allotted and related details

### Allotment Results Schema

The allotment results include comprehensive information:

```typescript
interface AllotmentResult {
  status: 'success' | 'not_found';
  name?: string;
  applicationNumber?: string;
  pan?: string;
  category?: string;
  bidDetails?: Array<{
    bidPrice: number;
    quantity: number;
    allotted: number;
  }>;
  accountDebit?: string;
  refundAmount?: string;
  refundDate?: string;
  sharesCredit?: {
    date: string;
    quantity: number;
    depositoryParticipant: string;
  };
}
```

### Feature Roadmap

- Integrate with actual registrar APIs to fetch real allotment data
- Add SMS notifications for allotment status
- Implement allotment analytics to show success rates by category and lot size
- Add ability to track multiple applications across different IPOs

## UI Components

The application has several key components:

- `HeroSection`: Main showcase on the homepage
- `HomeIPOShowcase`: Displays various IPO categories on the homepage
- `IPOCard`: Card component for displaying IPO summary information
- `IPOStats`: Displays statistical information about IPOs
- `IPOTimeline`: Shows IPO timeline with important dates
- `IPOTabs`: Tabbed interface for categorizing IPOs
- `Header` & `Footer`: Application navigation and information

## Data Files

The application uses JSON files in the `output` directory to store and organize IPO data:

### stats.json

Overall statistics about the IPO market:

```json
{
  "totalCount": 1359,
  "byStatus": {
    "upcoming": 1,
    "open": 0,
    "closed": 0,
    "listed": 1358,
    "unknown": 0
  },
  "bestPerformer": {},
  "worstPerformer": {}
}
```

### years.json

List of years for which IPO data is available:

```json
[
  2017,
  2018,
  2019,
  2020,
  2021,
  2022,
  2023,
  2024,
  2025
]
```

### ipo_ids.json

List of all IPO IDs used for routing and data retrieval:

```json
[
  "2017_Apollo_Micro_Systems_Limited_IPO",
  "2017_Amber_Enterprises_India_Limited_IPO",
  "2017_Astron_Paper_and_Board_Mill_Limited_IPO",
  ...
]
```

### all_ipos_meta.json

Contains summary information for all IPOs, with each entry following this structure:

```json
[
  {
    "ipo_id": "2024_bajaj_housing_finance_limited_ipo",
    "original_ipo_id": "2024_bajaj_housing_finance_limited_ipo",
    "ipo_name": "Bajaj Housing Finance Limited IPO",
    "company_name": "Bajaj Housing Finance Limited",
    "year": 2024,
    "status": "listed",
    "opening_date": "2024-09-09T00:00:00.000Z",
    "closing_date": "2024-09-10T18:30:00.000Z",
    "listing_date": "2024-09-16T00:00:00.000Z",
    "issue_price": "₹70.00",
    "issue_price_numeric": 70,
    "issue_size": "93,71,42,858 shares (aggregating up to ₹6,560.00 Cr)",
    "issue_size_numeric": 6560,
    "listing_gains": "22.86%",
    "listing_gains_numeric": 22.86,
    "logo_url": "https://example.com/logos/bajaj.png"
  },
  ...
]
```

### output/performance/

Contains categorized IPO data based on performance metrics:

#### best.json 

Top performing IPOs by listing gains:

```json
[
  {
    "ipo_id": "2023_ideaforge_technology_limited_ipo",
    "ipo_name": "Ideaforge Technology Limited IPO",
    "company_name": "Ideaforge Technology Limited",
    "listing_gains": "93.4%",
    "listing_gains_numeric": 93.4,
    "year": 2023
  },
  ...
]
```

#### worst.json

Worst performing IPOs by listing losses:

```json
[
  {
    "ipo_id": "2022_delhivery_limited_ipo",
    "ipo_name": "Delhivery Limited IPO",
    "company_name": "Delhivery Limited",
    "listing_gains": "-9.8%",
    "listing_gains_numeric": -9.8,
    "year": 2022
  },
  ...
]
```

### output/status/

Contains IPOs categorized by their current status:

#### upcoming.json

```json
[
  {
    "ipo_id": "2025_swiggy_limited_ipo",
    "ipo_name": "Swiggy Limited IPO",
    "company_name": "Swiggy Limited",
    "year": 2025,
    "status": "upcoming",
    "opening_date": "2025-01-15T00:00:00.000Z",
    "closing_date": "2025-01-18T18:30:00.000Z"
  },
  ...
]
```

#### listed.json, closed.json, open.json

Follow similar structure with relevant status values.

### output/raw/YYYY/

Contains detailed data files for each IPO organized by year. Each file follows a comprehensive structure that includes all aspects of an IPO:

Example file: `output/raw/2024/bajaj_housing_finance_limited_ipo.json`

```json
{
  "_id": "680249fb3ccffd1c7912c718",
  "ipo_id": "2024_bajaj_housing_finance_limited_ipo",
  "__v": 0,
  "_metadata": {
    "sectionsAvailable": {
      "basicDetails": true,
      "tentativeSchedule": true,
      "lotSize": true,
      "timeline": false,
      "kpi": true,
      "financials": true,
      "promoterHolding": true,
      "objectives": false,
      "about": true,
      "subscriptionStatus": true,
      "contactDetails": true,
      "registrarDetails": true,
      "leadManagers": true,
      "listingDetails": true,
      "listingDayTrading": true,
      "faqs": true,
      "recommendationSummary": true,
      "prospectusLinks": true,
      "reservation": true,
      "anchorInvestors": true
    },
    "scrapedAt": "2025-04-18T12:22:32.698Z",
    "sourceUrl": "https://www.chittorgarh.com/ipo/bajaj-housing-finance-ipo/1822/"
  },
  "about": {
    "details": "<p>Founded in 2008, Bajaj Housing Finance is a non-deposit-taking Housing Finance Company (HFC) registered with the National Housing Bank (NHB) since 2015 and has been offering mortgage loans since the financial year 2018.</p>\n<p>The company is part of the Bajaj Group...</p>"
  },
  "additionalTables": [
    {
      "heading": "Bajaj Housing Finance Limited Financial Information (Restated)",
      "sanitizedHeading": "financials",
      "headers": ["Period Ended", "30 Jun 2024", "31 Mar 2024", "31 Mar 2023", "31 Mar 2022"],
      "rows": [
        ["Assets", "88538.83", "81827.09", "64654.14", "48527.08"],
        ["Revenue", "2208.73", "7617.71", "5665.44", "3767.13"],
        ["Profit After Tax", "482.61", "1731.22", "1257.8", "709.62"],
        ["Net Worth", "14719.91", "12233.5", "10503.19", "6741.36"],
        ["Reserves and Surplus", "4252.83", "5520.81", "3791.03", "1858.03"],
        ["Total Borrowing", "73347.06", "69129.32", "53745.39", "41492.32"]
      ]
    },
    {
      "heading": "Bajaj Housing Finance Ltd Stock Quote & Charts",
      "sanitizedHeading": "bajaj_housing_finance_stock_quote_charts",
      "headers": ["KPI", "Values"],
      "rows": [
        ["Debt/Equity", "5.70"],
        ["RoNW", "3.6%"],
        ["Price to Book Value", "3.72"]
      ]
    }
  ],
  "anchorInvestors": {
    "summary": "Bajaj Housing Finance IPO raises Rs 1758.00 crore from anchor investors...",
    "list_link": {
      "text": "Bajaj Housing Finance IPO Anchor Investors list",
      "url": "https://www.chittorgarh.net/reports/anchor-investor/bajaj-housing-finance-anchor-allocation.pdf"
    },
    "details": {
      "ipo_date": "December 11 2024",
      "shares_offered": "251142856",
      "anchor_portion_size": "1758.00"
    }
  },
  "basicDetails": {
    "ipoDate": "September 9, 2024 to September 11, 2024",
    "ipoListingDate": "Mon, Sep 16, 2024",
    "faceValue": "₹10 per share",
    "issuePrice": "₹70.00",
    "lotSize": "214 Shares",
    "issueSize": "93,71,42,858 shares (aggregating up to ₹6,560.00 Cr)",
    "freshIssue": "50,85,71,429 shares (aggregating up to ₹3,560.00 Cr)",
    "offerForSale": "42,85,71,429 shares of ₹10 (aggregating up to ₹3,000.00 Cr)",
    "issueType": "Bookbuilding IPO",
    "listingAt": "BSE, NSE",
    "ipoOpenDate": "Mon, Sep 9, 2024",
    "ipoCloseDate": "Wed, Sep 11, 2024",
    "initiationOfRefunds": "Fri, Sep 13, 2024",
    "creditOfSharesToDemat": "Fri, Sep 13, 2024",
    "shareHoldingPreIssue": "7,81,95,75,273 shares",
    "shareHoldingPostIssue": "8,32,81,46,702 shares"
  },
  "contactDetails": {
    "phone": "+91 20 7187806",
    "email": "bhflinvestor.service@bajajfinserv.in",
    "full_address": "Bajaj Housing Finance Limited, Bajaj Auto Limited Complex, Mumbai-Pune Road, Akurdi Pune - 411035",
    "website": "https://www.bajajhousingfinance.in/"
  },
  "faqs": [
    {
      "question": "What is the Bajaj Housing Finance IPO?",
      "answer": "<div itemprop=\"text\"><p>Bajaj Housing Finance IPO is a main-board IPO of 937142858 equity shares...</p></div>"
    },
    {
      "question": "How to apply in Bajaj Housing Finance IPO through Zerodha?",
      "answer": "<div itemprop=\"text\"><p>Zerodha customers can apply online in Bajaj Housing Finance IPO using UPI as a payment gateway...</p></div>"
    }
  ],
  "financials": {
    "data": [
      {
        "period": "Q1 FY25",
        "assets": 88538.83,
        "revenue": 2208.73,
        "profit": 482.61,
        "net_worth": 14719.91
      },
      {
        "period": "FY24",
        "assets": 81827.09,
        "revenue": 7617.71,
        "profit": 1731.22,
        "net_worth": 12233.5
      }
    ],
    "ratios": {
      "roe": 14.15,
      "roce": 11.98,
      "pat_margin": 22.73,
      "debt_equity": 5.7
    },
    "eps": {
      "pre": 2.21,
      "post": 2.32,
      "pe_pre": 31.62,
      "pe_post": 30.2
    }
  },
  "listing_performance": {
    "listing_date": "2024-09-16T00:00:00.000Z",
    "issue_price": 70,
    "listing_price": 86,
    "listing_gain": 22.86,
    "day_high": 92.5,
    "day_low": 85.2,
    "closing_price": 88.6
  },
  "subscription_details": {
    "status": {
      "overall": 8.05,
      "retail": 1.24,
      "nii": 3.09,
      "qib": 13.28
    },
    "day_wise": [
      {
        "day": "Day 1",
        "overall": 0.45,
        "retail": 0.6,
        "nii": 0.42,
        "qib": 0.01
      },
      {
        "day": "Day 2",
        "overall": 2.45,
        "retail": 0.95,
        "nii": 1.52,
        "qib": 3.42
      },
      {
        "day": "Day 3",
        "overall": 8.05,
        "retail": 1.24,
        "nii": 3.09,
        "qib": 13.28
      }
    ]
  }
}
```

## Technologies Used

- **Frontend Framework**: Next.js (React)
- **Styling**: CSS modules/Tailwind CSS
- **Data Storage**: JSON files
- **Data Processing**: Node.js utilities
- **Deployment**: Vercel/Netlify

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build and Deploy

To build for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## License

[MIT](./LICENSE)