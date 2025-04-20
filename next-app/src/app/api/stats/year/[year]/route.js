import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { year } = params;
    
    if (!year || !/^\d{4}$/.test(year)) {
      return NextResponse.json({
        error: "Invalid year parameter",
        message: "Please provide a valid 4-digit year"
      }, { status: 400 });
    }
    
    // Read the data for year-specific analysis
    const metaFilePath = path.join(process.cwd(), 'output', 'all_ipos_meta.json');
    
    // Check if file exists
    if (!fs.existsSync(metaFilePath)) {
      console.error(`File not found: ${metaFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const metaData = JSON.parse(fs.readFileSync(metaFilePath, 'utf8'));
    
    // Filter data for the specified year
    const yearData = metaData.filter(ipo => ipo.year === parseInt(year));
    
    if (yearData.length === 0) {
      return NextResponse.json({
        error: "No data found",
        message: `No IPO data found for the year ${year}`
      }, { status: 404 });
    }
    
    // Calculate statistics for the year
    const totalIpos = yearData.length;
    
    // Count IPOs by status
    const statusCounts = yearData.reduce((acc, ipo) => {
      acc[ipo.status] = (acc[ipo.status] || 0) + 1;
      return acc;
    }, {});
    
    // Get performance statistics
    const iposWithGains = yearData.filter(ipo => ipo.listing_gains_numeric !== undefined);
    const averageGains = iposWithGains.length > 0 
      ? iposWithGains.reduce((sum, ipo) => sum + ipo.listing_gains_numeric, 0) / iposWithGains.length
      : null;
    
    // Find best and worst performers
    let bestPerformer = null;
    let worstPerformer = null;
    
    if (iposWithGains.length > 0) {
      bestPerformer = iposWithGains.reduce((best, current) => 
        (current.listing_gains_numeric > best.listing_gains_numeric) ? current : best, 
        iposWithGains[0]
      );
      
      worstPerformer = iposWithGains.reduce((worst, current) => 
        (current.listing_gains_numeric < worst.listing_gains_numeric) ? current : worst, 
        iposWithGains[0]
      );
      
      // Simplify the objects to only include necessary fields
      bestPerformer = {
        ipo_id: bestPerformer.ipo_id,
        ipo_name: bestPerformer.ipo_name,
        listing_gains: bestPerformer.listing_gains,
        listing_gains_numeric: bestPerformer.listing_gains_numeric
      };
      
      worstPerformer = {
        ipo_id: worstPerformer.ipo_id,
        ipo_name: worstPerformer.ipo_name,
        listing_gains: worstPerformer.listing_gains,
        listing_gains_numeric: worstPerformer.listing_gains_numeric
      };
    }
    
    // Count IPOs by listing exchange
    const exchangeCounts = yearData.reduce((acc, ipo) => {
      if (ipo.listing_at) {
        acc[ipo.listing_at] = (acc[ipo.listing_at] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Calculate quarterly distribution
    const quarterlyDistribution = yearData.reduce((acc, ipo) => {
      if (ipo.opening_date) {
        const openingDate = new Date(ipo.opening_date);
        const quarter = Math.floor((openingDate.getMonth() / 3)) + 1;
        acc[`Q${quarter}`] = (acc[`Q${quarter}`] || 0) + 1;
      }
      return acc;
    }, { Q1: 0, Q2: 0, Q3: 0, Q4: 0 });
    
    // Create response object
    const response = {
      year: parseInt(year),
      total_ipos: totalIpos,
      status_distribution: statusCounts,
      exchange_distribution: exchangeCounts,
      quarterly_distribution: quarterlyDistribution,
      performance: {
        average_listing_gains: averageGains !== null ? averageGains.toFixed(2) + '%' : 'N/A',
        average_listing_gains_numeric: averageGains,
        best_performer: bestPerformer,
        worst_performer: worstPerformer
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error fetching stats for year ${params.year}:`, error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
} 