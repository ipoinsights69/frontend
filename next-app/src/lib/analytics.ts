/**
 * Analytics Configuration
 * This file centralizes analytics tracking functionality
 */

// Get environment variables
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

// Track page views in Google Analytics
export const pageView = (url: string) => {
  if (!GA_MEASUREMENT_ID) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track events in Google Analytics
export const trackEvent = ({ 
  action, 
  category, 
  label, 
  value, 
  nonInteraction = false,
  ...rest
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  [key: string]: any;
}) => {
  if (!GA_MEASUREMENT_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    non_interaction: nonInteraction,
    ...rest,
  });
};

// Track button clicks
export const trackButtonClick = (buttonText: string, buttonLocation: string) => {
  trackEvent({
    action: 'button_click',
    category: 'engagement',
    label: buttonText,
    buttonLocation,
  });
};

// Track form submissions
export const trackFormSubmit = (formName: string, formStatus: 'success' | 'error') => {
  trackEvent({
    action: 'form_submit',
    category: 'conversion',
    label: formName,
    formStatus,
  });
};

// Track search queries
export const trackSearch = (searchQuery: string, resultsCount: number) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: searchQuery,
    value: resultsCount,
  });
};

// Track IPO card views
export const trackIPOCardView = (ipoId: string, ipoName: string) => {
  trackEvent({
    action: 'ipo_card_view',
    category: 'content',
    label: ipoName,
    ipoId,
  });
};

// Track IPO detail page views
export const trackIPODetailView = (ipoId: string, ipoName: string) => {
  trackEvent({
    action: 'ipo_detail_view',
    category: 'content',
    label: ipoName,
    ipoId,
  });
};

// Track tab changes
export const trackTabChange = (tabSection: string, tabName: string) => {
  trackEvent({
    action: 'tab_change',
    category: 'navigation',
    label: tabSection,
    tabName,
  });
};

// Track user engagement time
export const trackEngagementTime = (pageId: string, timeInSeconds: number) => {
  trackEvent({
    action: 'engagement_time',
    category: 'engagement',
    label: pageId,
    value: timeInSeconds,
  });
};

// Custom event tracking for specific user behaviors
export const trackCustomEvent = (eventDetails: {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}) => {
  trackEvent(eventDetails);
}; 