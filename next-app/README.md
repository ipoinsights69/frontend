# IPO Insights

A comprehensive platform for IPO data analysis and visualization.

## API Endpoints

The API is built using Next.js App Router API routes with endpoints structured as follows:

### Basic Endpoints

- **GET `/api/meta`** - Returns metadata for all IPOs with support for filtering, sorting, and pagination
- **GET `/api/ids`** - Returns a list of all IPO IDs
- **GET `/api/stats`** - Returns overall statistics about IPOs
- **GET `/api/years`** - Returns count of IPOs by year
- **GET `/api/stats/year/[year]`** - Returns detailed statistics for a specific year

### Performance Endpoints

- **GET `/api/performance/best`** - Returns data for the best performing IPOs
- **GET `/api/performance/worst`** - Returns data for the worst performing IPOs

### IPO Details

- **GET `/api/ipo/[id]`** - Returns detailed information for a specific IPO
- **GET `/api/compare`** - Compares multiple IPOs by their IDs (use `?ids=id1,id2,id3`)

### Status Endpoints

- **GET `/api/status/listed`** - Returns listed IPOs with pagination and filtering
- **GET `/api/upcoming`** - Returns upcoming IPOs sorted by opening date
- **GET `/api/status/open`** - Returns currently open IPOs (Coming soon)
- **GET `/api/status/closed`** - Returns closed IPOs (Coming soon)

### Search Endpoint

- **GET `/api/search`** - Comprehensive search for IPOs with advanced filtering and pagination
  - Query parameters:
    - `q` - Search term to match against IPO name, company name or ID
    - `limit` (default: 10) - Number of results per page
    - `page` (default: 1) - Page number
    - `sort_by` (default: 'ipo_name') - Field to sort by
    - `sort_order` (default: 'asc') - Sort order ('asc' or 'desc')
    - `year` - Filter by year 
    - `status` - Filter by status

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Example API Usage

### Using curl

```bash
# Get all IPO years
curl "http://localhost:3000/api/years"

# Get metadata with filtering and pagination
curl "http://localhost:3000/api/meta?limit=5&page=1&year=2023"

# Get specific IPO details
curl "http://localhost:3000/api/ipo/tata_technologies_limited_ipo"

# Get best performing IPOs
curl "http://localhost:3000/api/performance/best?limit=10"

# Search for IPOs
curl "http://localhost:3000/api/search?q=technologies&limit=5"

# Compare multiple IPOs
curl "http://localhost:3000/api/compare?ids=tata_technologies_limited_ipo,irctc_limited_ipo"

# Get year-specific statistics
curl "http://localhost:3000/api/stats/year/2023"
```

### Using Fetch API (JavaScript)

```