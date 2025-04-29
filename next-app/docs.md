# IPO Insights - Technical Documentation

This documentation provides a comprehensive overview of all components, pages, and their relationships within the IPO Insights application.

## Table of Contents
1. [Page Structure](#page-structure)
2. [Components](#components)
3. [Data Flow](#data-flow)
4. [API Routes](#api-routes)
5. [Libraries and Utilities](#libraries-and-utilities)

## Page Structure

### Home Page
- **Path**: `/`
- **File**: `src/app/page.tsx`
- **Description**: Landing page that showcases various IPO categories and statistics
- **Components Used**:
  - `HeroSection`
  - `HomeIPOShowcase`
  - `IPOStats`
  - `Header`
  - `Footer`

### IPO Detail Page
- **Path**: `/ipo/[id]`
- **File**: `src/app/ipo/[id]/page.tsx` (Server Component)
- **Client Component**: `src/app/ipo/[id]/IPODetailClientPage.tsx`
- **Description**: Displays comprehensive information about a specific IPO
- **Components Used**:
  - `IPOHero` (`src/app/components/IPODetail/IPOHero.tsx`)
  - `IPOTabs` (`src/app/components/IPODetail/IPOTabs.tsx`)
  - `RelatedIPOs` (`src/app/components/IPODetail/RelatedIPOs.tsx`)
  - Various tab components in `src/app/components/IPODetail/tabs/`

### IPO Allotment Status Page
- **Path**: `/ipo/[id]/allotment`
- **File**: `src/app/ipo/[id]/allotment/page.tsx`
- **Description**: Allows users to check their IPO allotment status using different methods
- **Components Used**:
  - `AllotmentForm` (`src/app/ipo/[id]/allotment/components/AllotmentForm.tsx`)
  - `IPOTimeline` (`src/app/ipo/[id]/allotment/components/IPOTimeline.tsx`)
  - `Header`
  - `Footer`

### About Page
- **Path**: `/about`
- **File**: `src/app/about/page.tsx`
- **Description**: Information about the IPO Insights platform and its features

### Data Pages
- **Path**: `/data/[category]`
- **File**: `src/app/data/[category]/page.tsx`
- **Description**: Pages that display IPOs categorized by different metrics
- **Categories**:
  - upcoming
  - open
  - listed
  - best-performing
  - worst-performing

## Components

### Layout Components

#### Header
- **Path**: `src/app/components/Header.tsx`
- **Usage**: Global navigation component
- **Features**:
  - Navigation links
  - Search functionality
  - Mobile-responsive menu

#### Footer
- **Path**: `src/app/components/Footer.tsx`
- **Usage**: Global footer component
- **Features**:
  - Quick links
  - Contact information
  - Copyright details

### Home Page Components

#### HeroSection
- **Path**: `src/app/components/HeroSection.tsx`
- **Usage**: Main banner on the homepage
- **Features**:
  - Highlights featured IPOs
  - Call-to-action buttons
  - Quick access to IPO tools

#### HomeIPOShowcase
- **Path**: `src/app/components/HomeIPOShowcase.tsx`
- **Usage**: Displays multiple IPO categories on the homepage
- **Features**:
  - Tabbed interface for upcoming, recent, best-performing IPOs
  - IPO cards with key information

#### IPOStats
- **Path**: `src/app/components/IPOStats.tsx`
- **Usage**: Shows IPO market statistics
- **Features**:
  - Total IPO count
  - Breakdown by status
  - Best and worst performers

### IPO Detail Components

#### IPOHero
- **Path**: `src/app/components/IPODetail/IPOHero.tsx`
- **Usage**: Hero section for the IPO detail page
- **Features**:
  - Company logo/placeholder
  - Key IPO metrics
  - Status indicator
  - Timeline for upcoming events

#### IPOTabs
- **Path**: `src/app/components/IPODetail/IPOTabs.tsx`
- **Usage**: Tabbed interface for IPO details
- **Features**:
  - Overview tab
  - Financials tab
  - Subscription tab
  - Listing performance tab
  - FAQ tab

#### RelatedIPOs
- **Path**: `src/app/components/IPODetail/RelatedIPOs.tsx`
- **Usage**: Displays IPOs related to the current one
- **Features**:
  - Similar IPOs by sector or timing
  - IPO cards with key information

#### Tab Components
- **Path**: `src/app/components/IPODetail/tabs/`
- **Components**:
  - `OverviewTab.tsx`: Company information and business segments
  - `FinancialsTab.tsx`: Financial performance metrics
  - `SubscriptionTab.tsx`: Subscription rates by category
  - `ListingTab.tsx`: Listing day performance
  - `FAQTab.tsx`: Frequently asked questions

### IPO Allotment Components

#### AllotmentForm
- **Path**: `src/app/ipo/[id]/allotment/components/AllotmentForm.tsx`
- **Usage**: Form for checking IPO allotment status
- **Features**:
  - Multiple verification methods (PAN, Application Number, Demat)
  - Form validation
  - Results display
  - Error handling

#### IPOTimeline
- **Path**: `src/app/ipo/[id]/allotment/components/IPOTimeline.tsx`
- **Usage**: Visual timeline of IPO dates
- **Features**:
  - Important dates display
  - Current status indicator
  - Progress tracking

### Utility Components

#### IPOCard
- **Path**: `src/app/components/IPOCard.tsx`
- **Usage**: Reusable card component for displaying IPO summary
- **Features**:
  - Company logo/initial display
  - Key metrics
  - Status indicator
  - Used in multiple places throughout the application

#### IconPlaceholder
- **Path**: `src/components/IconPlaceholder.tsx`
- **Usage**: Simple icon placeholder using emojis
- **Features**:
  - Maps icon names to emoji characters
  - Used in IPO detail page and allotment page
  - Customizable size and styling

#### Badge
- **Path**: `src/app/components/ui/badge.tsx`
- **Usage**: Status indicator badge component
- **Features**:
  - Various color schemes for different statuses
  - Used in IPO cards and detail pages

## Data Flow

### IPO Data Retrieval
1. **Server Component Initialization**:
   - Page component (e.g., `src/app/ipo/[id]/page.tsx`) is requested
   - Server fetches data using `fetchDetailedIPOById` function from `src/app/api/ipos/handlers.ts`

2. **Client Component Hydration**:
   - Data is passed to client components (e.g., `IPODetailClientPage.tsx`)
   - Client components render UI based on the provided data

3. **API-based Data Retrieval**:
   - Allotment status checking uses API route `/api/ipo/allotment`
   - Form in `AllotmentForm.tsx` submits data to the API
   - API returns allotment status which is displayed to the user

### Data Services

#### ipoDataService.ts
- **Path**: `src/lib/ipoDataService.ts`
- **Usage**: Handles aggregate operations and metadata retrieval
- **Key Functions**:
  - `getTrendingIPOs()`: Fetches best-performing IPOs
  - `getUpcomingIPOs()`: Fetches upcoming IPOs
  - `getRecentlyListedIPOs()`: Fetches recently listed IPOs
  - `getClosedIPOs()`: Fetches IPOs closed but not yet listed
  - `getIPOStats()`: Gets overall IPO market statistics

#### ipoDetailService.ts
- **Path**: `src/lib/ipoDetailService.ts`
- **Usage**: Handles detailed IPO information retrieval
- **Key Functions**:
  - `getIPOById(id)`: Fetches complete detailed information for a specific IPO
  - `getRelatedIPOs(id)`: Finds IPOs related to the specified IPO
  - `getAllIPOIds()`: Gets a list of all IPO IDs for generating static paths

## API Routes

### Allotment Status API
- **Path**: `/api/ipo/allotment`
- **File**: `src/app/api/ipo/allotment/route.ts`
- **HTTP Methods**: GET
- **Parameters**:
  - `ipoId`: ID of the IPO
  - `method`: Verification method ('pan', 'application', 'demat')
  - `value`: Value for the verification method
  - `dpId`, `clientId`: Required for 'demat' method
- **Response**: Allotment status result with details if found

## Libraries and Utilities

### Date Utilities
- **Path**: `src/app/utils/dateUtils.ts`
- **Usage**: Functions for formatting and manipulating dates
- **Key Functions**:
  - `formatDate(date)`: Formats dates for display
  - `getDateDifference(date1, date2)`: Calculates difference between dates

### Number Utilities
- **Path**: `src/app/utils/numberUtils.ts`
- **Usage**: Functions for formatting numbers and currency
- **Key Functions**:
  - `formatCurrency(value)`: Formats numbers as Indian currency
  - `formatNumber(value)`: Formats large numbers with commas

## Integration Points

### Data Files Integration
The application reads data from JSON files in the `/output` directory:
- `all_ipos_meta.json`: Summary information for all IPOs
- `stats.json`: Overall statistics about the IPO market
- `status/*.json`: IPOs categorized by status
- `performance/*.json`: IPOs categorized by performance
- `raw/YYYY/*.json`: Detailed data files for each IPO 

#### API Handlers
- **Path**: `src/app/api/ipos/handlers.ts`
- Provides API functions for retrieving IPO data
- Key functions:
  - `fetchTrendingIPOs()`: Returns best-performing IPOs
  - `fetchUpcomingIPOs()`: Returns upcoming IPOs
  - `fetchRecentlyListedIPOs()`: Returns recently listed IPOs
  - `fetchDetailedIPOById(id)`: Returns detailed information for a specific IPO
  - `fetchRelatedIPOs(id)`: Returns IPOs related to the specified IPO
  - Many other data fetching utilities

#### Types
- **Path**: `src/app/types/IPO.ts`
- Contains type definitions for IPO data structures
- Main types:
  - `IPO`: Basic IPO interface
  - `IPODetailedData`: Extended interface for detailed IPO information
  - `IPOStats`: Interface for IPO market statistics 