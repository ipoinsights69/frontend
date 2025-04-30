# API Mapping Documentation

This document explains how to use the API mapping system to maintain the connection between backend API responses and frontend components.

## Overview

The API mapping system provides a centralized place to define and manage the relationship between API data and frontend component props. This makes it easier to:

1. Update field mappings when the API structure changes
2. Maintain consistency across multiple components using the same data
3. Document which API fields are used by which components

## File Structure

- `src/app/data/api-mappings.ts` - Main mapping definitions and helper functions

## Current Mappings

### Homepage

API Endpoint: `/api/ipos/homepage`

#### Stats Section
Maps data from `year_summary` and `yearly_stats` to the IPOStats component.

```typescript
// Usage in component
import { mapApiDataToProps, ApiMappings } from '@/app/data/api-mappings';

// Map stats data
const stats = mapApiDataToProps(apiData, ApiMappings.homepage.stats);
```

#### IPO Tables
Maps data for all IPO tables on the homepage:
- Upcoming IPOs
- Open IPOs
- Closed IPOs
- Recently Listed IPOs
- Top Performers

```typescript
// Usage in component
import { mapIpoItems, ApiMappings } from '@/app/data/api-mappings';

// Map IPO data for table with max 5 items
const upcomingIPOs = mapIpoItems(apiData, ApiMappings.homepage.upcomingIPOs, 5);
```

## How to Add New Mappings

### 1. Add a new mapping section to `ApiMappings`

For a new page or component:

```typescript
export const ApiMappings = {
  // Existing mappings...
  
  // Add new page mapping
  newPage: {
    // Component mapping
    componentName: {
      // Define frontend prop to API path mappings
      propName1: 'api.path.to.property1',
      propName2: 'api.path.to.property2',
      // etc.
    }
  }
};
```

### 2. Use the mapping in your component

```typescript
import { mapApiDataToProps, ApiMappings } from '@/app/data/api-mappings';

// In your component
const pageData = mapApiDataToProps(apiData, ApiMappings.newPage.componentName);

// Use in component props
return <YourComponent {...pageData} />;
```

### 3. For IPO list mappings

For any IPO list components:

```typescript
import { mapIpoItems, ApiMappings } from '@/app/data/api-mappings';

// Map IPO data with a limit of 10 items
const ipoList = mapIpoItems(apiData, ApiMappings.newPage.ipoList, 10);

// Use in component
return <IPOTable ipos={ipoList} />;
```

## Best Practices

1. **Keep mappings organized by page** - This makes it easier to find and update mappings.
2. **Document table column labels** - Include the column labels in the mapping for reference.
3. **Add comments for special transformations** - Note any cleaning or transformation logic.
4. **Update mappings when API changes** - Keep mappings in sync with API changes.

## Helper Functions

The API mapping system provides three main helper functions:

### `getValueByPath(obj, path, defaultValue)`
Extracts a value from an object using a dot-notation path string.

### `mapApiDataToProps(apiData, mapping)`
Maps API data to component props using a mapping object.

### `mapIpoItems(apiData, categoryMapping, maxItems)`
Maps IPO items from API data to frontend IPO objects with proper transformations. 