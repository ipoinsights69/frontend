/**
 * Gets a nested value from an object using a path string or array.
 * 
 * @param obj - The object to get the value from.
 * @param path - The path to the value, either as a dot-separated string or an array of keys.
 * @returns The value at the path, or undefined if not found.
 */
export function getNestedValue(obj: any, path: string | string[] | number[]): any {
  if (!obj || !path) return undefined;
  
  // If path is a string, split it into an array
  if (typeof path === 'string') {
    path = path.split('.');
  }
  
  // Reduce through the path to get the value
  return path.reduce((acc, curr) => {
    // Handle array indices (both string and number)
    if (acc && typeof acc === 'object') {
      if (Array.isArray(acc) && typeof curr === 'string' && !isNaN(Number(curr))) {
        return acc[Number(curr)];
      }
      return acc[curr];
    }
    return undefined;
  }, obj);
} 