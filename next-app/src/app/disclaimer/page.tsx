import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | IPOHut',
  description: 'Important disclaimers about the information provided on IPOHut and its intended use.',
};

export default function Disclaimer() {
  return (
    <main className="bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Disclaimer</h1>
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          
          <div className="prose max-w-none text-gray-700">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="font-semibold text-yellow-800">
                PLEASE READ THIS DISCLAIMER CAREFULLY BEFORE USING OUR WEBSITE
              </p>
              <p className="mt-2 text-yellow-700">
                The information provided on IPOHut is for general informational and educational purposes only. It is not intended to be and should not be construed as financial, investment, or trading advice.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Not Financial Advice</h2>
            <p>
              The content on IPOHut is provided for informational and educational purposes only. Nothing on this website constitutes financial advice, investment advice, trading advice, or any other sort of advice, and you should not treat any of the website's content as such.
            </p>
            <p className="mt-2">
              IPOHut does not recommend that any security, investment product, or strategy is suitable for any specific person. You are solely responsible for determining whether any investment, investment strategy, security, or related transaction is appropriate for you based on your personal investment objectives, financial circumstances, and risk tolerance.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Investment Risks</h2>
            <p>
              Investing in Initial Public Offerings (IPOs) involves substantial risk, including the possible loss of principal. IPO investments may be subject to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>High volatility and potential for significant price fluctuations</li>
              <li>Limited operating history of the issuing company</li>
              <li>Market liquidity risks</li>
              <li>Regulatory and compliance risks</li>
              <li>Information asymmetry between issuers and investors</li>
            </ul>
            <p className="mt-2">
              Past performance is not indicative of future results. The potential for profit is accompanied by the possibility of loss.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. Accuracy of Information</h2>
            <p>
              While we strive to provide accurate, complete, and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on our website for any purpose.
            </p>
            <p className="mt-2">
              The information on our website may contain errors, inaccuracies, or typographical errors. We may make changes to the content at any time without notice. However, we do not guarantee that our website will be updated with the most current information.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Grey Market Premium (GMP) Disclaimer</h2>
            <p>
              Any information about Grey Market Premium (GMP) provided on our website is:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Unofficial and not recognized by any regulatory authority including SEBI</li>
              <li>Based on unofficial sources and speculative in nature</li>
              <li>Not guaranteed to be accurate, reliable, or indicative of listing gains</li>
              <li>Subject to change without notice based on market conditions and investor sentiment</li>
              <li>Not to be used as the sole basis for making investment decisions</li>
            </ul>
            <p className="mt-2 font-medium">
              IPOHut does not endorse, recommend, or guarantee any GMP information provided on the website.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. Third-Party Content</h2>
            <p>
              Our website may contain links to third-party websites, content from external sources, or advertisements. These links are provided for your convenience and information only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
            </p>
            <p className="mt-2">
              The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6. User Responsibility</h2>
            <p>
              By using IPOHut, you acknowledge and agree that:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>You will conduct your own research and due diligence before making any investment decisions</li>
              <li>You will consult with a qualified financial advisor, investment advisor, or tax professional regarding your specific financial situation</li>
              <li>You understand the risks involved in investing in IPOs and the financial markets</li>
              <li>You are solely responsible for any investment decisions made based on the information provided on our website</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">7. No Fiduciary Relationship</h2>
            <p>
              Your use of our website does not create a fiduciary relationship between you and IPOHut or any of its representatives. We are not acting as your financial advisor, investment advisor, or in any fiduciary capacity.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, IPOHut and its directors, officers, employees, and agents shall not be liable for any direct, indirect, incidental, consequential, or punitive damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Your use of, or inability to use, our website</li>
              <li>Any investment decisions made based on the information provided on our website</li>
              <li>Any errors, inaccuracies, or omissions in the content</li>
              <li>Any actions taken in reliance on the content</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">9. Compliance with Regulations</h2>
            <p>
              IPOHut is an informational platform and not a registered investment advisor, broker-dealer, or financial institution. We do not provide personalized investment advice or solicit the purchase or sale of securities.
            </p>
            <p className="mt-2">
              The information provided on our website is general in nature and does not take into account your specific circumstances, objectives, or needs.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">10. Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time without notice. Your continued use of our website following any changes indicates your acceptance of the revised disclaimer.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">11. Contact Information</h2>
            <p>
              If you have any questions or concerns about this disclaimer, please contact us through our Contact page.
            </p>
            
            <div className="bg-gray-100 p-4 rounded-lg mt-8">
              <p className="font-semibold">
                BY USING IPOHUT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS DISCLAIMER.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 