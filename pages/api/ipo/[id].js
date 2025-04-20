import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: "IPO ID is required" });
    }
    
    // First, get the metadata for this IPO
    const metaFilePath = path.join(process.cwd(), 'next-app', 'output', 'all_ipos_meta.json');
    
    // Check if meta file exists
    if (!fs.existsSync(metaFilePath)) {
      console.error(`File not found: ${metaFilePath}`);
      return res.status(404).json({ error: "Metadata file not found" });
    }
    
    const metaData = JSON.parse(fs.readFileSync(metaFilePath, 'utf8'));
    
    const ipoMeta = metaData.find(ipo => ipo.ipo_id === id);
    
    if (!ipoMeta) {
      return res.status(404).json({ error: `IPO with ID ${id} not found` });
    }
    
    let rawData = {};
    
    // If raw data path exists, try to get the detailed data
    if (ipoMeta.raw_data_path) {
      const rawDataPath = path.join(process.cwd(), 'next-app', 'output', ipoMeta.raw_data_path);
      
      if (fs.existsSync(rawDataPath)) {
        rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
      }
    }
    
    // Combine metadata and raw data, with raw data fields taking precedence
    const combinedData = {
      ...ipoMeta,
      ...rawData,
      meta: ipoMeta  // Include original metadata separately
    };
    
    res.status(200).json(combinedData);
  } catch (error) {
    console.error(`Error fetching IPO data for ID ${req.query.id}:`, error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 