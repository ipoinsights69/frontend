import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read the data file
    const dataFilePath = path.join(process.cwd(), 'next-app', 'output', 'all_ipos_meta.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return res.status(404).json({ error: "Data file not found" });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Parse query parameters
    const { 
      limit = 50,
      page = 1, 
      sort_by = 'year', 
      sort_order = 'desc',
      year,
      status,
      search,
      min_gains,
      max_gains,
      listing_at
    } = req.query;
    
    // Apply filters if provided
    if (year) {
      data = data.filter(item => item.year == parseInt(year));
    }
    
    if (status) {
      data = data.filter(item => item.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(item => 
        (item.ipo_name && item.ipo_name.toLowerCase().includes(searchLower)) || 
        (item.company_name && item.company_name.toLowerCase().includes(searchLower))
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
    
    // Apply sorting
    data.sort((a, b) => {
      let valueA = a[sort_by];
      let valueB = b[sort_by];
      
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
    console.error("Error fetching meta data:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 