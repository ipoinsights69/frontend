import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';
  
  try {
    // Forward the request to the external API at port 8000
    const apiUrl = `http://localhost:8000/api/ipos/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    
    const response = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`External API search failed: ${response.status}`);
    }
    
    // Forward the response from the external API
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching IPOs:', error);
    return NextResponse.json(
      { error: 'Failed to search IPOs' },
      { status: 500 }
    );
  }
} 