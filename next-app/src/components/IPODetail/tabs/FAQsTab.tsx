import { useState } from 'react';
import { IPODetailedData } from '@/app/types/IPO';

interface FAQsTabProps {
  data: IPODetailedData;
}

const FAQsTab = ({ data }: FAQsTabProps) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const faqs = data.faqs || [];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  if (faqs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-6 flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">No FAQs available for this IPO.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-800">Frequently Asked Questions</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-800">{faq.question}</h3>
              <svg 
                className={`h-4 w-4 text-gray-400 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {openFAQ === index && (
              <div className="mt-2 text-sm text-gray-600">
                {typeof faq.answer === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                ) : (
                  <p>{faq.answer}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQsTab; 