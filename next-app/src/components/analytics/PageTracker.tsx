'use client';

import { ReactNode } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useScrollDepthTracking } from '@/hooks/useScrollDepthTracking';

interface PageTrackerProps {
  children: ReactNode;
  pageId?: string;
}

export default function PageTracker({ children, pageId }: PageTrackerProps) {
  // Initialize all tracking hooks
  useAnalytics();
  useEngagementTracking(pageId);
  useScrollDepthTracking(pageId);
  
  return <>{children}</>;
} 