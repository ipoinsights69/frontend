import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const { year } = req.query;
    
    // Validate year
    if (!year || !/^\d{4}$/.test(year)) {
      return res.status(400).json({ error: "Invalid year format. Please provide a 4-digit year." });
    }
    
    // Construct the directory path
    const dirPath = path.join(process.cwd(), 'next-app', 'output', 'raw', year);
    
    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      return res.status(404).json({ error: `No data available for year ${year}` });
    }
    
    // Read the directory
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(file => file.isFile() && file.name.endsWith('.json'))
      .map(file => {
        const filePath = path.join(dirPath, file.name);
        const stats = fs.statSync(filePath);
        
        return {
          filename: file.name,
          ipo_id: file.name.replace('.json', ''),
          size: stats.size,
          last_modified: stats.mtime
        };
      });
    
    res.status(200).json(files);
  } catch (error) {
    console.error(`Error fetching raw data for year ${req.query.year}:`, error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 