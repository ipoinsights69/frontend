import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: "IPO ID is required" });
    }
    
    // First, let's try to find the IPO in the metadata to get its raw data path
    const metaFilePath = path.join(process.cwd(), 'next-app', 'output', 'all_ipos_meta.json');
    const metaData = JSON.parse(fs.readFileSync(metaFilePath, 'utf8'));
    
    const ipoMeta = metaData.find(ipo => ipo.ipo_id === id);
    
    if (!ipoMeta || !ipoMeta.raw_data_path) {
      return res.status(404).json({ error: `IPO with ID ${id} not found or raw data path is missing` });
    }
    
    // Construct path to raw data file
    const rawDataPath = path.join(process.cwd(), 'next-app', 'output', ipoMeta.raw_data_path);
    
    if (!fs.existsSync(rawDataPath)) {
      return res.status(404).json({ error: `Raw data file not found for IPO ID ${id}` });
    }
    
    // Read and parse the raw data
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
    
    res.status(200).json(rawData);
  } catch (error) {
    console.error(`Error fetching raw data for IPO ID ${req.query.id}:`, error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
} 