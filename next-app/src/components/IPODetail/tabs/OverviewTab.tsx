import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';

interface OverviewTabProps {
  data: IPODetailedData & Record<string, any>;
}

// Helper function to extract promoter names from text
const extractPromoterNames = (promoters: string[]): string[] => {
  if (!promoters || promoters.length === 0) return [];
  
  // If we already have an array of individual promoters, return it
  if (promoters.length > 1) return promoters;
  
  // Try to extract names from text like "Person1 Person2 and Person3 are the promoters of the company"
  const promoterText = promoters[0];
  if (!promoterText) return [];
  
  // Remove the common suffix
  const cleanText = promoterText
    .replace(/\s+are the promoters of the company\.?$/i, '')
    .replace(/\s+is the promoter of the company\.?$/i, '');
  
  // Split by "and" and commas
  const names = cleanText
    .split(/\s+and\s+|\s*,\s*/)
    .filter(Boolean)
    .map(name => name.trim());
  
  return names.length > 0 ? names : promoters;
};

const OverviewTab = ({ data }: OverviewTabProps) => {
  // Get about company data
  // First check for about.details_ai, then about.details, then fallback to description
  const aboutDetailsAi = getNestedValue(data, 'about.details_ai');
  const aboutDetails = getNestedValue(data, 'about.details');
  const description = aboutDetailsAi || aboutDetails || data.description || '';
  
  console.log('About data paths:', {
    aboutDetailsAi,
    aboutDetails,
    description: data.description,
    about: data.about
  });
  
  const businessSegments = data.business_segments || [];
  const competitiveStrengths = data.competitive_strengths || [];
  
  // Get IPO objectives
  const additionalTables = getNestedValue(data, 'additionalTables') || [];
  const objectivesTable = additionalTables.find((table: any) => 
    (table.sanitizedHeading === 'objectives' || 
    (table.heading && table.heading.toLowerCase().includes('objects'))) &&
    table.rows && 
    table.rows.length > 0
  );
  const objectivesData = objectivesTable?.rows || [];
  
  // Get promoter information
  const promoters = data.promoters || [];
  const preIssue = getNestedValue(data, 'promoterHolding.holdings.share_holding_pre_issue');
  const postIssue = getNestedValue(data, 'promoterHolding.holdings.share_holding_post_issue');
  
  // Parse holding percentages for visualization
  const preIssueValue = preIssue ? parseFloat(preIssue.replace('%', '')) : 0;
  const postIssueValue = postIssue ? parseFloat(postIssue.replace('%', '')) : 0;
  
  // Get contact details
  const address = getNestedValue(data, 'contactDetails.full_address') || '';
  const phone = getNestedValue(data, 'contactDetails.phone') || '';
  const email = getNestedValue(data, 'contactDetails.email') || '';
  const website = getNestedValue(data, 'contactDetails.website') || '';

  // Listing details
  const issuePrice = Number(data.priceRange?.max) || 0;
  const listingPrice = Number(data.listingPrice) || 0;
  const listingGain = Number(data.listingGainPercentage) || 0;
  const status = data.status || '';
  const isListed = status === 'listed';
  const leadManager = getNestedValue(data, 'leadManagers.0.name') || '';
  const registrarName = getNestedValue(data, 'registrarDetails.name') || '';
  const registrarEmail = getNestedValue(data, 'registrarDetails.email') || '';
  const listingDate = data.listingDate || '';
  const listingAt = data.listingAt || '';
  const scriptCode = getNestedValue(data, 'listingDetails.scriptCode') || '';
  const isin = getNestedValue(data, 'listingDetails.isin') || '';

  // Get document URLs - may not exist on all IPOs
  const drhpUrl = getNestedValue(data, 'documents.drhp') || '';
  const rhpUrl = getNestedValue(data, 'documents.rhp') || '';

  // Calculate pre-issue and post-issue percentages for charts
  const preIssuePromoterPercentage = parseFloat(getNestedValue(data, 'promoterHolding.holdings.share_holding_pre_issue') || '0');
  const postIssuePromoterPercentage = parseFloat(getNestedValue(data, 'promoterHolding.holdings.share_holding_post_issue') || '0');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* About the Company */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">{data.companyName} Overview</h2>
          
          {/* Company description */}
          <div className="text-sm text-gray-600 leading-relaxed mb-6">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          
          {/* Business segments and strengths in clean layout */}
          <div className="mt-6 border-t pt-5">
            <div className="space-y-6">
              {/* Business Segments - Simple clean design */}
              {businessSegments.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Business Segments</h3>
                  <div className="pl-3 border-l-2 border-blue-300">
                    {businessSegments.map((segment: any, idx: number) => (
                      <div key={idx} className="mb-3">
                        <h4 className="text-sm font-medium text-gray-800">{segment.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Competitive Strengths - Clean list format */}
              {competitiveStrengths.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Competitive Strengths</h3>
                  <ul className="pl-3 border-l-2 border-green-300 space-y-2">
                    {competitiveStrengths.map((strength: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IPO Basic Details - Added from DetailsTab */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">IPO Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Issue Type</div>
              <div className="text-sm font-medium text-gray-800">{data.issueType || 'IPO'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Issue Size</div>
              <div className="text-sm font-medium text-gray-800">{data.issueSize ? `₹${data.issueSize} Cr` : 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Fresh Issue</div>
              <div className="text-sm font-medium text-gray-800">{getNestedValue(data, 'basicDetails.freshIssue') || (data.issueSize ? `₹${data.issueSize} Cr` : 'N/A')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Face Value</div>
              <div className="text-sm font-medium text-gray-800">₹{getNestedValue(data, 'basicDetails.faceValue') || 'N/A'} per share</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Issue Price</div>
              <div className="text-sm font-medium text-gray-800">
                {data.priceRange?.min && data.priceRange?.max && data.priceRange.min !== data.priceRange.max
                  ? `₹${data.priceRange.min} - ₹${data.priceRange.max}`
                  : data.priceRange?.max
                  ? `₹${data.priceRange.max}`
                  : 'N/A'
                }
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Lot Size</div>
              <div className="text-sm font-medium text-gray-800">{data.lotSize || 'N/A'} Shares</div>
            </div>
            {getNestedValue(data, 'reservation.allocation.2.shares_offered') && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Market Maker Portion</div>
                <div className="text-sm font-medium text-gray-800">{getNestedValue(data, 'reservation.allocation.2.shares_offered')} shares</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600 mb-1">Listing At</div>
              <div className="text-sm font-medium text-gray-800">{data.listingAt || 'N/A'}</div>
            </div>
            {getNestedValue(data, 'basicDetails.cutOffPrice') && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Cut-off Option</div>
                <div className="text-sm font-medium text-gray-800">{getNestedValue(data, 'basicDetails.cutOffPrice')}</div>
              </div>
            )}
            {getNestedValue(data, 'basicDetails.bidSize') && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Bid Size</div>
                <div className="text-sm font-medium text-gray-800">{getNestedValue(data, 'basicDetails.bidSize')}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Prospectus - Added from DetailsTab */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Prospectus</h2>
          <div className="space-y-2">
            {drhpUrl ? (
              <a 
                href={drhpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-800">{data.companyName} IPO DRHP</span>
              </a>
            ) : (
              <div className="flex items-center p-3 bg-gray-100 rounded-md opacity-50">
                <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-800">{data.companyName} IPO DRHP (Not Available)</span>
              </div>
            )}
            {rhpUrl ? (
              <a 
                href={rhpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-800">{data.companyName} IPO RHP</span>
              </a>
            ) : (
              <div className="flex items-center p-3 bg-gray-100 rounded-md opacity-50">
                <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-800">{data.companyName} IPO RHP (Not Available)</span>
              </div>
            )}
          </div>
        </div>

        {objectivesData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">IPO Objectives</h2>
            <div className="space-y-3">
              {objectivesData.map((row: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{row[0]}</span>
                    <span className="font-medium text-gray-800">{row[1]}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, idx * 30 + 40)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* IPO Partners - Moved below Prospectus */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-4">IPO Partners</h2>
          <div className="space-y-4">
            {leadManager && (
              <div className="bg-blue-50 rounded-lg p-3 transition-all hover:shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                      {leadManager.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">{leadManager}</h4>
                    <p className="text-xs font-medium text-blue-700 mt-0.5">Lead Manager</p>
                  </div>
                </div>
              </div>
            )}
            
            {registrarName && (
              <div className="bg-purple-50 rounded-lg p-3 transition-all hover:shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 border border-purple-200 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg">
                      {registrarName.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">{registrarName}</h4>
                    <p className="text-xs font-medium text-purple-700 mt-0.5">Registrar</p>
                    {registrarEmail && (
                      <a 
                        href={`mailto:${registrarEmail}`} 
                        className="text-xs text-purple-600 hover:text-purple-800 hover:underline mt-1 inline-block"
                      >
                        {registrarEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shareholding Structure - Minimalist version */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Shareholding Structure</h2>
          
          {/* Pre-Issue Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Pre-Issue</h3>
              <span className="text-sm font-bold text-gray-800">{preIssuePromoterPercentage}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${preIssuePromoterPercentage}%` }}
              ></div>
            </div>
            
            <div className="mt-2">
              {getNestedValue(data, 'shareHoldingPreIssueAll') ? (
                getNestedValue(data, 'shareHoldingPreIssueAll').map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs mt-1">
                    <span className="text-gray-600">{item.label.replace('Share Holding Pre Issue', 'Total Shares')}</span>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-600">Promoter Holding</span>
                  <span className="font-medium text-gray-800">{preIssue || 'N/A'}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Post-Issue Section */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Post-Issue</h3>
              <span className="text-sm font-bold text-gray-800">{postIssuePromoterPercentage}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${postIssuePromoterPercentage}%` }}
              ></div>
            </div>
            
            <div className="mt-2">
              {getNestedValue(data, 'shareHoldingPostIssueAll') ? (
                getNestedValue(data, 'shareHoldingPostIssueAll').map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs mt-1">
                    <span className="text-gray-600">{item.label.replace('Share Holding Post Issue', 'Total Shares')}</span>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-600">Promoter Holding</span>
                  <span className="font-medium text-gray-800">{postIssue || 'N/A'}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Simple difference */}
          {preIssuePromoterPercentage && postIssuePromoterPercentage && (
            <div className="text-xs text-gray-600 mt-1">
              <span className="inline-block mr-1">Dilution:</span>
              <span className="font-medium text-gray-800">
                {Math.abs(preIssuePromoterPercentage - postIssuePromoterPercentage).toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* Contact Details - Keep from existing sidebar */}
        {(address || phone || email || website) && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Contact Details</h2>
            <div className="space-y-2">
              {address && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-gray-500 mt-0.5 mr-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">{address}</span>
                </div>
              )}
              
              {phone && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-gray-500 mt-0.5 mr-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">{phone}</span>
                </div>
              )}
              
              {email && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-gray-500 mt-0.5 mr-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">{email}</span>
                </div>
              )}
              
              {website && (
                <a 
                  href={website.startsWith('http') ? website : `https://${website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start text-blue-600 hover:underline"
                >
                  <div className="flex-shrink-0 text-gray-500 mt-0.5 mr-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <span className="text-sm">{website}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab; 