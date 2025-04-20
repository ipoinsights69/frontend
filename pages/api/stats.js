import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read the data file
    const dataFilePath = path.join(process.cwd(), 'next-app', 'output', 'stats.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return res.status(404).json({ error: "Data file not found" });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching stats data:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 