# IPO Insights API

This API provides access to comprehensive data about Initial Public Offerings (IPOs).

## API Endpoints

### Meta Endpoints

- **GET `/api/meta`** - Returns metadata for all IPOs with support for filtering, sorting, and pagination.
  - Query parameters:
    - `limit` (default: 50) - Number of results per page
    - `page` (default: 1) - Page number
    - `sort_by` (default: 'year') - Field to sort by
    - `sort_order` (default: 'desc') - Sort order ('asc' or 'desc')
    - `year` - Filter by year
    - `status` - Filter by status (upcoming, open, closed, listed)
    - `search` - Search in ipo_name and company_name
    - `min_gains`, `max_gains` - Filter by listing gains range
    - `listing_at` - Filter by listing exchange

- **GET `/api/ids`** - Returns a list of all IPO IDs with basic information.

- **GET `/api/stats`** - Returns overall statistics about IPOs.

- **GET `/api/years`** - Returns count of IPOs by year.

### Performance Endpoints

- **GET `/api/performance/best`** - Returns data for the best performing IPOs.
  - Query parameters:
    - `limit` (default: 10) - Number of results
    - `page` (default: 1) - Page number
    - `year` - Filter by year

- **GET `/api/performance/worst`** - Returns data for the worst performing IPOs.
  - Same query parameters as for best performers.

### IPO Details

- **GET `/api/ipo/[id]`** - Returns detailed information for a specific IPO.
  - Path parameter:
    - `id` - IPO ID

- **GET `/api/raw/ipo/[id]`** - Returns raw data for a specific IPO.
  - Path parameter:
    - `id` - IPO ID

### Raw Data Access

- **GET `/api/raw/year/[year]`** - Returns a list of available raw IPO data files for the specified year.
  - Path parameter:
    - `year` - 4-digit year (e.g., 2023)

### Status Endpoints

- **GET `/api/status/upcoming`** - Returns upcoming IPOs, sorted by opening date.

- **GET `/api/status/open`** - Returns currently open IPOs, sorted by closing date.

- **GET `/api/status/closed`** - Returns closed IPOs with pagination.
  - Query parameters:
    - `limit` (default: 10) - Number of results
    - `page` (default: 1) - Page number
    - `year` - Filter by year

- **GET `/api/status/listed`** - Returns listed IPOs with extensive filtering options.
  - Query parameters:
    - `limit` (default: 10) - Number of results
    - `page` (default: 1) - Page number
    - `year` - Filter by year
    - `sort_by` (default: 'listing_date') - Field to sort by
    - `sort_order` (default: 'desc') - Sort order
    - `min_listing_gains`, `max_listing_gains` - Filter by listing gains range
    - `listing_at` - Filter by listing exchange

### Search API

- **GET `/api/search`** - Comprehensive search across all IPOs with multiple filtering options.
  - Query parameters:
    - `q` - General search term (searches in name, company name, and ID)
    - `limit` (default: 20) - Number of results
    - `page` (default: 1) - Page number
    - `sort_by` (default: 'year') - Field to sort by
    - `sort_order` (default: 'desc') - Sort order
    - `year` - Filter by year
    - `status` - Filter by status
    - `min_price`, `max_price` - Filter by issue price range
    - `min_gains`, `max_gains` - Filter by listing gains range
    - `listing_at` - Filter by listing exchange
    - `from_date`, `to_date` - Filter by date range (using opening date)
    - `type` - Filter by issue type (e.g., "Fixed Price IPO")

## Response Format

All endpoints return data in JSON format. For paginated endpoints, the response includes:

```json
{
  "total": 1359,         // Total number of results
  "page": 1,             // Current page
  "limit": 10,           // Results per page
  "total_pages": 136,    // Total number of pages
  "data": [...]          // Result data array
}
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the API at `http://localhost:3000/api/...` 