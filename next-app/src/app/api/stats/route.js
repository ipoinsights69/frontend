import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the data file - adjust path since we're in the same app
    const dataFilePath = path.join(process.cwd(), 'output', 'stats.json');
    
    // Check if file exists and is readable
    try {
      const jsonData = fs.readFileSync(dataFilePath, 'utf8');
      const stats = JSON.parse(jsonData);
      
      // Check if data has expected structure
      if (stats && typeof stats.totalCount === 'number' && stats.byStatus) {
        console.log("Successfully read stats from file:", dataFilePath);
        return NextResponse.json(stats);
      } else {
        console.log("Stats file exists but doesn't have expected structure");
      }
    } catch (err) {
      console.error(`Error reading stats file: ${err.message}`);
    }
    
    // If we get here, we either couldn't read the file or it didn't have the right structure
    console.log("Calculating fallback stats directly in stats endpoint...");
    
    // --- Direct calculation logic ---
    // For fallback, we'll need to read data from other sources
    const outputDir = path.join(process.cwd(), 'output');
    
    // Read the status directories to calculate counts
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
            byStatus[status] = Array.isArray(ipos) ? ipos.length : 0;
          } catch (err) {
            console.error(`Error reading status file ${file}:`, err);
          }
        }
      }
    }
    
    // Get total count
    let totalCount = 0;
    const metaPath = path.join(outputDir, 'all_ipos_meta.json');
    if (fs.existsSync(metaPath)) {
      try {
        const data = fs.readFileSync(metaPath, 'utf8');
        const allIpos = JSON.parse(data);
        totalCount = Array.isArray(allIpos) ? allIpos.length : 0;
      } catch (err) {
        console.error(`Error reading all_ipos_meta.json:`, err);
      }
    }
    
    // Create a direct basic stats object if needed
    const directStats = {
      totalCount: totalCount,
      byStatus: byStatus,
      bestPerformer: {},  // Simplified version without best/worst performer
      worstPerformer: {}
    };
    
    console.log("Returning directly calculated stats:", JSON.stringify({
      totalCount: directStats.totalCount,
      byStatus: directStats.byStatus
    }, null, 2));
    
    // Try to save these stats for future use
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(directStats, null, 2));
      console.log('Saved directly calculated stats to stats.json');
    } catch (writeErr) {
      console.error('Error saving directly calculated stats:', writeErr);
    }
    
    return NextResponse.json(directStats);
  } catch (error) {
    console.error("Error in stats API:", error);
    
    // Return a hardcoded version as absolute fallback
    return NextResponse.json({
      totalCount: 0,
      byStatus: {
        upcoming: 0,
        open: 0,
        closed: 0,
        listed: 0,
        unknown: 0
      },
      bestPerformer: {},
      worstPerformer: {}
    });
  }
}
