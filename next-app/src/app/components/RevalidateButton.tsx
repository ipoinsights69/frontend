'use client';

import { useState } from 'react';

export default function RevalidateButton() {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleRevalidate = async () => {
    setIsRevalidating(true);
    setResult(null);
    
    try {
      // You can set the secret in .env.local file
      const secret = 'your-default-secret-key'; // For development only - use env var in production
      
      // Revalidate the homepage and IPO pages
      const response = await fetch(`/api/revalidate?secret=${secret}&path=/`);
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: data.message || 'Cache successfully revalidated!'
        });
        
        // Also revalidate the IPO pages
        await fetch(`/api/revalidate?secret=${secret}&path=/ipo`);
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to revalidate cache'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: String(error) || 'An error occurred during revalidation'
      });
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleRevalidate}
        disabled={isRevalidating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRevalidating ? 'Revalidating...' : 'Refresh IPO Data'}
      </button>
      
      {result && (
        <div className={`mt-2 p-3 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
} 