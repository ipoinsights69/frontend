'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackEngagementTime } from '@/lib/analytics';

export function useEngagementTracking(pageId?: string) {
  const pathname = usePathname();
  const [startTime] = useState<number>(Date.now());
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastActiveTime, setLastActiveTime] = useState<number>(Date.now());
  const [totalInactiveTime, setTotalInactiveTime] = useState<number>(0);
  
  // Generate a pageId if not provided
  const trackingPageId = pageId || pathname || 'unknown-page';
  
  // Track visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is now hidden, record the time
        setIsVisible(false);
        setLastActiveTime(Date.now());
      } else {
        // Page is visible again, calculate inactive time
        setIsVisible(true);
        const inactiveTime = Date.now() - lastActiveTime;
        setTotalInactiveTime(prev => prev + inactiveTime);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastActiveTime]);
  
  // Track user activity
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      // Consider user inactive after 60 seconds of no interaction
      inactivityTimer = setTimeout(() => {
        setIsVisible(false);
        setLastActiveTime(Date.now());
      }, 60000);
    };
    
    const handleUserActivity = () => {
      if (!isVisible) {
        // User became active again after inactivity
        setIsVisible(true);
        const inactiveTime = Date.now() - lastActiveTime;
        setTotalInactiveTime(prev => prev + inactiveTime);
      }
      resetInactivityTimer();
    };
    
    // Add activity event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Start the inactivity timer
    resetInactivityTimer();
    
    return () => {
      // Clean up
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isVisible, lastActiveTime]);
  
  // Send engagement data when component unmounts
  useEffect(() => {
    return () => {
      const endTime = Date.now();
      const totalTimeMs = endTime - startTime;
      const activeTimeMs = totalTimeMs - totalInactiveTime;
      const activeTimeSeconds = Math.floor(activeTimeMs / 1000);
      
      // Only track if the user spent at least 5 seconds on the page
      if (activeTimeSeconds >= 5) {
        trackEngagementTime(trackingPageId, activeTimeSeconds);
      }
    };
  }, [startTime, totalInactiveTime, trackingPageId]);
} 