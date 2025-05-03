/**
 * API Configuration
 * This file centralizes API URL configuration to make it easier to change in one place
 */

// The base URL for API requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Revalidation settings
export const DEFAULT_REVALIDATION_TIME = 3600; // 1 hour in seconds

// Export a function to build API URLs
export const getApiUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Ensure we have a trailing slash on the base URL if needed
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  
  return `${baseUrl}${cleanPath}`;
}; 