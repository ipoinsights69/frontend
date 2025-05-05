'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageView } from '@/lib/analytics';

export function useAnalytics() {
  const pathname = usePathname();
  const [searchParamsString, setSearchParamsString] = useState('');
  
  // Only access useSearchParams in an effect that runs on the client
  useEffect(() => {
    try {
      const searchParams = useSearchParams();
      setSearchParamsString(searchParams?.toString() || '');
    } catch (error) {
      console.error('Error accessing search params:', error);
    }
  }, []);

  // Track page view in a separate effect that depends on both pathname and searchParamsString
  useEffect(() => {
    if (pathname) {
      // Create URL with search params for accurate tracking
      const url = pathname + (searchParamsString ? `?${searchParamsString}` : '');
      
      // Track page view in analytics
      pageView(url);
      
      // Log in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`Analytics: Tracking page view for ${url}`);
      }
    }
  }, [pathname, searchParamsString]);
} 