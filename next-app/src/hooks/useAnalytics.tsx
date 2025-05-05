import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageView } from '@/lib/analytics';

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Create URL with search params for accurate tracking
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Track page view in analytics
      pageView(url);
      
      // Log in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`Analytics: Tracking page view for ${url}`);
      }
    }
  }, [pathname, searchParams]);
} 