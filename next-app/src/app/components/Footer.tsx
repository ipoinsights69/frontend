import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-blue-600 text-white rounded-md flex items-center justify-center mr-3">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <span className="text-xl font-semibold text-gray-800">IPO<span className="text-blue-600">Insight</span></span>
            </div>
            <p className="text-gray-600 mb-6">
              Comprehensive tracking and analysis of initial public offerings worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <i className="fab fa-linkedin-in text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <i className="fab fa-instagram text-lg"></i>
              </a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest IPO insights.</p>
            <form className="space-y-3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 w-full rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="bg-gray-50 border-t border-gray-200 py-4">
        <div className="container mx-auto px-6">
          <div className="text-xs text-gray-600 leading-relaxed">
            <h4 className="font-medium mb-1">DISCLAIMER</h4>
            <p>
              No financial information whatsoever published anywhere within this application should be considered as advice to buy or sell securities or invest in IPOs, or as a guide to doing so in any way whatsoever. All matter published here is purely for educational and informational purposes only and under no circumstances should be used for making investment decisions. We are not a SEBI-registered analyst. Readers must consult a qualified financial advisor prior to making any actual investment decisions based on information published on this application. The information in the app is based on publicly available data and market perceptions as of the date shown. By using this app, you agree to the terms and conditions.
            </p>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} IPOInsight. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">Home</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 