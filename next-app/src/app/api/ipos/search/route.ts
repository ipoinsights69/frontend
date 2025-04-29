import { NextRequest, NextResponse } from 'next/server';
import { searchIPOs } from '@/app/api/ipos/handlers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  
  try {
    // Get search results from the handler
    const results = await searchIPOs(query, limit);
    
    // Transform the results to match the expected format
    const transformedResults = results.map(ipo => ({
      company_name: `${ipo.companyName} IPO`,
      detail_url: `/ipo/${ipo.id}`,
      opening_date: ipo.openDate || 'N/A',
      closing_date: ipo.closeDate || 'N/A',
      listing_date: ipo.listingDate || 'Not yet listed',
      issue_price: ipo.priceRange?.max || null,
      issue_amount: (ipo.issueSize ? (ipo.issueSize / 100).toFixed(2) : "N/A"),
      listing_at: ipo.industry?.includes('SME') ? 'NSE SME' : 'NSE',
      lead_manager: '<a href="https://www.chittorgarh.com/report/ipo-lead-manager-review/112/76/" title="Hem Securities Limited Lead Manager Review">Hem Securities</a>',
      year: new Date(ipo.openDate || new Date()).getFullYear(),
      _fetched_at: new Date().toISOString(),
      ipo_id: ipo.id,
      status: ipo.status
    }));
    
    // Return the response in the requested format
    return NextResponse.json({
      data: transformedResults,
      page,
      limit,
      total: transformedResults.length,
      totalPages: Math.ceil(transformedResults.length / limit),
      query,
      search_type: "text",
      request_parameters: {
        q: query,
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error searching IPOs:', error);
    return NextResponse.json(
      { error: 'Failed to search IPOs' },
      { status: 500 }
    );
  }
} 