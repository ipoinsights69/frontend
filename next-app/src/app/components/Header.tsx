'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

// Navigation menu type
interface MenuItem {
  name: string;
  path: string;
  active: boolean;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const pathname = usePathname();

  // Load menu items from JSON file
  useEffect(() => {
    // Add link to the IPOs list page
    setMenuItems([
      { name: 'Home', path: '/', active: pathname === '/' },
      { name: 'All IPOs', path: '/ids', active: pathname === '/ids' }
    ]);
  }, [pathname]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 transition-opacity hover:opacity-80">
            <div className="h-9 w-9 bg-blue-600 text-white rounded-md flex items-center justify-center mr-2 shadow-sm">
              <FontAwesomeIcon icon={faChartLine} className="text-sm" />
            </div>
            <span className="text-lg font-medium text-gray-800">
              IPO<span className="text-blue-600 font-semibold">Insight</span>
            </span>
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className={`text-sm font-medium pb-5 border-b-2 transition duration-150 ${
                  item.active
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-white pt-2 pb-4 px-4 space-y-1 border-t border-gray-200">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 