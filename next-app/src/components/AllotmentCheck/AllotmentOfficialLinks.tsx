'use client';

interface AllotmentOfficialLinksProps {
  registrarName: string;
  registrarWebsite?: string;
  registrarEmail?: string;
  registrarPhone?: string;
  companyName: string;
}

export default function AllotmentOfficialLinks({
  registrarName,
  registrarWebsite,
  registrarEmail,
  registrarPhone,
  companyName
}: AllotmentOfficialLinksProps) {
  return (
    <div className="space-y-5">
      {/* Registrar Website */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Registrar Website</h3>
        {registrarWebsite ? (
          <a 
            href={registrarWebsite.startsWith('http') ? registrarWebsite : `https://${registrarWebsite}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Check on {registrarName} website
          </a>
        ) : (
          <p className="text-sm text-gray-500">Registrar website not available</p>
        )}
      </div>
      
      {/* BSE */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">BSE</h3>
        <a 
          href="https://www.bseindia.com/investors/appli_check.aspx" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Check on BSE website
        </a>
      </div>
      
      {/* NSE */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">NSE</h3>
        <a 
          href="https://www.nseindia.com/products/dynaContent/equities/ipos/ipo_login.jsp" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Check on NSE website
        </a>
      </div>
      
      {/* Contact Information */}
      {(registrarEmail || registrarPhone) && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Contact {registrarName}</h3>
          <div className="space-y-2">
            {registrarEmail && (
              <a 
                href={`mailto:${registrarEmail}`} 
                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {registrarEmail}
              </a>
            )}
            {registrarPhone && (
              <a 
                href={`tel:${registrarPhone}`} 
                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {registrarPhone}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 