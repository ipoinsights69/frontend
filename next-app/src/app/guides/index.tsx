import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IPO Knowledge Center | IPOHut',
  description: 'Comprehensive educational resources for IPO investors - learn about IPO basics, application process, evaluation, allotment, and market strategies.',
};

export default function GuidesPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-600">Guides</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">IPO Knowledge Center</h1>
          <p className="text-gray-600 mb-6">
            Welcome to IPOHut's knowledge center, your comprehensive resource for understanding all aspects of
            Initial Public Offerings in India. Browse our detailed guides to make informed investment decisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/guides/ipo-basics"
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-blue-600 flex items-center justify-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">IPO Basics</h2>
                <p className="text-gray-600 text-sm mb-3">
                  A comprehensive introduction to IPOs, their purpose, benefits, risks, and the IPO process in India.
                </p>
                <div className="text-blue-600 text-sm font-medium flex items-center">
                  Read guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link 
              href="/guides/ipo-application"
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-green-600 flex items-center justify-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">IPO Application Process</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Step-by-step guide to applying for IPOs through UPI, ASBA, online platforms, and more.
                </p>
                <div className="text-blue-600 text-sm font-medium flex items-center">
                  Read guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link 
              href="/guides/ipo-evaluation"
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-purple-600 flex items-center justify-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Evaluating IPO Fundamentals</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Learn to assess IPO valuations, analyze company financials, and make informed investment decisions.
                </p>
                <div className="text-blue-600 text-sm font-medium flex items-center">
                  Read guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link 
              href="/guides/ipo-allotment"
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-yellow-600 flex items-center justify-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">IPO Allotment Process</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Understand how shares are allotted, how to check your application status, and post-allotment procedures.
                </p>
                <div className="text-blue-600 text-sm font-medium flex items-center">
                  Read guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link 
              href="/guides/ipo-glossary"
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-red-600 flex items-center justify-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">IPO Glossary</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Comprehensive guide to IPO terminology: DRHP, GMP, ASBA, listing gains, and other essential terms.
                </p>
                <div className="text-blue-600 text-sm font-medium flex items-center">
                  Read guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link 
              href="/guides/ipo-market-strategies"
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-cyan-600 flex items-center justify-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">IPO Market Strategies</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Expert insights on different IPO investment strategies from short-term listing gains to long-term growth.
                </p>
                <div className="text-blue-600 text-sm font-medium flex items-center">
                  Read guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-2">Stay Updated with IPO Alerts</h2>
              <p className="text-blue-100">
                Get notified about upcoming IPOs, allotment status, and listing updates directly in your inbox.
              </p>
            </div>
            <div>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 