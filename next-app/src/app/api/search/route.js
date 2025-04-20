import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const sort_by = searchParams.get('sort_by') || 'ipo_name';
    const sort_order = searchParams.get('sort_order') || 'asc';
    const year = searchParams.get('year');
    const status = searchParams.get('status');
    
    // Read the data file - adjust path since we're in the same app
    const dataFilePath = path.join(process.cwd(), 'output', 'all_ipos_meta.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }
    
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let data = JSON.parse(jsonData);
    
    // Apply search filter if query is provided
    if (query && query.trim() !== '') {
      const searchLower = query.toLowerCase();
      data = data.filter(item => 
        (item.ipo_name && item.ipo_name.toLowerCase().includes(searchLower)) || 
        (item.company_name && item.company_name.toLowerCase().includes(searchLower)) ||
        (item.ipo_id && item.ipo_id.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply year filter if provided
    if (year) {
      data = data.filter(item => item.year == parseInt(year));
    }
    
    // Apply status filter if provided
    if (status) {
      data = data.filter(item => item.status === status);
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let valueA = a[sort_by];
      let valueB = b[sort_by];
      
      // Handle string values
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sort_order === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // For numbers and other types
      return sort_order === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    // Extract only the basic information needed
    const simplifiedData = paginatedData.map(item => ({
      ipo_id: item.ipo_id,
      ipo_name: item.ipo_name,
      company_name: item.company_name,
      year: item.year,
      status: item.status,
      issue_price: item.issue_price,
      listing_gains: item.listing_gains,
      listing_at: item.listing_at,
      logo_url: item.logo_url
    }));
    
    // Prepare response
    const response = {
      total: data.length,
      page: page,
      limit: limit,
      total_pages: Math.ceil(data.length / limit),
      data: simplifiedData
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
} 