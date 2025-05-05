import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IPO Basics Guide | IPOHut',
  description: 'Learn about Initial Public Offerings (IPOs), how they work, benefits, risks, and everything you need to know before investing in IPOs in India.',
};

export default function IPOBasicsPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href="/guides" className="text-blue-600 hover:text-blue-800">Guides</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-600">IPO Basics</span>
        </div>

        <article className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">IPO Basics: Understanding Initial Public Offerings</h1>
          
          <div className="prose max-w-none">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="mr-2">Last Updated:</span>
              <time dateTime="2023-05-15">May 15, 2023</time>
              <span className="mx-2">•</span>
              <span>12 min read</span>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-700">
                This guide provides a comprehensive introduction to Initial Public Offerings (IPOs) in India. 
                Whether you're a first-time investor or looking to deepen your understanding, this article covers 
                everything from the basics to the nuances of the IPO process.
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-3 mt-6" id="what-is-ipo">What is an IPO?</h2>
            <p>
              An Initial Public Offering (IPO) is the process through which a privately held company becomes publicly traded by offering its shares to the general public for the first time. This transition marks a significant milestone in a company's growth journey, allowing it to raise capital from public investors.
            </p>
            <p>
              During an IPO, a company issues new shares, existing shareholders might sell some of their holdings, or both. These shares are then listed on stock exchanges like the National Stock Exchange (NSE) and Bombay Stock Exchange (BSE), where they can be bought and sold by retail investors, institutional investors, and other market participants.
            </p>

            <h2 className="text-xl font-semibold mb-3 mt-6" id="why-companies-go-public">Why Do Companies Go Public?</h2>
            <p>Companies choose to go public for several strategic reasons:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Capital Raising:</strong> The primary reason for most IPOs is to raise substantial capital for business expansion, debt reduction, research and development, or acquisitions.
              </li>
              <li>
                <strong>Liquidity for Existing Shareholders:</strong> IPOs provide an exit opportunity for early investors like venture capitalists and angel investors, allowing them to realize returns on their investments.
              </li>
              <li>
                <strong>Enhanced Public Profile:</strong> Being a publicly traded company increases visibility, credibility, and brand recognition, which can benefit business relationships and customer acquisition.
              </li>
              <li>
                <strong>Currency for Acquisitions:</strong> Public companies can use their stock as currency for acquiring other businesses, often more easily than private companies.
              </li>
              <li>
                <strong>Employee Recruitment and Retention:</strong> Public companies can offer stock options and equity incentives, which can help attract and retain top talent.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-3 mt-6" id="ipo-process">The IPO Process in India</h2>
            <p>
              The journey from being a private company to listing on a stock exchange involves several stages:
            </p>

            <div className="relative overflow-hidden mb-8 mt-4">
              <div className="relative overflow-x-auto">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">1</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Preparation</h3>
                    <p className="text-sm text-gray-600">Company restructuring, corporate governance setup, financial audit</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">2</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hiring Underwriters</h3>
                    <p className="text-sm text-gray-600">Selecting investment banks to manage the offering</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">3</div>
                    <h3 className="font-semibold text-gray-900 mb-1">DRHP Filing</h3>
                    <p className="text-sm text-gray-600">Submitting Draft Red Herring Prospectus to SEBI</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">4</div>
                    <h3 className="font-semibold text-gray-900 mb-1">SEBI Approval</h3>
                    <p className="text-sm text-gray-600">Addressing regulator's comments and receiving clearance</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">5</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Marketing</h3>
                    <p className="text-sm text-gray-600">Roadshows and book building to generate investor interest</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">6</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Pricing</h3>
                    <p className="text-sm text-gray-600">Setting final price band and issue size</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">7</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Subscription</h3>
                    <p className="text-sm text-gray-600">Opening the IPO for public subscription</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">8</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Allotment</h3>
                    <p className="text-sm text-gray-600">Share allocation to successful applicants</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2">9</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Listing</h3>
                    <p className="text-sm text-gray-600">Trading begins on stock exchanges</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2 mt-4">1. Preparation Phase</h3>
            <p>
              Before initiating an IPO, a company must ensure it meets the eligibility criteria set by SEBI and stock exchanges. This typically includes having:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>A minimum net tangible assets of ₹3 crore</li>
              <li>A minimum average operating profit of ₹15 crore during the preceding three years</li>
              <li>A net worth of at least ₹1 crore in each of the preceding three years</li>
              <li>If the company doesn't meet the profit criteria, it needs at least 75% of the issue size allocated to Qualified Institutional Buyers (QIBs)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">2. Hiring Investment Bankers</h3>
            <p>
              The company appoints investment banks as Book Running Lead Managers (BRLMs) who guide the company through the entire IPO process, help determine the issue price, and market the offering to potential investors.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">3. Filing Draft Red Herring Prospectus (DRHP)</h3>
            <p>
              The DRHP is a comprehensive document submitted to SEBI containing detailed information about:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>The company's business operations and financial performance</li>
              <li>Risk factors associated with the business</li>
              <li>Management structure and promoter background</li>
              <li>Objects of the issue (how the raised capital will be utilized)</li>
              <li>Legal proceedings and other material information</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">4. SEBI Review and Approval</h3>
            <p>
              SEBI examines the DRHP and may require clarifications or changes. Once SEBI provides its observations, the company can proceed with the IPO. This process typically takes 30-70 days.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">5. Marketing the IPO</h3>
            <p>
              The company and its BRLMs conduct roadshows and presentations to institutional investors to generate interest in the offering. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Investor meetings in major financial centers</li>
              <li>Presentations highlighting the company's business model, growth strategy, and investment thesis</li>
              <li>Media engagement to create awareness about the upcoming IPO</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">6. Price Band Determination</h3>
            <p>
              Based on investor feedback during roadshows and market conditions, the company and BRLMs set a price band for the shares being offered. The price band indicates the minimum and maximum share price at which investors can bid.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">7. Opening for Subscription</h3>
            <p>
              The IPO typically remains open for subscription for 3-5 working days. Investors can place bids within the specified price band.
            </p>

            <h3 className="text-lg font-semibold mb-2">8. Allotment Process</h3>
            <p>
              After the subscription period ends, shares are allotted to successful applicants based on the demand and specified criteria for different investor categories (retail, QIBs, NIIs).
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-4">9. Listing and Trading</h3>
            <p>
              The shares are listed on the stock exchanges and begin trading, usually within 6 working days after the IPO closing date.
            </p>

            <h2 className="text-xl font-semibold mb-3 mt-6" id="investor-categories">Investor Categories in IPOs</h2>
            <p>
              IPO shares are allocated across different investor categories:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse my-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Typical Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">Qualified Institutional Buyers (QIBs)</td>
                    <td className="border border-gray-200 px-4 py-2">Includes mutual funds, FIIs, insurance companies, and banks</td>
                    <td className="border border-gray-200 px-4 py-2">50% of the total issue</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">Non-Institutional Investors (NIIs)</td>
                    <td className="border border-gray-200 px-4 py-2">Individuals or entities investing more than ₹2 lakh</td>
                    <td className="border border-gray-200 px-4 py-2">15% of the total issue</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">Retail Individual Investors (RIIs)</td>
                    <td className="border border-gray-200 px-4 py-2">Individual investors applying for up to ₹2 lakh</td>
                    <td className="border border-gray-200 px-4 py-2">35% of the total issue</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">Anchor Investors</td>
                    <td className="border border-gray-200 px-4 py-2">Institutional investors who are offered shares before the IPO opens</td>
                    <td className="border border-gray-200 px-4 py-2">Up to 60% of the QIB portion</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold mb-3 mt-6" id="benefits-risks">Benefits and Risks of Investing in IPOs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Benefits</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Potential for high returns:</strong> Some IPOs deliver substantial listing gains and long-term appreciation.
                  </li>
                  <li>
                    <strong>Ground floor opportunity:</strong> Chance to invest in promising companies at an early stage of their public life.
                  </li>
                  <li>
                    <strong>Fixed price:</strong> IPO prices are fixed regardless of market fluctuations during the application period.
                  </li>
                  <li>
                    <strong>Transparent allocation:</strong> SEBI-regulated allocation process ensures fairness.
                  </li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-4 rounded">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Risks</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Limited history:</strong> New public companies may have limited track records to evaluate.
                  </li>
                  <li>
                    <strong>Overvaluation:</strong> IPOs are sometimes priced at premium valuations to maximize capital raised.
                  </li>
                  <li>
                    <strong>Lock-in periods:</strong> Some IPO shares have lock-in periods restricting immediate selling.
                  </li>
                  <li>
                    <strong>Market volatility:</strong> New listings can experience significant price volatility.
                  </li>
                  <li>
                    <strong>Hype vs. reality:</strong> Marketing hype may not always translate to actual business performance.
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-3 mt-6" id="evaluating-ipos">How to Evaluate an IPO</h2>
            <p>
              Before investing in an IPO, thorough research is essential. Here are key factors to consider:
            </p>
            
            <div className="space-y-4 my-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-1">Company Fundamentals</h3>
                <p className="text-sm text-gray-700">Analyze the business model, revenue growth, profitability trends, market position, and competitive advantages.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-1">Management Quality</h3>
                <p className="text-sm text-gray-700">Assess the experience and track record of the company's leadership team and their skin in the game (promoter holdings).</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-1">Valuation</h3>
                <p className="text-sm text-gray-700">Compare the IPO valuation with industry peers using metrics like P/E ratio, P/B ratio, and EV/EBITDA.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-1">Issue Objectives</h3>
                <p className="text-sm text-gray-700">Understand how the company plans to use the IPO proceeds. Growth-oriented purposes like expansion are generally viewed more favorably than debt reduction.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-1">Industry Outlook</h3>
                <p className="text-sm text-gray-700">Consider the growth potential and regulatory environment of the industry in which the company operates.</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold mb-1">Risk Factors</h3>
                <p className="text-sm text-gray-700">Carefully read the "Risk Factors" section in the prospectus, which outlines potential challenges the company may face.</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-6 mt-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Pro Tip</h3>
              <p className="text-yellow-700">
                Don't blindly follow Grey Market Premium (GMP) indicators or subscription numbers. These can be misleading and don't always correlate with long-term performance. Always conduct your own research based on company fundamentals.
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-3 mt-6" id="common-terms">Common IPO Terms You Should Know</h2>
            
            <dl className="space-y-4 mb-6">
              <div>
                <dt className="font-semibold">Red Herring Prospectus (RHP)</dt>
                <dd className="pl-4 text-gray-700">A preliminary document submitted to SEBI that contains all details about the company and the IPO except the price and number of shares being offered.</dd>
              </div>
              
              <div>
                <dt className="font-semibold">Book Building</dt>
                <dd className="pl-4 text-gray-700">The process where investors bid for shares within a specified price band, helping determine the final issue price based on demand.</dd>
              </div>
              
              <div>
                <dt className="font-semibold">Price Band</dt>
                <dd className="pl-4 text-gray-700">The range between the floor price and the cap price within which investors can bid for shares in an IPO.</dd>
              </div>
              
              <div>
                <dt className="font-semibold">Cut-Off Price</dt>
                <dd className="pl-4 text-gray-700">The final issue price determined after the book building process, based on investor demand.</dd>
              </div>
              
              <div>
                <dt className="font-semibold">Lot Size</dt>
                <dd className="pl-4 text-gray-700">The minimum number of shares an investor must apply for in an IPO. For retail investors, the minimum application amount is typically around ₹15,000.</dd>
              </div>
              
              <div>
                <dt className="font-semibold">Application Supported by Blocked Amount (ASBA)</dt>
                <dd className="pl-4 text-gray-700">A mechanism where the application money remains in the investor's bank account but is blocked until share allotment. If shares are allotted, the amount is debited; otherwise, the block is released.</dd>
              </div>
              
              <div>
                <dt className="font-semibold">Unified Payments Interface (UPI)</dt>
                <dd className="pl-4 text-gray-700">A payment system that allows retail investors to block funds for IPO applications through mobile apps like BHIM, Google Pay, or PhonePe.</dd>
              </div>
              
              <div>
                <dt className="font-semibold">Listing Gains</dt>
                <dd className="pl-4 text-gray-700">The profit an investor makes if the shares list at a price higher than the issue price.</dd>
              </div>
            </dl>

            <h2 className="text-xl font-semibold mb-3 mt-6" id="conclusion">Conclusion</h2>
            <p>
              Initial Public Offerings represent a significant opportunity for investors to participate in a company's growth journey from an early stage. However, like any investment, they come with risks that must be carefully evaluated.
            </p>
            <p>
              By understanding the IPO process, conducting thorough research, and approaching each offering with a balanced perspective, investors can make informed decisions about whether a particular IPO aligns with their investment goals and risk tolerance.
            </p>
            <p>
              Remember that while some IPOs deliver outstanding returns, others may underperform. Diversification, patience, and a focus on fundamentals rather than market hype are key principles for successful IPO investing.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mt-8">
              <h3 className="text-lg font-semibold mb-2">Further Reading</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/guides/ipo-application" className="text-blue-600 hover:text-blue-800">
                    IPO Application Process: A Step-by-Step Guide
                  </Link>
                </li>
                <li>
                  <Link href="/guides/ipo-evaluation" className="text-blue-600 hover:text-blue-800">
                    How to Evaluate IPO Fundamentals
                  </Link>
                </li>
                <li>
                  <Link href="/guides/ipo-glossary" className="text-blue-600 hover:text-blue-800">
                    Complete IPO Terminology Glossary
                  </Link>
                </li>
                <li>
                  <Link href="/guides/ipo-allotment" className="text-blue-600 hover:text-blue-800">
                    Understanding the IPO Allotment Process
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
} 