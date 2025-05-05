'use client';

import { useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';

interface TrackClickOptions {
  action?: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export function useTrackClick({
  action = 'click',
  category = 'user_interaction',
  label,
  value,
  ...customProperties
}: TrackClickOptions = {}) {
  const trackClick = useCallback((event?: React.MouseEvent | React.TouchEvent, overrideProps?: TrackClickOptions) => {
    // Get element information if available
    const element = event?.currentTarget as HTMLElement | undefined;
    const elementId = element?.id;
    const elementText = element?.textContent || '';
    const elementType = element?.tagName.toLowerCase() || '';
    const elementClasses = element?.className || '';
    
    // Combine default props with override props
    const combinedProps = {
      action,
      category,
      label: overrideProps?.label || label || elementText,
      value: overrideProps?.value || value,
      elementId,
      elementType,
      elementClasses,
      ...customProperties,
      ...overrideProps
    };
    
    // Track the event
    trackEvent(combinedProps);
  }, [action, category, label, value, customProperties]);
  
  return trackClick;
} 