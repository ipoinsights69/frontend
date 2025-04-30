import React from 'react';
import { IPODetailedData } from '@/app/types/IPO';

interface OverviewTabProps {
  ipoData: IPODetailedData;
  formattedData?: Record<string, any>;
  config?: {
    sections: Record<string, boolean>;
    fieldsMapping: Record<string, Record<string, string>>;
    formatConfig: Record<string, any>;
  };
  showCompanyInfo?: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  ipoData, 
  formattedData = {}, 
  config,
  showCompanyInfo = false
}) => {
  // Get data from formatted structure or fallback to direct access
  const overviewData = formattedData?.overview || {};
  const companyData = formattedData?.company || {};
  
  // Determine which data to display based on the tab
  const description = showCompanyInfo ? 
    (companyData.description || ipoData.description) : 
    (overviewData.description || ipoData.description);
  
  const businessSegments = showCompanyInfo ? 
    (companyData.business || ipoData.business_segments) : 
    undefined;
  
  const competitiveStrengths = showCompanyInfo ? 
    (companyData.strengths || ipoData.competitive_strengths) : 
    undefined;
  
  const promoters = showCompanyInfo ? 
    (companyData.promoters || ipoData.promoters) : 
    undefined;
  
  // Get company name
  const companyName = ipoData.companyName || '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* About the Company and Business Segments */}
      <div className="lg:col-span-2 space-y-6">
        {/* About the Company */}
        {description && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">About {companyName}</h2>
            <div 
              className="text-sm text-gray-600 space-y-3"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {/* Business Segments - only show in company tab or if specified */}
        {showCompanyInfo && businessSegments && businessSegments.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Business Segments</h2>
            <div className="space-y-3">
              {businessSegments.map((segment: any, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mt-0.5">
                    <i className={`${segment.icon || 'fas fa-industry'} text-sm`}></i>
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

        {/* Competitive Strengths - only show in company tab or if specified */}
        {showCompanyInfo && competitiveStrengths && competitiveStrengths.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Competitive Strengths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {competitiveStrengths.map((strength: string, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 text-green-500 mt-0.5 mr-2">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <span className="text-sm text-gray-600">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Overview Details - only show in overview tab */}
        {!showCompanyInfo && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">IPO Details</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ipoData.openDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Open Date</h3>
                    <p className="text-sm text-gray-600">{ipoData.openDate}</p>
                  </div>
                )}
                
                {ipoData.closeDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Close Date</h3>
                    <p className="text-sm text-gray-600">{ipoData.closeDate}</p>
                  </div>
                )}
                
                {ipoData.listingDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Listing Date</h3>
                    <p className="text-sm text-gray-600">{ipoData.listingDate}</p>
                  </div>
                )}
                
                {ipoData.issueType && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Issue Type</h3>
                    <p className="text-sm text-gray-600">{ipoData.issueType}</p>
                  </div>
                )}
                
                {ipoData.priceRange && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Price Range</h3>
                    <p className="text-sm text-gray-600">
                      ₹{ipoData.priceRange.min === ipoData.priceRange.max ? 
                        ipoData.priceRange.min : 
                        `${ipoData.priceRange.min}-${ipoData.priceRange.max}`}
                    </p>
                  </div>
                )}
                
                {ipoData.lotSize && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Lot Size</h3>
                    <p className="text-sm text-gray-600">{ipoData.lotSize} shares</p>
                  </div>
                )}
                
                {ipoData.issueSize && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Issue Size</h3>
                    <p className="text-sm text-gray-600">₹{ipoData.issueSize} Cr</p>
                  </div>
                )}
                
                {ipoData.listingAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Listing At</h3>
                    <p className="text-sm text-gray-600">{ipoData.listingAt}</p>
                  </div>
                )}
                
                {ipoData.leadManager && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Lead Manager</h3>
                    <div 
                      className="text-sm text-gray-600"
                      dangerouslySetInnerHTML={{ __html: ipoData.leadManager }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Promoter Information */}
        {showCompanyInfo && promoters && promoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Promoter Information</h2>
            <p className="text-sm text-gray-600 mb-3">
              {promoters.join(', ')} {promoters.length > 1 ? 'are' : 'is'} the promoter{promoters.length > 1 ? 's' : ''} of the company.
            </p>
          </div>
        )}

        {/* Contact Information */}
        {ipoData.registrarDetails && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Registrar Information</h2>
            <div className="space-y-2 text-sm">
              {ipoData.registrarDetails.name && (
                <div className="flex">
                  <i className="fas fa-building text-gray-400 w-5"></i>
                  <span className="text-gray-600 ml-2">{ipoData.registrarDetails.name}</span>
                </div>
              )}
              {ipoData.registrarDetails.phone && (
                <div className="flex">
                  <i className="fas fa-phone text-gray-400 w-5"></i>
                  <span className="text-gray-600 ml-2">{ipoData.registrarDetails.phone}</span>
                </div>
              )}
              {ipoData.registrarDetails.email && (
                <div className="flex">
                  <i className="fas fa-envelope text-gray-400 w-5"></i>
                  <span className="text-gray-600 ml-2">{ipoData.registrarDetails.email}</span>
                </div>
              )}
              {ipoData.registrarDetails.website && (
                <div className="flex">
                  <i className="fas fa-globe text-gray-400 w-5"></i>
                  <a href={ipoData.registrarDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-2">
                    {ipoData.registrarDetails.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Prospectus Links */}
        {ipoData.prospectus_links && ipoData.prospectus_links.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Prospectus Links</h2>
            <div className="space-y-2">
              {ipoData.prospectus_links.map((link, index) => (
                <div key={index} className="flex items-center text-sm">
                  <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab; 