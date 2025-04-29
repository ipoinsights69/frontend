import { NextRequest, NextResponse } from 'next/server';
import { searchIPOs } from '@/app/api/ipos/handlers';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  
  try {
    const results = await searchIPOs(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching IPOs:', error);
    return NextResponse.json(
      { error: 'Failed to search IPOs' },
      { status: 500 }
    );
  }
} 