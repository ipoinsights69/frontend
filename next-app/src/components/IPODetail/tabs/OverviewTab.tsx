import { IPODetailedData } from '@/app/types/IPO';
import { getNestedValue } from '@/utils/getNestedValue';

interface OverviewTabProps {
  data: IPODetailedData;
}

const OverviewTab = ({ data }: OverviewTabProps) => {
  // Get about company data
  const description = data.description || '';
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
  
  // Get contact details
  const address = getNestedValue(data, 'contactDetails.full_address') || '';
  const phone = getNestedValue(data, 'contactDetails.phone') || '';
  const email = getNestedValue(data, 'contactDetails.email') || '';
  const website = getNestedValue(data, 'contactDetails.website') || '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* About the Company */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">About {data.companyName}</h2>
          <div className="text-sm text-gray-600 space-y-3">
            {description.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {businessSegments.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Business Segments</h2>
            <div className="space-y-3">
              {businessSegments.map((segment: any, idx: number) => (
                <div key={idx} className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mt-0.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">{segment.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {competitiveStrengths.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Competitive Strengths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {competitiveStrengths.map((strength: string, idx: number) => (
                <div key={idx} className="flex items-start">
                  <div className="flex-shrink-0 text-green-500 mt-0.5 mr-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
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

        {promoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Promoter Information</h2>
            <p className="text-sm text-gray-600 mb-3">{promoters.join(', ')} {promoters.length > 1 ? 'are the promoters' : 'is the promoter'} of the company.</p>
            
            <div className="space-y-2">
              {preIssue && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pre-Issue Holding</span>
                  <span className="text-sm font-medium text-gray-800">{preIssue}</span>
                </div>
              )}
              {postIssue && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Post-Issue Holding</span>
                  <span className="text-sm font-medium text-gray-800">{postIssue}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 h-32 flex items-center justify-center">
              <div className="text-sm text-gray-500">Promoter holding visualization will appear here</div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Contact Information</h2>
          <div className="space-y-2 text-sm">
            {address && (
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 ml-2">{address}</span>
              </div>
            )}
            {phone && (
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 ml-2">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 ml-2">{email}</span>
              </div>
            )}
            {website && (
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-2">
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab; 