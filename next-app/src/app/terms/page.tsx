import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | IPOHut',
  description: 'Our terms and conditions outline the rules, guidelines, and agreements for using the IPOHut website.',
};

export default function TermsAndConditions() {
  return (
    <main className="bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          
          <div className="prose max-w-none text-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              Welcome to IPOHut. By accessing and using our website, you accept and agree to be bound by these Terms and Conditions ("Terms"), our Privacy Policy, and any other policies referenced herein. If you do not agree to these Terms, please do not use our website.
            </p>
            <p className="mt-2">
              These Terms constitute a legally binding agreement between you and IPOHut. We reserve the right to modify these Terms at any time without notice. Your continued use of the website following any changes indicates your acceptance of the revised Terms.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Description of Services</h2>
            <p>
              IPOHut is an information platform providing data, analysis, and educational content related to Initial Public Offerings (IPOs) in India. Our services include, but are not limited to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Information about upcoming, ongoing, and closed IPOs</li>
              <li>IPO performance tracking and analysis</li>
              <li>Educational content about investing in IPOs</li>
              <li>IPO alerts and notifications</li>
              <li>General market information related to IPOs</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. User Accounts</h2>
            <p>
              To access certain features of our website, you may be required to create a user account. When creating an account, you agree to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your account credentials secure and confidential</li>
              <li>Not share your account with others</li>
              <li>Be solely responsible for all activities under your account</li>
            </ul>
            <p className="mt-2">
              We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Intellectual Property Rights</h2>
            <p>
              All content on IPOHut, including but not limited to text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of IPOHut or its content suppliers and is protected by Indian and international copyright laws.
            </p>
            <p className="mt-2">
              You may access, download, or print content from our website for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any content without our express written permission.
            </p>
            <p className="mt-2">
              The IPOHut name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of IPOHut or its affiliates. You must not use such marks without our prior written permission.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. Permitted and Prohibited Uses</h2>
            <p>
              <strong>Permitted Uses:</strong>
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Access and view content for personal, non-commercial purposes</li>
              <li>Use our services as intended and described on the website</li>
              <li>Share links to our content through social media or email</li>
            </ul>
            
            <p className="mt-4">
              <strong>Prohibited Uses:</strong>
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Use our website in any way that violates applicable laws or regulations</li>
              <li>Access or attempt to access protected areas of the website without authorization</li>
              <li>Engage in any activity that disrupts or interferes with our website, servers, or networks</li>
              <li>Attempt to reverse engineer, decompile, or disassemble any part of our website</li>
              <li>Collect or harvest any personally identifiable information from our website</li>
              <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of our website</li>
              <li>Use our website to transmit any malware, spyware, or other harmful code</li>
              <li>Impersonate or attempt to impersonate IPOHut, an IPOHut employee, or another user</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6. Disclaimer of Warranties</h2>
            <p>
              Our website and all content, products, and services included on or otherwise made available to you through our website are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied.
            </p>
            <p className="mt-2">
              We do not guarantee the accuracy, completeness, or reliability of any content on our website. The information presented may contain errors, omissions, or outdated information. You acknowledge that any reliance on such information is at your own risk.
            </p>
            <p className="mt-2 font-medium">
              In particular, we make no representations or warranties about the accuracy, reliability, completeness, or timeliness of the IPO-related information provided on our website. All investment decisions should be made after consulting appropriate financial advisors and conducting your own research.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, in no event shall IPOHut or its directors, officers, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Your access to or use of, or inability to access or use, our website</li>
              <li>Any conduct or content of any third party on our website</li>
              <li>Any content obtained from our website</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Any investment or financial decisions made based on information from our website</li>
            </ul>
            <p className="mt-2 font-medium">
              Our total liability to you for all claims arising from or related to your use of our website shall not exceed the amount paid by you, if any, for accessing our website.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless IPOHut and its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another</li>
              <li>Your use of our website</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India, for the resolution of any disputes arising out of or relating to these Terms or your use of our website.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">10. Termination</h2>
            <p>
              We may terminate or suspend your access to all or part of our website, without notice, for any conduct that we, in our sole discretion, believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">11. Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid, illegal, or unenforceable, such provision shall be struck from these Terms, and the remaining provisions shall remain in full force and effect.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">12. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other policies incorporated by reference, constitute the entire agreement between you and IPOHut regarding your use of our website and supersede all prior communications, agreements, or understandings, whether oral or written.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">13. Contact Information</h2>
            <p>
              If you have any questions or concerns about these Terms, please contact us through our Contact page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 