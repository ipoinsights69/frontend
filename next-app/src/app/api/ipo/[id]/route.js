import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: "IPO ID is required" }, { status: 400 });
    }
    
    // First, get the metadata for this IPO - adjust path since we're in the same app
    const metaFilePath = path.join(process.cwd(), 'output', 'all_ipos_meta.json');
    
    // Check if meta file exists
    if (!fs.existsSync(metaFilePath)) {
      console.error(`File not found: ${metaFilePath}`);
      return NextResponse.json({ error: "Metadata file not found" }, { status: 404 });
    }
    
    const metaData = JSON.parse(fs.readFileSync(metaFilePath, 'utf8'));
    
    const ipoMeta = metaData.find(ipo => ipo.ipo_id === id);
    
    if (!ipoMeta) {
      return NextResponse.json({ error: `IPO with ID ${id} not found` }, { status: 404 });
    }
    
    let rawData = {};
    
    // If raw data path exists, try to get the detailed data
    if (ipoMeta.raw_data_path) {
      const rawDataPath = path.join(process.cwd(), 'output', ipoMeta.raw_data_path);
      
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
    
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error(`Error fetching IPO data:`, error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
} 