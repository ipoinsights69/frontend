'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export function useScrollDepthTracking(pageId?: string) {
  const [scrollDepthMarkers] = useState<number[]>([25, 50, 75, 90, 100]);
  const [trackedDepths, setTrackedDepths] = useState<Set<number>>(new Set());
  
  useEffect(() => {
    const calculateScrollDepth = () => {
      // Calculate how far the user has scrolled as a percentage
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Handle cases where the document height equals window height (no scroll possible)
      if (documentHeight <= windowHeight) {
        if (!trackedDepths.has(100)) {
          trackScrollDepth(100);
          setTrackedDepths(prev => new Set(prev).add(100));
        }
        return;
      }
      
      // Calculate scroll percentage
      const scrolled = scrollTop + windowHeight;
      const percentage = Math.floor((scrolled / documentHeight) * 100);
      
      // Check if any depth markers have been hit
      scrollDepthMarkers.forEach(marker => {
        if (percentage >= marker && !trackedDepths.has(marker)) {
          trackScrollDepth(marker);
          setTrackedDepths(prev => {
            const newSet = new Set(prev);
            newSet.add(marker);
            return newSet;
          });
        }
      });
    };
    
    // Track scroll depth
    function trackScrollDepth(depth: number) {
      trackEvent({
        action: 'scroll_depth',
        category: 'engagement',
        label: pageId || window.location.pathname,
        value: depth,
        nonInteraction: true,
      });
    }
    
    // Debounce scroll event for performance
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(calculateScrollDepth, 100);
    };
    
    // Track on initial load
    calculateScrollDepth();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageId, scrollDepthMarkers, trackedDepths]);
} 