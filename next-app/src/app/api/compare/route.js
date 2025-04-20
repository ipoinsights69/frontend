import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json({ 
        error: "IDs parameter is required", 
        message: "Please provide comma-separated IPO IDs to compare"
      }, { status: 400 });
    }
    
    // Split the IDs parameter by commas
    const ipoIds = ids.split(',').map(id => id.trim());
    
    if (ipoIds.length < 1) {
      return NextResponse.json({ 
        error: "No valid IDs provided", 
        message: "Please provide at least one IPO ID to compare"
      }, { status: 400 });
    }
    
    // Read the metadata file
    const metaFilePath = path.join(process.cwd(), 'output', 'all_ipos_meta.json');
    
    // Check if file exists
    if (!fs.existsSync(metaFilePath)) {
      console.error(`File not found: ${metaFilePath}`);
      return NextResponse.json({ error: "Metadata file not found" }, { status: 404 });
    }
    
    const metaData = JSON.parse(fs.readFileSync(metaFilePath, 'utf8'));
    
    // Find the IPOs with the requested IDs
    const iposToCompare = [];
    const missingIds = [];
    
    for (const id of ipoIds) {
      const ipo = metaData.find(item => item.ipo_id === id);
      if (ipo) {
        // Select only the fields needed for comparison
        iposToCompare.push({
          ipo_id: ipo.ipo_id,
          ipo_name: ipo.ipo_name,
          company_name: ipo.company_name,
          year: ipo.year,
          status: ipo.status,
          issue_price: ipo.issue_price,
          issue_size: ipo.issue_size,
          listing_gains: ipo.listing_gains,
          listing_gains_numeric: ipo.listing_gains_numeric,
          listing_date: ipo.listing_date,
          opening_date: ipo.opening_date,
          closing_date: ipo.closing_date,
          listing_at: ipo.listing_at,
          logo_url: ipo.logo_url
        });
      } else {
        missingIds.push(id);
      }
    }
    
    // Prepare response
    const response = {
      total: iposToCompare.length,
      missing_ids: missingIds.length > 0 ? missingIds : null,
      data: iposToCompare
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error comparing IPOs:", error);
    return NextResponse.json({ error: "Failed to compare IPOs", details: error.message }, { status: 500 });
  }
} 