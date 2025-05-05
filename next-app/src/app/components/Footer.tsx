import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Company info */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-blue-600 text-white rounded-md flex items-center justify-center mr-3">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <span className="text-xl font-semibold text-gray-800">IPO<span className="text-blue-600">Hut</span></span>
            </div>
            <p className="text-gray-600 mb-2">
              Your one-stop destination for comprehensive IPO information.
            </p>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} IPOHut. All rights reserved.</p>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600">Terms</Link>
            <Link href="/disclaimer" className="text-gray-600 hover:text-blue-600">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 