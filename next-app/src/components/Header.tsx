import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-indigo-600 flex items-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="6" height="16" rx="1" fill="currentColor" />
              <rect x="13" y="4" width="6" height="24" rx="1" fill="currentColor" />
              <rect x="22" y="12" width="6" height="16" rx="1" fill="currentColor" />
              <path d="M6 5L26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 24L28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ml-2 text-xl font-bold">IPO Insights</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/ipo-calendar" className="text-gray-600 hover:text-gray-900">
            IPO Calendar
          </Link>
          <Link href="/market-analysis" className="text-gray-600 hover:text-gray-900">
            Market Analysis
          </Link>
          <Link href="/research" className="text-gray-600 hover:text-gray-900">
            Research
          </Link>
          <Link href="/news" className="text-gray-600 hover:text-gray-900">
            News
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 