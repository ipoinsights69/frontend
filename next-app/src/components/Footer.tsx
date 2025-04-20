import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="text-indigo-600 flex items-center mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="6" height="16" rx="1" fill="currentColor" />
                <rect x="13" y="4" width="6" height="24" rx="1" fill="currentColor" />
                <rect x="22" y="12" width="6" height="16" rx="1" fill="currentColor" />
                <path d="M6 5L26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 24L28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="ml-2 text-xl font-bold">IPO Insights</span>
            </div>
            <p className="text-gray-600 mb-4">
              Your comprehensive resource for IPO analysis and information. 
              Track, analyze, and make informed investment decisions with real-time data.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-800">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.196 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">IPO Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">IPO Calendar</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Recent Listings</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Upcoming IPOs</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Filing Status</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Market Data</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Market Analysis</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Sector Performance</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Trends & Forecasts</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Economic Indicators</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Our Team</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} IPO Insights. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 