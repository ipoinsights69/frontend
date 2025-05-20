import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IPO } from '@/app/types/IPO';
import { fetchRecentlyListedIPOs } from '@/app/api/ipos/handlers';

// Safe color mapping to ensure we use only valid Tailwind classes
const COLORS = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
  },
};

const RelatedIPOs = () => {
  const [relatedIpos, setRelatedIpos] = useState<IPO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRelatedIPOs = async () => {
      try {
        const ipos = await fetchRecentlyListedIPOs(4);
        setRelatedIpos(ipos);
      } catch (error) {
        console.error('Error loading recently listed IPOs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRelatedIPOs();
  }, []);

  // Function to get initials from company name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Function to get color based on company name (for consistency)
  const getColor = (name: string) => {
    const colorKeys = Object.keys(COLORS);
    const index = name.length % colorKeys.length;
    return colorKeys[index];
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-md p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8">
      <h2 className="text-lg font-medium text-gray-800 mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {relatedIpos.map((ipo) => {
          const initials = getInitials(ipo.companyName);
          const colorKey = getColor(ipo.companyName);
          const colorClasses = COLORS[colorKey as keyof typeof COLORS];
          
          return (
            <div key={ipo.id} className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`w-8 h-8 ${colorClasses.bg} rounded-md flex items-center justify-center ${colorClasses.text} font-semibold text-sm mr-3`}>
                  {initials}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{ipo.companyName}</h3>
                  <p className="text-xs text-gray-500">{ipo.industry || 'General'}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Listed: {ipo.listingDate}</span>
                <span className="text-green-600 font-medium">+{ipo.listingGainPercentage?.toFixed(2) || 0}%</span>
              </div>
              <Link href={`/ipo/${ipo.id.replace(/^\d{4}_/, '')}`} className="text-xs text-blue-600 hover:text-blue-800">
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