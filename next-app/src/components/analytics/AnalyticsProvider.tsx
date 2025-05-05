'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import PageTracker from './PageTracker';

interface AnalyticsProviderProps {
  children: ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  
  // Generate a unique page ID based on the current path
  const pageId = pathname ? `page_${pathname.replace(/\//g, '_')}` : 'unknown_page';
  
  return (
    <PageTracker pageId={pageId}>
      {children}
    </PageTracker>
  );
} 