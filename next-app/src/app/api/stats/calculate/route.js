import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // For fallback, we'll need to read data from other sources
    const outputDir = path.join(process.cwd(), 'output');
    
    // First, try to read from the existing stats.json file
    const statsPath = path.join(outputDir, 'stats.json');
    if (fs.existsSync(statsPath)) {
      const statsData = fs.readFileSync(statsPath, 'utf8');
      const stats = JSON.parse(statsData);
      return NextResponse.json(stats);
    }
    
    // Read the status directory to calculate status counts
    const statusDir = path.join(outputDir, 'status');
    const byStatus = {
      upcoming: 0,
      open: 0,
      closed: 0,
      listed: 0,
      unknown: 0
    };
    
    // Calculate status counts from individual status files
    if (fs.existsSync(statusDir)) {
      const statusFiles = ['upcoming.json', 'open.json', 'closed.json', 'listed.json', 'unknown.json'];
      
      for (const file of statusFiles) {
        const filePath = path.join(statusDir, file);
        if (fs.existsSync(filePath)) {
          try {
            const data = fs.readFileSync(filePath, 'utf8');
            const ipos = JSON.parse(data);
            const status = file.replace('.json', '');
            byStatus[status] = ipos.length;
          } catch (err) {
            console.error(`Error reading status file ${file}:`, err);
          }
        }
      }
    }
    
    // Get metadata for all IPOs for total count
    let allIpos = [];
    const metaPath = path.join(outputDir, 'all_ipos_meta.json');
    if (fs.existsSync(metaPath)) {
      try {
        const data = fs.readFileSync(metaPath, 'utf8');
        allIpos = JSON.parse(data);
      } catch (err) {
        console.error(`Error reading all_ipos_meta.json:`, err);
      }
    }
    
    // Get best performer data
    let bestPerformer = {};
    const bestPath = path.join(outputDir, 'performance', 'best.json');
    if (fs.existsSync(bestPath)) {
      try {
        const data = fs.readFileSync(bestPath, 'utf8');
        const bestPerformers = JSON.parse(data);
        if (bestPerformers.length > 0) {
          bestPerformer = bestPerformers[0];
        }
      } catch (err) {
        console.error(`Error reading best performers:`, err);
      }
    }
    
    // Get worst performer data
    let worstPerformer = {};
    const worstPath = path.join(outputDir, 'performance', 'worst.json');
    if (fs.existsSync(worstPath)) {
      try {
        const data = fs.readFileSync(worstPath, 'utf8');
        const worstPerformers = JSON.parse(data);
        if (worstPerformers.length > 0) {
          worstPerformer = worstPerformers[0];
        }
      } catch (err) {
        console.error(`Error reading worst performers:`, err);
      }
    }
    
    // Construct the stats object
    const stats = {
      totalCount: allIpos.length,
      byStatus,
      bestPerformer,
      worstPerformer
    };
    
    // Log the stats we're calculating
    console.log('Calculated stats:', JSON.stringify({
      totalCount: stats.totalCount,
      byStatus: stats.byStatus
    }, null, 2));
    
    // Try to save the calculated stats for future use
    try {
      fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
      console.log('Saved calculated stats to stats.json');
    } catch (writeErr) {
      console.error('Error saving calculated stats:', writeErr);
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    return NextResponse.json({ 
      error: "Failed to calculate stats", 
      details: error.message 
    }, { status: 500 });
  }
}
