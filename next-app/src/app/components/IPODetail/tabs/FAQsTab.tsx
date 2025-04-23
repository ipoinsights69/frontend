'use client';

import React, { useState } from 'react';

interface FAQsTabProps {
  ipoData: any;
}

const FAQsTab: React.FC<FAQsTabProps> = ({ ipoData }) => {
  // Get FAQs data
  const faqs = ipoData.faqs || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No FAQs available</h3>
        <p className="text-gray-600">Frequently asked questions about this IPO will be added soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-800">Frequently Asked Questions</h2>
        <p className="text-xs text-gray-500 mt-1">Common questions about {ipoData.company_name} IPO</p>
      </div>

      <div className="p-4 divide-y divide-gray-200">
        {faqs.map((faq: any, index: number) => (
          <div key={index} className="py-3">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-start w-full text-left"
            >
              <h3 className="text-sm font-medium text-gray-800">{faq.question}</h3>
              <span className="ml-4 flex-shrink-0">
                <svg
                  className={`h-5 w-5 transition-transform duration-200 ${openIndex === index ? 'transform rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
            {openIndex === index && (
              <div className="mt-2 text-sm text-gray-600">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQsTab; 