import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read the data file
    const dataFilePath = path.join(process.cwd(), 'next-app', 'output', 'status', 'open.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return res.status(404).json({ error: "Data file not found" });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Sort by closing date (ascending) so earliest closing dates come first
    data.sort((a, b) => {
      const dateA = a.closing_date ? new Date(a.closing_date) : new Date();
      const dateB = b.closing_date ? new Date(b.closing_date) : new Date();
      return dateA - dateB;
    });
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching open IPOs data:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 