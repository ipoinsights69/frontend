import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-indigo-100 text-indigo-600 font-medium px-4 py-2 rounded-full text-sm">
                What's new
              </div>
              <div className="flex items-center text-gray-600">
                Latest IPO listings
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Discover Your Next<br />Investment Opportunity
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Track, analyze, and compare IPOs with real-time data and expert insights. 
              Stay ahead in the market with our comprehensive IPO analysis platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/get-started" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md transition">
                Get started
              </Link>
              <Link href="/upcoming-ipos" className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition">
                View upcoming IPOs
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
              <div className="flex bg-white p-4 border-b border-gray-200">
                <div className="text-indigo-600 mr-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 10h16M10 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Search IPOs..." 
                    className="w-full border border-gray-200 rounded-md px-3 py-1 text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-12 min-h-[400px]">
                <div className="col-span-4 border-r border-gray-200 p-4">
                  <h3 className="text-sm text-gray-500 mb-4">IPO Categories</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-indigo-600 font-medium">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 6l-8 6 8 6V6z" fill="currentColor"/>
                      </svg>
                      <span>Upcoming IPOs</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-700">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Recent Listings</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-700">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 20V10M18 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Best Performers</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-700">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Market Analysis</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-8 p-4">
                  <h3 className="text-lg font-medium mb-4">Hot IPOs This Week</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-800">TechVision Inc.</span>
                      </div>
                      <span className="text-sm text-green-500 font-medium">+24.6%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span className="text-gray-800">Global Healthcare Ltd.</span>
                      </div>
                      <span className="text-sm text-amber-500 font-medium">+8.3%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-800">FutureMobility Inc.</span>
                      </div>
                      <span className="text-sm text-green-500 font-medium">+31.2%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span className="text-gray-800">EcoEnergy Solutions</span>
                      </div>
                      <span className="text-sm text-red-500 font-medium">-5.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 