import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const sort_by = searchParams.get('sort_by') || 'closing_date';
    const sort_order = searchParams.get('sort_order') || 'asc';
    
    // Read the data file
    const dataFilePath = path.join(process.cwd(), 'output', 'status', 'open.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Apply sorting
    data.sort((a, b) => {
      let valueA = a[sort_by];
      let valueB = b[sort_by];
      
      // Handle date strings
      if (sort_by === 'opening_date' || sort_by === 'closing_date') {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }
      
      // Handle numeric values
      if (typeof valueA === 'string' && !isNaN(valueA)) {
        valueA = parseFloat(valueA);
      }
      if (typeof valueB === 'string' && !isNaN(valueB)) {
        valueB = parseFloat(valueB);
      }
      
      // For strings, use localeCompare
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sort_order === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // For numbers and other types
      return sort_order === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
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
    console.error("Error fetching open IPOs data:", error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
} 