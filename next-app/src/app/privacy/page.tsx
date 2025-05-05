import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | IPOHut',
  description: 'Our privacy policy outlines how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          
          <div className="prose max-w-none text-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to IPOHut (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
            <p>
              This policy is compliant with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act (DPDPA).
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>
            <p>We collect several types of information from and about users of our website, including:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li><strong>Personal Identifiable Information:</strong> Name, email address, phone number, and other contact details that you provide when registering on our website, subscribing to our newsletter, or filling in forms.</li>
              <li><strong>Non-Personal Identifiable Information:</strong> IP address, browser type, device information, operating system, and browsing patterns.</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies to enhance your experience on our website. For more details, please refer to our Cookie Policy section below.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Send you emails and other communications regarding IPO alerts, updates, and marketing</li>
              <li>Find and prevent fraud</li>
              <li>Respond to your comments or inquiries</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please note that no electronic transmission or storage of information can be entirely secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. Cookie Policy</h2>
            <p>
              Cookies are small files placed on your device when you visit our website. We use cookies to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you interact with our website</li>
              <li>Analyze and improve our website</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
            <p className="mt-2">
              You can control cookies through your browser settings. However, if you block certain cookies, you may not be able to use all the features of our website.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6. Third-Party Disclosure</h2>
            <p>
              We may share your personal information with:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Service providers who perform functions on our behalf (e.g., hosting, data analysis, payment processing)</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>Law enforcement or regulatory agencies when required by law</li>
              <li>Analytics providers to help us understand website usage</li>
            </ul>
            <p className="mt-2">
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as described in this policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">7. Your Rights Under DPDPA</h2>
            <p>
              Under the Digital Personal Data Protection Act, you have the right to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li>Withdraw consent for processing your data</li>
              <li>File complaints with the relevant data protection authority</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, please contact us using the details provided in the &quot;Contact Us&quot; section.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">8. Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">9. Changes to Our Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this privacy policy periodically.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions or concerns about our privacy policy or data practices, please contact us through the contact form on our website.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">11. Grievance Redressal</h2>
            <p>
              In accordance with the IT Rules 2011, you can reach our Grievance Officer through the contact form on our website by selecting "Legal and Compliance" as the subject.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 