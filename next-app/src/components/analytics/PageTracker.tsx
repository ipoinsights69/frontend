'use client';

import { ReactNode, Suspense } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useScrollDepthTracking } from '@/hooks/useScrollDepthTracking';

interface PageTrackerProps {
  children: ReactNode;
  pageId?: string;
}

function AnalyticsTrackers({ pageId }: { pageId?: string }) {
  // Initialize all tracking hooks
  useAnalytics();
  useEngagementTracking(pageId);
  useScrollDepthTracking(pageId);
  
  return null;
}

export default function PageTracker({ children, pageId }: PageTrackerProps) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTrackers pageId={pageId} />
      </Suspense>
      {children}
    </>
  );
} 