import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/app/utils/dateUtils';

interface RelatedIPOsProps {
  ipos: any[];
}

const RelatedIPOs: React.FC<RelatedIPOsProps> = ({ ipos }) => {
  if (!ipos || ipos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8">
      <h2 className="text-lg font-medium text-gray-800 mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ipos.map((ipo) => {
          const logoPlaceholder = ipo.company_name?.substring(0, 2) || 'IP';
          const listingGains = ipo.listing_gains_numeric || 0;
          const gainColor = listingGains >= 0 ? 'text-green-600' : 'text-red-600';
          
          return (
            <div 
              key={ipo.ipo_id} 
              className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                  {logoPlaceholder}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{ipo.company_name}</h3>
                  <p className="text-xs text-gray-500">{ipo.sector || 'Business'}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>
                  {ipo.status === 'listed' ? 'Listed: ' : ipo.status === 'upcoming' ? 'Opens: ' : 'Closed: '}
                  {formatDate(ipo.listing_date || ipo.opening_date || ipo.closing_date)}
                </span>
                {ipo.listing_gains_numeric && (
                  <span className={`font-medium ${gainColor}`}>
                    {listingGains > 0 ? '+' : ''}{listingGains.toFixed(2)}%
                  </span>
                )}
              </div>
              <Link href={`/ipo/${ipo.ipo_id}`} className="text-xs text-blue-600 hover:text-blue-800">
                View Details →
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedIPOs; 