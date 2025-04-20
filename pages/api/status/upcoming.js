import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read the data file
    const dataFilePath = path.join(process.cwd(), 'next-app', 'output', 'status', 'upcoming.json');
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Sort by opening date (ascending) so earliest opening dates come first
    data.sort((a, b) => {
      const dateA = a.opening_date ? new Date(a.opening_date) : new Date();
      const dateB = b.opening_date ? new Date(b.opening_date) : new Date();
      return dateA - dateB;
    });
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching upcoming IPOs data:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 