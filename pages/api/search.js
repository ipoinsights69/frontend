import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read the metadata file
    const dataFilePath = path.join(process.cwd(), 'next-app', 'output', 'all_ipos_meta.json');
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Parse query parameters
    const { 
      q, // general search term
      limit = 20,
      page = 1, 
      sort_by = 'year', 
      sort_order = 'desc',
      year,
      status,
      min_price,
      max_price,
      min_gains,
      max_gains,
      listing_at,
      from_date,
      to_date,
      type // issue type filter (e.g., "Fixed Price IPO", "Book Building IPO")
    } = req.query;
    
    // Apply filters
    if (q) {
      const searchLower = q.toLowerCase();
      data = data.filter(item => 
        (item.ipo_name && item.ipo_name.toLowerCase().includes(searchLower)) || 
        (item.company_name && item.company_name.toLowerCase().includes(searchLower)) ||
        (item.ipo_id && item.ipo_id.toLowerCase().includes(searchLower))
      );
    }
    
    if (year) {
      data = data.filter(item => item.year == parseInt(year));
    }
    
    if (status) {
      data = data.filter(item => item.status === status);
    }
    
    if (min_price) {
      data = data.filter(item => 
        item.issue_price_numeric && item.issue_price_numeric >= parseFloat(min_price)
      );
    }
    
    if (max_price) {
      data = data.filter(item => 
        item.issue_price_numeric && item.issue_price_numeric <= parseFloat(max_price)
      );
    }
    
    if (min_gains) {
      data = data.filter(item => 
        item.listing_gains_numeric && item.listing_gains_numeric >= parseFloat(min_gains)
      );
    }
    
    if (max_gains) {
      data = data.filter(item => 
        item.listing_gains_numeric && item.listing_gains_numeric <= parseFloat(max_gains)
      );
    }
    
    if (listing_at) {
      data = data.filter(item => 
        item.listing_at && item.listing_at.toLowerCase().includes(listing_at.toLowerCase())
      );
    }
    
    if (type) {
      data = data.filter(item => 
        item.issue_type && item.issue_type.toLowerCase().includes(type.toLowerCase())
      );
    }
    
    // Date range filtering
    if (from_date) {
      const fromDateObj = new Date(from_date);
      data = data.filter(item => {
        if (!item.opening_date) return true;
        const itemDate = new Date(item.opening_date);
        return itemDate >= fromDateObj;
      });
    }
    
    if (to_date) {
      const toDateObj = new Date(to_date);
      data = data.filter(item => {
        if (!item.opening_date) return true;
        const itemDate = new Date(item.opening_date);
        return itemDate <= toDateObj;
      });
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let valueA = a[sort_by];
      let valueB = b[sort_by];
      
      // Handle date strings
      if (['opening_date', 'closing_date', 'listing_date'].includes(sort_by)) {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }
      
      // Handle numeric values
      if (typeof valueA === 'string' && !isNaN(valueA)) {
        valueA = parseFloat(valueA);
      }
      if (typeof valueB === 'string' && !isNaN(valueB)) {
        valueB = parseFloat(valueB);
      }
      
      // For strings, use localeCompare
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sort_order === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // For numbers and other types
      return sort_order === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    // Prepare response
    const response = {
      total: data.length,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(data.length / limit),
      data: paginatedData
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in search API:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 