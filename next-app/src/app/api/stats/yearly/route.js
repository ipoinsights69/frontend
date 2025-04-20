import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric') || 'count'; // count, listing_gains, subscription
    
    // Read the data file - all listed IPOs to generate statistics
    const dataFilePath = path.join(process.cwd(), 'output', 'status', 'listed.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const ipoData = JSON.parse(jsonData);
    
    // Group data by year
    const yearlyStats = {};
    
    ipoData.forEach(ipo => {
      const year = ipo.year;
      
      if (!year) return;
      
      if (!yearlyStats[year]) {
        yearlyStats[year] = {
          count: 0,
          total_listing_gains: 0,
          avg_listing_gains: 0,
          positive_listings: 0,
          negative_listings: 0,
          total_subscription: 0,
          avg_subscription: 0,
          total_applications: 0,
          ipo_size_total: 0
        };
      }
      
      // Count IPOs
      yearlyStats[year].count++;
      
      // Calculate listing gains metrics
      if (ipo.listing_gains_numeric !== null && ipo.listing_gains_numeric !== undefined) {
        yearlyStats[year].total_listing_gains += ipo.listing_gains_numeric;
        
        if (ipo.listing_gains_numeric > 0) {
          yearlyStats[year].positive_listings++;
        } else if (ipo.listing_gains_numeric < 0) {
          yearlyStats[year].negative_listings++;
        }
      }
      
      // Track subscription data
      if (ipo.overall_subscription && !isNaN(parseFloat(ipo.overall_subscription))) {
        yearlyStats[year].total_subscription += parseFloat(ipo.overall_subscription);
      }
      
      // Track total applications
      if (ipo.total_applications && !isNaN(parseInt(ipo.total_applications.replace(/,/g, '')))) {
        yearlyStats[year].total_applications += parseInt(ipo.total_applications.replace(/,/g, ''));
      }
      
      // Track IPO size
      if (ipo.issue_size_numeric) {
        yearlyStats[year].ipo_size_total += ipo.issue_size_numeric;
      }
    });
    
    // Calculate averages
    Object.keys(yearlyStats).forEach(year => {
      const stats = yearlyStats[year];
      const count = stats.count;
      
      if (count > 0) {
        stats.avg_listing_gains = stats.total_listing_gains / count;
        
        if (stats.total_subscription > 0) {
          stats.avg_subscription = stats.total_subscription / count;
        }
      }
    });
    
    // Convert to array format for easier consumption by charts
    const formattedStats = Object.keys(yearlyStats).map(year => ({
      year: parseInt(year),
      ...yearlyStats[year]
    })).sort((a, b) => a.year - b.year); // Sort by year ascending
    
    return NextResponse.json({
      metric,
      total_years: formattedStats.length,
      data: formattedStats
    });
    
  } catch (error) {
    console.error("Error generating IPO yearly statistics:", error);
    return NextResponse.json({ error: "Failed to generate statistics", details: error.message }, { status: 500 });
  }
} 