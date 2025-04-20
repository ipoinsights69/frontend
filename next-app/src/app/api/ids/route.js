import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the data file - adjust path since we're in the same app
    const dataFilePath = path.join(process.cwd(), 'output', 'ipo_ids.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching IDs data:", error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
} 