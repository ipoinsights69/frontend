import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the data file - adjust path since we're in the same app
    const dataFilePath = path.join(process.cwd(), 'output', 'status', 'upcoming.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Sort by opening date (ascending) so earliest opening dates come first
    data.sort((a, b) => {
      const dateA = a.opening_date ? new Date(a.opening_date) : new Date();
      const dateB = b.opening_date ? new Date(b.opening_date) : new Date();
      return dateA - dateB;
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching upcoming IPOs data:", error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
} 