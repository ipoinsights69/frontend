import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper function to read JSON file (server-side only)
const readJsonFile = (filePath: string) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

// Get upcoming IPOs
export async function GET() {
  try {
    const upcoming = readJsonFile('output/status/upcoming.json') || [];
    const stats = {
      upcomingCount: upcoming.length,
      averageReturn: 21.7,
      topSector: {
        name: 'Technology',
        return: 35.8
      }
    };
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        upcomingIPOs: upcoming, 
        stats 
      } 
    });
  } catch (error) {
    console.error("Error fetching upcoming IPOs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch upcoming IPOs" },
      { status: 500 }
    );
  }
} 