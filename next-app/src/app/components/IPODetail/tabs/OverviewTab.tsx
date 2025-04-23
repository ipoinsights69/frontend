import React from 'react';

interface OverviewTabProps {
  ipoData: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ ipoData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* About the Company and Business Segments */}
      <div className="lg:col-span-2 space-y-6">
        {/* About the Company */}
        {ipoData.about?.details && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">About {ipoData.company_name}</h2>
            <div 
              className="text-sm text-gray-600 space-y-3"
              dangerouslySetInnerHTML={{ __html: ipoData.about.details }}
            />
          </div>
        )}

        {/* Business Segments */}
        {ipoData.business_segments && ipoData.business_segments.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Business Segments</h2>
            <div className="space-y-3">
              {ipoData.business_segments.map((segment: any, index: number) => (
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

        {/* Competitive Strengths */}
        {ipoData.competitive_strengths && ipoData.competitive_strengths.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Competitive Strengths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ipoData.competitive_strengths.map((strength: string, index: number) => (
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
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* IPO Objectives */}
        {ipoData.ipo_objectives && ipoData.ipo_objectives.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">IPO Objectives</h2>
            <div className="space-y-3">
              {ipoData.ipo_objectives.map((objective: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{objective.name}</span>
                    <span className="font-medium text-gray-800">
                      ₹{(objective.amount / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${objective.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Promoter Information */}
        {ipoData.promoters && ipoData.promoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Promoter Information</h2>
            <p className="text-sm text-gray-600 mb-3">
              {ipoData.promoters.join(', ')} {ipoData.promoters.length > 1 ? 'are' : 'is'} the promoter{ipoData.promoters.length > 1 ? 's' : ''} of the company.
            </p>
            
            {ipoData.promoter_holding_pre && ipoData.promoter_holding_post && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pre-Issue Holding</span>
                  <span className="text-sm font-medium text-gray-800">{ipoData.promoter_holding_pre.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Post-Issue Holding</span>
                  <span className="text-sm font-medium text-gray-800">{ipoData.promoter_holding_post.toFixed(2)}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact Information */}
        {ipoData.contact && (
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <h2 className="text-base font-medium text-gray-800 mb-3">Contact Information</h2>
            <div className="space-y-2 text-sm">
              {ipoData.contact.address && (
                <div className="flex">
                  <i className="fas fa-map-marker-alt text-gray-400 w-5"></i>
                  <span className="text-gray-600 ml-2">{ipoData.contact.address}</span>
                </div>
              )}
              {ipoData.contact.phone && (
                <div className="flex">
                  <i className="fas fa-phone text-gray-400 w-5"></i>
                  <span className="text-gray-600 ml-2">{ipoData.contact.phone}</span>
                </div>
              )}
              {ipoData.contact.email && (
                <div className="flex">
                  <i className="fas fa-envelope text-gray-400 w-5"></i>
                  <span className="text-gray-600 ml-2">{ipoData.contact.email}</span>
                </div>
              )}
              {ipoData.contact.website && (
                <div className="flex">
                  <i className="fas fa-globe text-gray-400 w-5"></i>
                  <a href={ipoData.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-2">
                    {ipoData.contact.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab; 