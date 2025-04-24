import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AllotmentResult {
  status: 'success' | 'not_found';
  name?: string;
  applicationNumber?: string;
  pan?: string;
  category?: string;
  bidDetails?: Array<{
    bidPrice: number;
    quantity: number;
    allotted: number;
  }>;
  accountDebit?: string;
  refundAmount?: string;
  refundDate?: string;
  sharesCredit?: {
    date: string;
    quantity: number;
    depositoryParticipant: string;
  };
}

// Get IPO data from actual JSON files
const getIPODataById = async (ipoId: string) => {
  try {
    console.log(`Finding IPO data for allotment check: ${ipoId}`);
    
    // First try to find the year from the all_ipos_meta.json
    const allIposMetaPath = path.join(process.cwd(), 'output', 'all_ipos_meta.json');
    
    if (!fs.existsSync(allIposMetaPath)) {
      console.error('Could not find all_ipos_meta.json file');
      return null;
    }
    
    const allIposMetaContent = fs.readFileSync(allIposMetaPath, 'utf8');
    const allIposMeta = JSON.parse(allIposMetaContent);
    
    // Try various approaches to find the IPO metadata
    let ipoMeta = allIposMeta.find((ipo: any) => ipo.ipo_id === ipoId);
    
    // If not found by exact match, try other approaches
    if (!ipoMeta) {
      // Check if it's in original_ipo_id format
      ipoMeta = allIposMeta.find((ipo: any) => ipo.original_ipo_id === ipoId);
      
      // Try extracting year prefix and finding by that
      if (!ipoMeta) {
        const yearMatch = ipoId.match(/^(\d{4})_/);
        if (yearMatch) {
          const year = yearMatch[1];
          const idWithoutYear = ipoId.replace(/^\d{4}_/, '');
          ipoMeta = allIposMeta.find((ipo: any) => 
            ipo.year.toString() === year && 
            (ipo.ipo_id.includes(idWithoutYear) || (ipo.original_ipo_id && ipo.original_ipo_id.includes(idWithoutYear)))
          );
        }
      }
    }
    
    if (!ipoMeta) {
      console.error(`IPO with id ${ipoId} not found in all_ipos_meta.json`);
      return null;
    }
    
    const year = ipoMeta.year.toString();
    console.log(`Found IPO metadata: ${ipoMeta.company_name} (Year: ${year})`);
    
    // Find the raw IPO data file
    let rawFilePath = path.join(process.cwd(), 'output', 'raw', year, `${ipoId}.json`);
    
    // If not found by direct ID, try using original_ipo_id
    if (!fs.existsSync(rawFilePath) && ipoMeta.original_ipo_id) {
      rawFilePath = path.join(process.cwd(), 'output', 'raw', year, `${ipoMeta.original_ipo_id}.json`);
    }
    
    // If not found and raw_data_path is available, use that
    if (!fs.existsSync(rawFilePath) && ipoMeta.raw_data_path) {
      rawFilePath = path.join(process.cwd(), 'output', ipoMeta.raw_data_path);
    }
    
    if (!fs.existsSync(rawFilePath)) {
      console.error(`IPO data file not found: ${rawFilePath}`);
      
      // If we have metadata but no raw file, use the metadata to create a basic record
      return {
        id: ipoId,
        companyName: ipoMeta.company_name,
        priceRange: { 
          min: ipoMeta.issue_price_numeric || parseFloat((ipoMeta.issue_price || '0').replace(/[^\d.]/g, '')) || 0, 
          max: ipoMeta.issue_price_numeric || parseFloat((ipoMeta.issue_price || '0').replace(/[^\d.]/g, '')) || 0 
        },
        lotSize: parseInt((ipoMeta.lot_size || '0').split(' ')[0]) || 1,
        allotmentDate: ipoMeta.allotment_date || ipoMeta.initiationOfRefunds,
        refundDate: ipoMeta.refund_date || ipoMeta.initiationOfRefunds,
        listingDate: ipoMeta.listing_date,
        status: ipoMeta.status || 'unknown'
      };
    }
    
    const fileContent = fs.readFileSync(rawFilePath, 'utf8');
    const ipoData = JSON.parse(fileContent);
    
    // Parse numeric values from price strings
    const parseNumericValue = (value: string | number | undefined): number => {
      if (typeof value === 'number') return value;
      if (!value) return 0;
      
      const numericString = value.toString().replace(/[^\d.]/g, '');
      return parseFloat(numericString) || 0;
    };
    
    // Get company name with fallbacks
    const companyName = 
      ipoMeta.company_name ||
      ipoData.company_name || 
      ipoData.ipo_name || 
      // Convert from id format like "company_name_ipo" to "Company Name"
      ipoId.replace(/_ipo$/, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char: string) => char.toUpperCase());
    
    // Format the data to be consistent with what the allotment checker expects
    return {
      id: ipoId,
      companyName: companyName,
      priceRange: { 
        min: ipoData.issue_price_numeric || ipoMeta.issue_price_numeric || 
             parseNumericValue(ipoData.issue_price || ipoMeta.issue_price), 
        max: ipoData.issue_price_numeric || ipoMeta.issue_price_numeric || 
             parseNumericValue(ipoData.issue_price || ipoMeta.issue_price)
      },
      lotSize: ipoData.lot_size || parseInt((ipoMeta.lot_size || '0').split(' ')[0]) || 1,
      allotmentDate: ipoData.allotment_date || ipoMeta.allotment_date || ipoData.basicDetails?.initiationOfRefunds,
      refundDate: ipoData.refund_date || ipoMeta.refund_date || ipoData.basicDetails?.initiationOfRefunds,
      listingDate: ipoData.listing_date || ipoMeta.listing_date || ipoData.basicDetails?.ipoListingDate,
      status: ipoData.status || ipoMeta.status || 'unknown'
    };
  } catch (error) {
    console.error(`Error getting IPO data for ${ipoId}:`, error);
    return null;
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ipoId = searchParams.get('ipoId');
  const method = searchParams.get('method');
  
  if (!ipoId || !method) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }
  
  try {
    // Get IPO data from the actual data files
    const ipoData = await getIPODataById(ipoId);
    
    if (!ipoData) {
      return NextResponse.json(
        { error: 'IPO data not found' },
        { status: 404 }
      );
    }
    
    // Extract search parameters based on method
    let searchValue = '';
    let dpId = '';
    let clientId = '';
    
    if (method === 'pan') {
      searchValue = searchParams.get('pan') || '';
    } else if (method === 'application') {
      searchValue = searchParams.get('applicationNumber') || '';
    } else if (method === 'demat') {
      dpId = searchParams.get('dpId') || '';
      clientId = searchParams.get('clientId') || '';
      searchValue = `${dpId}-${clientId}`;
    }
    
    if (!searchValue && method !== 'demat') {
      return NextResponse.json(
        { error: 'Missing search value' },
        { status: 400 }
      );
    }
    
    if (method === 'demat' && (!dpId || !clientId)) {
      return NextResponse.json(
        { error: 'Missing DP ID or Client ID' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would check against a database or call an external API
    // For demonstration, we'll simulate a response with 70% success rate
    const isSuccess = Math.random() > 0.3;
    
    const result: AllotmentResult = isSuccess 
      ? {
          status: 'success',
          name: 'Amit Kumar',
          applicationNumber: 'APP' + Math.floor(100000000 + Math.random() * 900000000),
          pan: method === 'pan' ? searchValue : 'ABCDE1234F',
          category: 'Retail Individual Investor',
          bidDetails: [
            { 
              bidPrice: ipoData.priceRange.max, 
              quantity: ipoData.lotSize, 
              allotted: Math.floor(Math.random() * ipoData.lotSize) 
            }
          ],
          accountDebit: `₹${(ipoData.priceRange.max * ipoData.lotSize).toLocaleString('en-IN')}`,
          refundAmount: `₹${Math.floor(Math.random() * 5000).toLocaleString('en-IN')}`,
          refundDate: ipoData.refundDate,
          sharesCredit: {
            date: ipoData.listingDate,
            quantity: Math.floor(Math.random() * ipoData.lotSize),
            depositoryParticipant: 'HDFC Securities - IN303719'
          }
        }
      : { status: 'not_found' };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error processing allotment check:', error);
    return NextResponse.json(
      { error: 'Failed to process allotment check' },
      { status: 500 }
    );
  }
} 