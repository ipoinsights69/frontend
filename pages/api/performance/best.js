import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read the data file
    const dataFilePath = path.join(process.cwd(), 'next-app', 'output', 'performance', 'best.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return res.status(404).json({ error: "Data file not found" });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Parse query parameters
    const { limit = 10, page = 1, year } = req.query;
    
    // Apply year filter if provided
    if (year) {
      data = data.filter(item => item.year == parseInt(year));
    }
    
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
    console.error("Error fetching best performance data:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 