'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faSearch, 
  faBell, 
  faBars 
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
    async function loadMenuItems() {
      try {
        const response = await fetch('/data/navigation.json');
        if (!response.ok) {
          throw new Error(`Failed to load navigation data: ${response.status}`);
        }
        const data = await response.json();
        
        // Update active state based on current URL
        const updatedData = data.map((item: MenuItem) => ({
          ...item,
          active: pathname === item.path
        }));
        
        setMenuItems(updatedData);
      } catch (error) {
        console.error('Error loading navigation data:', error);
        // Fallback menu items if JSON fails to load
        setMenuItems([
          { name: 'Dashboard', path: '/', active: pathname === '/' },
          { name: 'Market Overview', path: '/market', active: pathname === '/market' },
          { name: 'IPO Calendar', path: '/calendar', active: pathname === '/calendar' },
          { name: 'Performance Tracker', path: '/performance', active: pathname === '/performance' },
          { name: 'Insights', path: '/insights', active: pathname === '/insights' }
        ]);
      }
    }
    
    loadMenuItems();
  }, [pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="h-8 w-8 bg-blue-600 text-white rounded-md flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faChartLine} className="text-sm" />
            </div>
            <span className="text-base font-medium text-gray-800">
              IPO<span className="text-blue-600">Insight</span>
            </span>
          </div>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className={`text-sm font-medium pb-3 border-b-2 transition duration-150 ${
                  item.active
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800 border-transparent hover:border-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* User actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-gray-50 rounded-md pl-3 pr-2 py-1.5 border border-gray-200">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-xs mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400 w-32"
              />
            </div>
            
            <button className="text-gray-600 hover:text-gray-900 relative p-1 rounded-full hover:bg-gray-100 transition duration-150">
              <FontAwesomeIcon icon={faBell} className="text-sm" />
              <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]">
                2
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-1 rounded-md hover:bg-gray-100 transition duration-150"
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faBars} className="text-sm" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden border-t border-gray-200 bg-white ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div className="py-2 space-y-1 px-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              href={item.path}
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-3 pb-1">
            <div className="flex items-center bg-gray-50 rounded-md pl-3 pr-4 py-1.5 border border-gray-200">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-xs mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 