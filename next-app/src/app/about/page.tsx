import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | IPOHut',
  description: 'Learn about IPOHut - a comprehensive source for IPO information and insights.',
};

export default function AboutUs() {
  return (
    <main className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 md:p-12 mb-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About IPOHut</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              A comprehensive destination for accurate and timely information on Initial Public Offerings (IPOs).
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Our Mission */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                At IPOHut, our mission is to provide retail investors with comprehensive, unbiased, and easily accessible information about IPOs. We believe that everyone should have equal access to quality information about public offerings, regardless of their investment experience or financial background.
              </p>
              <p className="mt-4">
                We strive to bridge the knowledge gap by delivering timely, accurate, and well-researched IPO data and analysis, enabling investors to make informed decisions based on facts.
              </p>
            </div>
          </section>

          {/* About Our Platform */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Our Platform</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                IPOHut is a platform dedicated to providing comprehensive information about Initial Public Offerings. Our goal is to help investors navigate the complex world of IPOs with confidence and clarity.
              </p>
              <p className="mt-4">
                The platform offers detailed data about upcoming, ongoing, and past IPOs, allowing users to stay informed about the latest developments in the IPO market.
              </p>
            </div>
          </section>

          {/* Our Approach */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Accuracy</h3>
                <p className="text-sm text-gray-700">
                  We source information directly from official filings, exchange notifications, and company prospectuses to ensure accuracy before publication.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unbiased Analysis</h3>
                <p className="text-sm text-gray-700">
                  Our analysis is independent and objective. We apply the same evaluation framework to all offerings regardless of company size or sector.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Focus</h3>
                <p className="text-sm text-gray-700">
                  We believe in empowering investors through education. Our content explains complex IPO concepts in accessible language, helping investors build their knowledge.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-sm text-gray-700">
                  We believe in complete transparency about our data sources, analysis methodology, and limitations of the information we provide.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-sm text-gray-700">
                  We make complex financial information accessible to investors of all backgrounds and experience levels.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
                <p className="text-sm text-gray-700">
                  We maintain high ethical standards in all our analysis and content, prioritizing accuracy and investor interests.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-700">
                  We continuously improve our platform and tools to provide investors with the best possible resources for IPO decision-making.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 