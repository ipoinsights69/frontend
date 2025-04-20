import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Adjust path to access data directly since we're now in the same app
    const dataFilePath = path.join(process.cwd(), 'output', 'years.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching years data:", error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
} 