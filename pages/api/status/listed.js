import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read the data file
    const dataFilePath = path.join(process.cwd(), 'next-app', 'output', 'status', 'listed.json');
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Parse query parameters
    const { 
      limit = 10, 
      page = 1, 
      year,
      sort_by = 'listing_date',
      sort_order = 'desc',
      min_listing_gains,
      max_listing_gains,
      listing_at
    } = req.query;
    
    // Apply filters if provided
    if (year) {
      data = data.filter(item => item.year == parseInt(year));
    }
    
    if (min_listing_gains) {
      data = data.filter(item => 
        item.listing_gains_numeric && item.listing_gains_numeric >= parseFloat(min_listing_gains)
      );
    }
    
    if (max_listing_gains) {
      data = data.filter(item => 
        item.listing_gains_numeric && item.listing_gains_numeric <= parseFloat(max_listing_gains)
      );
    }
    
    if (listing_at) {
      data = data.filter(item => 
        item.listing_at && item.listing_at.toLowerCase().includes(listing_at.toLowerCase())
      );
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let valueA = a[sort_by];
      let valueB = b[sort_by];
      
      // Handle date strings
      if (sort_by === 'listing_date' || sort_by === 'opening_date' || sort_by === 'closing_date') {
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
    
    // Calculate pagination
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
    console.error("Error fetching listed IPOs data:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 