import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'all'; // all, year, month
    const year = searchParams.get('year');
    
    // Read the data file
    const dataFilePath = path.join(process.cwd(), 'output', 'status', 'listed.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let ipoData = JSON.parse(jsonData);
    
    // Apply filters based on parameters
    if (range === 'year' && year) {
      ipoData = ipoData.filter(ipo => ipo.year === parseInt(year));
    }
    
    // Extract listing gains data
    const performanceData = ipoData
      .filter(ipo => ipo.listing_gains_numeric !== null && ipo.listing_gains_numeric !== undefined)
      .map(ipo => ({
        ipo_id: ipo.ipo_id,
        ipo_name: ipo.ipo_name,
        company_name: ipo.company_name,
        year: ipo.year,
        listing_date: ipo.listing_date,
        issue_price: ipo.issue_price,
        issue_price_numeric: ipo.issue_price_numeric,
        listing_gains: ipo.listing_gains,
        listing_gains_numeric: ipo.listing_gains_numeric,
        lot_size: ipo.lot_size,
        listing_at: ipo.listing_at,
        logo_url: ipo.logo_url
      }));
    
    // Calculate performance distribution
    const performanceDistribution = {
      total: performanceData.length,
      positive: performanceData.filter(ipo => ipo.listing_gains_numeric > 0).length,
      negative: performanceData.filter(ipo => ipo.listing_gains_numeric < 0).length,
      neutral: performanceData.filter(ipo => ipo.listing_gains_numeric === 0).length,
      
      // More detailed brackets
      brackets: {
        "above_100": performanceData.filter(ipo => ipo.listing_gains_numeric >= 100).length,
        "50_to_100": performanceData.filter(ipo => ipo.listing_gains_numeric >= 50 && ipo.listing_gains_numeric < 100).length,
        "20_to_50": performanceData.filter(ipo => ipo.listing_gains_numeric >= 20 && ipo.listing_gains_numeric < 50).length,
        "0_to_20": performanceData.filter(ipo => ipo.listing_gains_numeric >= 0 && ipo.listing_gains_numeric < 20).length,
        "neg_20_to_0": performanceData.filter(ipo => ipo.listing_gains_numeric >= -20 && ipo.listing_gains_numeric < 0).length,
        "below_neg_20": performanceData.filter(ipo => ipo.listing_gains_numeric < -20).length
      }
    };
    
    // Calculate average performance
    const totalGains = performanceData.reduce((sum, ipo) => sum + ipo.listing_gains_numeric, 0);
    const averageGains = performanceData.length > 0 ? totalGains / performanceData.length : 0;
    
    // Get top and bottom performers
    const topPerformers = [...performanceData]
      .sort((a, b) => b.listing_gains_numeric - a.listing_gains_numeric)
      .slice(0, 5);
      
    const bottomPerformers = [...performanceData]
      .sort((a, b) => a.listing_gains_numeric - b.listing_gains_numeric)
      .slice(0, 5);
    
    // Calculate listing performance by exchange
    const exchangePerformance = {};
    performanceData.forEach(ipo => {
      const exchange = ipo.listing_at || 'Unknown';
      
      if (!exchangePerformance[exchange]) {
        exchangePerformance[exchange] = {
          count: 0,
          total_gains: 0,
          avg_gains: 0,
          positive: 0,
          negative: 0
        };
      }
      
      exchangePerformance[exchange].count++;
      exchangePerformance[exchange].total_gains += ipo.listing_gains_numeric;
      
      if (ipo.listing_gains_numeric > 0) {
        exchangePerformance[exchange].positive++;
      } else if (ipo.listing_gains_numeric < 0) {
        exchangePerformance[exchange].negative++;
      }
    });
    
    // Calculate averages for each exchange
    Object.keys(exchangePerformance).forEach(exchange => {
      const stats = exchangePerformance[exchange];
      if (stats.count > 0) {
        stats.avg_gains = stats.total_gains / stats.count;
      }
    });
    
    return NextResponse.json({
      range,
      year: year ? parseInt(year) : null,
      total_ipos: performanceData.length,
      average_listing_gains: averageGains,
      distribution: performanceDistribution,
      exchange_performance: exchangePerformance,
      top_performers: topPerformers,
      bottom_performers: bottomPerformers
    });
    
  } catch (error) {
    console.error("Error generating IPO performance statistics:", error);
    return NextResponse.json({ error: "Failed to generate statistics", details: error.message }, { status: 500 });
  }
} 