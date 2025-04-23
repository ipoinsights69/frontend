/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'N/A';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Get the difference in days between two dates
 */
export function getDaysDiff(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Check if dates are valid
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  
  // Get time difference in milliseconds
  const diffTime = d1.getTime() - d2.getTime();
  
  // Convert to days and round
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get a relative time string (e.g., "3 days ago", "in 5 days")
 */
export function getRelativeTimeString(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'N/A';
  
  const daysDiff = getDaysDiff(date, now);
  
  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Tomorrow';
  if (daysDiff === -1) return 'Yesterday';
  
  if (daysDiff > 0) {
    return `in ${daysDiff} days`;
  } else {
    return `${Math.abs(daysDiff)} days ago`;
  }
} 