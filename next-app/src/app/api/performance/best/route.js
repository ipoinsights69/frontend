import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const year = searchParams.get('year');
    
    // Read the data file - adjust path since we're in the same app
    const dataFilePath = path.join(process.cwd(), 'output', 'performance', 'best.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Apply year filter if provided
    if (year) {
      data = data.filter(item => item.year == parseInt(year));
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    // Prepare response
    const response = {
      total: data.length,
      page: page,
      limit: limit,
      total_pages: Math.ceil(data.length / limit),
      data: paginatedData
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching best performance data:", error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
} 